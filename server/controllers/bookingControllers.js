
import Slot from "../models/SlotModel.js";
import Booking from "../models/BookingModel.js";
import { isAllowedMarch2026OddDate, generateSlotsForDate } from "../utils/helper.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import mongoose from "mongoose";
import { sendBookingEmail } from "../services/sendMail.js";
import { createBookingSchema } from "../validation/BookingValidation.js";
import { logger, reqMeta } from "../utils/logger.js";




export const getSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!isAllowedMarch2026OddDate(date)) {
      return res.status(400).json({
        message: "Only odd dates in March 2026 are allowed.",
      });
    }


    const generated = generateSlotsForDate(date);

    for (const s of generated) {
      await Slot.updateOne(
        { date, start: s.start },
        {
          $setOnInsert: {
            date,
            start: s.start,
            end: s.end,
            label: s.label,
            capacity: 4,
            bookedCount: 0,
          },
        },
        { upsert: true }
      );
    }

    const slots = await Slot.find({ date }).sort({ start: 1 });

    const result = slots.map((sl) => ({
      _id: sl._id,
      date: sl.date,
      label: sl.label,
      capacity: sl.capacity,
      bookedCount: sl.bookedCount,
      remaining: Math.max(0, sl.capacity - sl.bookedCount),
      isFull: sl.bookedCount >= sl.capacity,
    }));

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};





export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  const baseMeta = { requestId: req.requestId, ...reqMeta(req) };
  try {
    logger.debug("Create booking: request received", baseMeta);

    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;

      logger.info("Create booking: validation failed", {
        ...baseMeta,
        fieldErrors,
      });

      return res.status(400).json({ error: fieldErrors });
    }

    const { fullName, email, phone, date, slotId, message, city, country } =
      parsed.data;

    // Phone normalization (avoid crash if parse fails)
    const phoneObj = parsePhoneNumberFromString(phone);
    if (!phoneObj?.isValid?.()) {
      logger.info("Create booking: invalid phone", {
        ...baseMeta,
        phone,
        slotId,
        date,
        email,
      });
      return res.status(400).json({ message: "Invalid phone number." });
    }

    session.startTransaction();

    const slot = await Slot.findById(slotId).session(session);

    if (!slot) {
      await session.abortTransaction();

      logger.info("Create booking: slot not found", {
        ...baseMeta,
        slotId,
        date,
        email,
      });

      return res.status(404).json({ message: "Slot not found." });
    }

    if (slot.date !== date) {
      await session.abortTransaction();

      logger.warn("Create booking: slot/date mismatch", {
        ...baseMeta,
        slotId,
        requestedDate: date,
        slotDate: slot.date,
        email,
      });

      return res
        .status(400)
        .json({ message: "Slot does not match selected date." });
    }

    // Atomic capacity increment (prevents >capacity under concurrency)
    const updatedSlot = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        $expr: { $lt: ["$bookedCount", "$capacity"] },
      },
      { $inc: { bookedCount: 1 } },
      { returnDocument: "after", session }
    );

    if (!updatedSlot) {
      await session.abortTransaction();

      logger.info("Create booking: slot full", {
        ...baseMeta,
        slotId,
        date,
        email,
      });

      return res.status(409).json({ message: "Slot is full." });
    }

    const bookingDocs = await Booking.create(
      [
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phoneObj.number, // E.164
          country,
          city: city?.trim() || "",
          date,
          slotId,
          slotLabel: updatedSlot.label,
          message: message?.trim() || "",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const saved = bookingDocs[0];

    logger.info("Create booking: booking created", {
      ...baseMeta,
      bookingId: saved._id.toString(),
      slotId: saved.slotId.toString(),
      date: saved.date,
      slotLabel: saved.slotLabel,
      email: saved.email,
      country: saved.country,
    });

    // Email is best-effort: do not fail booking if provider fails
    try {
      await sendBookingEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New booking: ${saved.fullName} (${saved.date} ${saved.slotLabel})`,
        user: "Admin",
        msg: "New booking received. Please check the dashboard.",
        number: saved.phone,
        country: saved.country,
        bookingId: saved._id.toString(),
        date: saved.date,
        slotLabel: saved.slotLabel,
      });

      await sendBookingEmail({
        to: saved.email,
        subject: "Your booking is confirmed ✅",
        user: saved.fullName,
        msg: `Your booking has been confirmed for ${saved.date} at ${saved.slotLabel}.`,
        number: saved.phone,
        country: saved.country,
        bookingId: saved._id.toString(),
        date: saved.date,
        slotLabel: saved.slotLabel,
      });

      logger.info("Create booking: emails sent", {
        ...baseMeta,
        bookingId: saved._id.toString(),
      });
    } catch (mailErr) {
      logger.warn("Create booking: email send failed", {
        ...baseMeta,
        bookingId: saved._id.toString(),
        error: mailErr?.message || String(mailErr),
      });
    }

    return res.status(201).json({
      message: "Booking created successfully.",
      booking: {
        id: saved._id,
        fullName: saved.fullName,
        email: saved.email,
        phone: saved.phone,
        date: saved.date,
        slot: saved.slotLabel,
        country: saved.country,
        city: saved.city,
        message: saved.message,
      },
    });
  } catch (err) {
    // abort transaction if active
    try {
      await session.abortTransaction();
    } catch {}

    // duplicate booking (email+slot unique index)
    if (err?.code === 11000) {
      logger.info("Create booking: duplicate booking blocked", {
        ...baseMeta,
        error: err?.message,
      });
      return res.status(409).json({ message: "Duplicate booking." });
    }

    logger.error("Create booking: server error", {
      ...baseMeta,
      error: err?.message || String(err),
      stack: err?.stack,
    });

    return res.status(500).json({ message: "Server error." });
  } finally {
    session.endSession();
  }
};