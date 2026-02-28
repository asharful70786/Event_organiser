import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ashrafulmomin2@gmail.com";
const FROM_EMAIL = process.env.MAIL_FROM || "March Event <bookings@zenpix.shop>";

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildUserHtml(booking, eventNote) {
  const { fullName, email, phone, date, slotLabel, country, city, message } =
    booking;

  return `
  <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; line-height:1.5;">
    <h2 style="margin:0 0 10px;">Booking Confirmed ✅</h2>

    <p style="margin:0 0 14px;">
      Hi <strong>${escapeHtml(fullName)}</strong>, your booking for the <strong>March 2026 Event</strong> is confirmed.
    </p>

    ${
      eventNote
        ? `<div style="background:#f3f4f6; padding:12px; border-radius:10px; margin:14px 0;">
             <strong>Event Note:</strong><br/>
             ${escapeHtml(eventNote)}
           </div>`
        : ""
    }

    <div style="border:1px solid #e5e7eb; border-radius:10px; padding:14px; margin:18px 0;">
      <p style="margin:0 0 8px;"><strong>Date:</strong> ${escapeHtml(date)}</p>
      <p style="margin:0 0 8px;"><strong>Time Slot:</strong> ${escapeHtml(slotLabel)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:0 0 8px;"><strong>Location:</strong> ${escapeHtml(
        [city, country].filter(Boolean).join(", ")
      )}</p>
      <p style="margin:0;"><strong>Your Message:</strong><br/>${escapeHtml(
        message || "(none)"
      )}</p>
    </div>

    <p style="margin:18px 0 0; font-size:12px; color:#6b7280;">
      If you did not make this booking, reply to this email.
    </p>
  </div>`;
}

function buildAdminHtml(booking, adminNote) {
  const { _id, fullName, email, phone, date, slotLabel, country, city, message } =
    booking;

  return `
  <div style="font-family:Arial, sans-serif; max-width:700px; margin:auto; line-height:1.5;">
    <h2 style="margin:0 0 10px;">New Booking Received 📩</h2>

    ${
      adminNote
        ? `<div style="background:#fff7ed; padding:12px; border-radius:10px; margin:14px 0; border:1px solid #fed7aa;">
             <strong>Admin Note:</strong><br/>
             ${escapeHtml(adminNote)}
           </div>`
        : ""
    }

    <div style="border:1px solid #e5e7eb; border-radius:10px; padding:14px; margin:18px 0;">
      <p style="margin:0 0 8px;"><strong>Booking ID:</strong> ${escapeHtml(_id)}</p>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:0 0 8px;"><strong>Date:</strong> ${escapeHtml(date)}</p>
      <p style="margin:0 0 8px;"><strong>Time Slot:</strong> ${escapeHtml(slotLabel)}</p>
      <p style="margin:0 0 8px;"><strong>Country:</strong> ${escapeHtml(country)}</p>
      <p style="margin:0 0 8px;"><strong>City:</strong> ${escapeHtml(city || "")}</p>
      <p style="margin:0;"><strong>User Message:</strong><br/>${escapeHtml(
        message || "(none)"
      )}</p>
    </div>
  </div>`;
}


export async function sendBookingEmails(booking, opts = {}) {
  const userEventNote = opts.userEventNote || "";
  const adminNote = opts.adminNote || "A new booking was created.";

  const userSubject = `Booking confirmed: ${booking.date} (${booking.slotLabel})`;
  const adminSubject = `New booking: ${booking.fullName} — ${booking.date} (${booking.slotLabel})`;

  // User
  await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.email,
    subject: userSubject,
    html: buildUserHtml(booking, userEventNote),
    text:
      `Booking Confirmed\n\n` +
      (userEventNote ? `Event Note: ${userEventNote}\n\n` : "") +
      `Name: ${booking.fullName}\nEmail: ${booking.email}\nPhone: ${booking.phone}\n` +
      `Date: ${booking.date}\nSlot: ${booking.slotLabel}\nMessage: ${booking.message || "(none)"}\n`,
  });

  // Admin
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: adminSubject,
    html: buildAdminHtml(booking, adminNote),
    text:
      `New Booking\n\n` +
      `Admin Note: ${adminNote}\n\n` +
      `Name: ${booking.fullName}\nEmail: ${booking.email}\nPhone: ${booking.phone}\n` +
      `Date: ${booking.date}\nSlot: ${booking.slotLabel}\nCountry: ${booking.country}\nCity: ${booking.city || ""}\n` +
      `Message: ${booking.message || "(none)"}\n`,
  });

  return { success: true };
}