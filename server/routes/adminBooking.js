

import express from "express";
import { adminAuth } from "../middleware/authCheck.js";
import Booking from "../models/BookingModel.js";

const router = express.Router();

// simple validation endpoint
router.get("/validate", adminAuth, (req, res) => {
  console.log("hit on admin ");
  res.status(200).json({ success: true });
});

router.get("/bookings", adminAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "15", 10), 1), 100);
    const skip = (page - 1) * limit;

    const { name = "", phone = "", date = "", country = "" } = req.query;

    const filter = {};
    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (phone) filter.phone = { $regex: phone, $options: "i" };
    if (date) filter.date = date; // store date as YYYY-MM-DD string in Booking
    if (country) filter.country = { $regex: country, $options: "i" };

    const [items, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter),
    ]);

    return res.status(200).json({
      items,
      total,
      page,
      limit,
    
    });
  } catch (err) {
    console.error("ADMIN_GET_BOOKINGS_ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
});




router.get("/bookings/export", adminAuth, async (req, res) => {
  try {
    const { name = "", phone = "", date = "", country = "" } = req.query;

    const filter = {};
    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (phone) filter.phone = { $regex: phone, $options: "i" };
    if (date) filter.date = date;
    if (country) filter.country = { $regex: country, $options: "i" };

    const items = await Booking.find(filter).sort({ createdAt: -1 }).lean();
    console.log(items);

    const escapeCsv = (val) => {
      const s = String(val ?? "");
      // wrap in quotes and escape quotes
      return `"${s.replace(/"/g, '""')}"`;
    };

    const header = [
      "Full Name",
      "Email",
      "Phone",
      "Country",
      "Date",
      "Slot",
      "Message",
      "Created At",
    ];

    const rows = items.map((b) => [
      escapeCsv(b.fullName),
      escapeCsv(b.email),
      escapeCsv(b.phone),
      escapeCsv(b.country),
      escapeCsv(b.date),
      escapeCsv(b.slotLabel || b.slot),
      escapeCsv(b.message),
      escapeCsv(b.createdAt),
    ]);

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="bookings.csv"`);

    return res.status(200).send(csv);
  } catch (err) {
    console.error("ADMIN_EXPORT_ERROR:", err);
    return res.status(500).json({ message: "Failed to export bookings" });
  }
});





export default router;