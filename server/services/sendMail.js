// services/sendBookingEmail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.MAIL_FROM || "Appointment Confirmation <appoinment@zenpix.shop>";

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendBookingEmail({
  to,            // receiver email
  subject,
  user,          // name
  msg,           // message note
  number,        // phone
  country,       // country code
  bookingId,
  date,          // "2026-03-07"
  slotLabel,     // optional (recommended)
}) {
  if (!to) throw new Error("Missing 'to' email");
  if (!subject) throw new Error("Missing 'subject'");

  const safe = {
    user: esc(user),
    msg: esc(msg),
    number: esc(number),
    country: esc(country),
    bookingId: esc(bookingId),
    date: esc(date),
    slotLabel: esc(slotLabel || ""),
  };

  const html = `<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Hello ${safe.user || "there"}</h2>
    <p>${safe.msg || ""}</p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />

    <p><strong>Booking ID:</strong> ${safe.bookingId}</p>
    <p><strong>Date:</strong> ${safe.date}</p>
    ${safe.slotLabel ? `<p><strong>Slot:</strong> ${safe.slotLabel}</p>` : ""}
    <p><strong>Phone:</strong> ${safe.number}</p>
    <p><strong>Country:</strong> ${safe.country}</p>
  </body>
</html>`;

  const text =
    `Hello ${user || "there"}\n\n` +
    `${msg || ""}\n\n` +
    `Booking ID: ${bookingId}\n` +
    `Date: ${date}\n` +
    (slotLabel ? `Slot: ${slotLabel}\n` : "") +
    `Phone: ${number}\n` +
    `Country: ${country}\n`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text, // real plaintext, not HTML garbage
  });

  return { success: true };
}