
import express from "express";
import { getSlots, createBooking } from "../controllers/bookingControllers.js";
import { slotsQuerySchema, createBookingSchema } from "../validation/BookingValidation.js";
import { limiter } from "../middleware/limiter.js";

const router = express.Router();



router.get("/slots",  getSlots);


router.post("/bookings", limiter,  createBooking);




export default router;