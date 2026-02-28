
import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const e164Regex = /^\+[1-9]\d{7,14}$/;   // basic E.164

export const slotsQuerySchema = z.object({
  date: z.string().regex(dateRegex, "date must be YYYY-MM-DD"),
});

export const createBookingSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().regex(e164Regex, "phone must be in E.164 format like +9198xxxxxx"),

  date: z.string().regex(dateRegex, "date must be YYYY-MM-DD"),
  slotId: z.string().min(10, "slotId looks invalid"),

  message: z.string().max(1200).optional().or(z.literal("")),
});