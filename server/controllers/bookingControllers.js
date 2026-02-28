
import Slot from "../models/SlotModel.js";
import Booking from "../models/BookingModel.js";
import { isAllowedMarch2026OddDate, generateSlotsForDate } from "../utils/helper.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import mongoose from "mongoose";
import { sendBookingEmails } from "../services/sendMail.js";



export const getSlots = async (req, res) => {
  try {
    const { date } = req.query;
    console.log(req.body)

    if (!isAllowedMarch2026OddDate(date)) {
      return res.status(400).json({
        message: "Only odd dates in March 2026 are allowed.",
      });
    }

    // Ensure slots exist (simple upsert loop)
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

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { fullName, email, phone, date, slotId, message, city, country } =
      req.body;

    // Minimal required validation
    if (!fullName || !email || !phone || !date || !slotId || !country) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate ISO country (2 uppercase letters)
    if (!/^[A-Z]{2}$/.test(country)) {
      return res.status(400).json({ message: "Invalid country code." });
    }

    // Validate phone properly (E.164)
    const phoneObj = parsePhoneNumberFromString(phone);
    if (!phoneObj || !phoneObj.isValid()) {
      return res.status(400).json({ message: "Invalid phone number." });
    }

    session.startTransaction();

    const slot = await Slot.findById(slotId).session(session);
    if (!slot) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Slot not found." });
    }

    if (slot.date !== date) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Slot does not match selected date." });
    }

    // Atomic capacity check
    const updatedSlot = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        $expr: { $lt: ["$bookedCount", "$capacity"] },
      },
      { $inc: { bookedCount: 1 } },
      {
        returnDocument: "after",
        session,
      }
    );

    if (!updatedSlot) {
      await session.abortTransaction();
      return res.status(409).json({ message: "Slot is full." });
    }

    const booking = await Booking.create(
      [
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phoneObj.number, // normalized E.164
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
    const saved = booking[0];

    // send mail here  
    
  
     
     res.status(201).json({
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
      },
    });

     try {
  await sendBookingEmails(saved, {
    userEventNote: `You’re booked for ${saved.date} at ${saved.slotLabel}. See you in March 2026.`,
    adminNote: `User registered to the March Event (${saved.date} - ${saved.slotLabel}).`,
  });
  await sendBookingEmails(saved, {
    userEventNote: `You’re booked for ${saved.date} at ${saved.slotLabel}. See you in March 2026.`
  });
  // also have t send mail to the user as well with a different message (confirmation + event note)
  


} catch (mailErr) {
  console.error("Email send failed:", mailErr?.message || mailErr);
}


  } catch (err) {
    try {
      await session.abortTransaction();
    } catch {}

    if (err?.code === 11000) {
      return res.status(409).json({ message: "Duplicate booking." });
    }

    return res
      .status(500)
      .json({ message: err?.message || "Server error." });
  } finally {
    session.endSession();
  }
};