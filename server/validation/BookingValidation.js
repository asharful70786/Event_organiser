
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/; 
const e164Regex = /^\+[1-9]\d{7,14}$/;  
export const slotsQuerySchema = z.object({
  date: z.string().regex(dateRegex, "date must be YYYY-MM-DD"),
});



export const createBookingSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is too short").max(80),
    email: z.string().trim().email("Invalid email"),
    phone: z.string().trim().regex(e164Regex, "phone must be E.164 like +9198xxxxxx"),
    country: z.string().trim().regex(/^[A-Z]{2}$/, "Invalid country code (ISO2 like IN, US)"),
    city: z.string().trim().max(80).optional().or(z.literal("")).default(""),
    date: z.string().trim().regex(dateRegex, "date must be YYYY-MM-DD"),
    slotId: z.string().trim().min(10, "slotId looks invalid"),
    message: z.string().trim().max(1200).optional().or(z.literal("")).default(""),
  })
  .superRefine((val, ctx) => {
    const phoneObj = parsePhoneNumberFromString(val.phone);
    if (!phoneObj || !phoneObj.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Invalid phone number",
      });
      return;
    }

    const phoneCountry = phoneObj.country; 
    if (phoneCountry && phoneCountry !== val.country) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["country"],
        message: "Country does not match phone number",
      });
    }
  });