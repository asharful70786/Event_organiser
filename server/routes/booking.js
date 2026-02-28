
import express from "express";
import { getSlots, createBooking } from "../controllers/bookingControllers.js";
import { slotsQuerySchema, createBookingSchema } from "../validation/BookingValidation.js";

const router = express.Router();

// simple zod validator
function validate(schema, where = "body") {
  return (req, res, next) => {
    const data = where === "query" ? req.query : req.body;
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const first = parsed.error.issues?.[0]?.message || "Validation error";
      return res.status(400).json({ message: first });
    }

    if (where === "query") req.query = parsed.data;
    else req.body = parsed.data;

    next();
  };
}

// USER ROUTES

// validate(slotsQuerySchema, "query")
router.get("/slots",  getSlots);


router.post("/bookings", createBooking);
// validate(createBookingSchema, "body"),

export default router;