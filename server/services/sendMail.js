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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmed</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0a0f1e;font-family:'Georgia',serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0f1e;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;
                 box-shadow:0 30px 80px rgba(0,0,0,0.6);">

          <!-- ── HEADER ── -->
          <tr>
            <td style="
              background: linear-gradient(135deg, #0d2137 0%, #0a4a3a 60%, #0d6b52 100%);
              padding: 48px 48px 36px;
              text-align: center;
              position: relative;
            ">
              <!-- Decorative top accent line -->
              <div style="
                background: linear-gradient(90deg, transparent, #34d399, #10b981, #34d399, transparent);
                height: 2px;
                margin-bottom: 32px;
                border-radius: 2px;
              "></div>

              <!-- Checkmark badge -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
                <tr>
                  <td style="
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 50%;
                    width: 72px;
                    height: 72px;
                    text-align: center;
                    vertical-align: middle;
                    box-shadow: 0 0 0 8px rgba(16,185,129,0.15), 0 0 0 16px rgba(16,185,129,0.07);
                  ">
                    <span style="font-size:32px;line-height:72px;color:#ffffff;">&#10003;</span>
                  </td>
                </tr>
              </table>

              <h1 style="
                margin: 0 0 8px;
                font-size: 11px;
                font-family: 'Courier New', monospace;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: #34d399;
                font-weight: 400;
              ">Booking Confirmed</h1>

              <h2 style="
                margin: 0;
                font-size: 30px;
                font-weight: 700;
                color: #f0fdf9;
                font-family: Georgia, serif;
                letter-spacing: -0.5px;
              ">Your appointment is set.</h2>

              <!-- Decorative bottom accent -->
              <div style="
                background: linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent);
                height: 1px;
                margin-top: 32px;
              "></div>
            </td>
          </tr>

          <!-- ── GREETING ── -->
          <tr>
            <td style="background-color:#0f1e2e;padding:36px 48px 0;">
              <p style="
                margin:0;
                font-size:17px;
                color:#cbd5e1;
                font-family:Georgia,serif;
                line-height:1.7;
              ">
                Hello, <strong style="color:#f0fdf9;">${safe.user || "there"}</strong> —
              </p>
              <p style="
                margin:12px 0 0;
                font-size:15px;
                color:#94a3b8;
                font-family:Georgia,serif;
                line-height:1.8;
              ">${safe.msg || "Thank you for your booking. We look forward to seeing you."}</p>
            </td>
          </tr>

          <!-- ── BOOKING DETAILS CARD ── -->
          <tr>
            <td style="background-color:#0f1e2e;padding:28px 48px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="
                  background: linear-gradient(145deg, #0d2137, #112435);
                  border-radius: 14px;
                  border: 1px solid rgba(52,211,153,0.18);
                  overflow: hidden;
                ">

                <!-- Card header label -->
                <tr>
                  <td colspan="2" style="
                    padding: 16px 24px;
                    border-bottom: 1px solid rgba(52,211,153,0.12);
                    background: rgba(16,185,129,0.07);
                  ">
                    <span style="
                      font-family:'Courier New',monospace;
                      font-size:10px;
                      letter-spacing:3px;
                      text-transform:uppercase;
                      color:#34d399;
                    ">&#9632; Reservation Details</span>
                  </td>
                </tr>

                <!-- Booking ID -->
                <tr>
                  <td style="padding:16px 24px 8px;width:40%;vertical-align:top;">
                    <span style="font-size:11px;color:#64748b;font-family:'Courier New',monospace;letter-spacing:1.5px;text-transform:uppercase;">Booking ID</span>
                  </td>
                  <td style="padding:16px 24px 8px;vertical-align:top;">
                    <span style="
                      font-size:13px;
                      color:#34d399;
                      font-family:'Courier New',monospace;
                      background:rgba(52,211,153,0.08);
                      border:1px solid rgba(52,211,153,0.2);
                      border-radius:6px;
                      padding:4px 10px;
                      letter-spacing:1px;
                    ">${safe.bookingId}</span>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td colspan="2" style="padding:0 24px;"><div style="height:1px;background:rgba(255,255,255,0.05);"></div></td></tr>

                <!-- Date -->
                <tr>
                  <td style="padding:14px 24px 8px;vertical-align:top;">
                    <span style="font-size:11px;color:#64748b;font-family:'Courier New',monospace;letter-spacing:1.5px;text-transform:uppercase;">Date</span>
                  </td>
                  <td style="padding:14px 24px 8px;vertical-align:top;">
                    <span style="font-size:15px;color:#e2e8f0;font-family:Georgia,serif;font-weight:bold;">${safe.date}</span>
                  </td>
                </tr>

                ${safe.slotLabel ? `
                <!-- Divider -->
                <tr><td colspan="2" style="padding:0 24px;"><div style="height:1px;background:rgba(255,255,255,0.05);"></div></td></tr>

                <!-- Slot -->
                <tr>
                  <td style="padding:14px 24px 8px;vertical-align:top;">
                    <span style="font-size:11px;color:#64748b;font-family:'Courier New',monospace;letter-spacing:1.5px;text-transform:uppercase;">Time Slot</span>
                  </td>
                  <td style="padding:14px 24px 8px;vertical-align:top;">
                    <span style="
                      font-size:14px;
                      color:#f0fdf9;
                      font-family:Georgia,serif;
                      background:rgba(16,185,129,0.1);
                      border-left:3px solid #10b981;
                      padding:4px 12px;
                      border-radius:0 6px 6px 0;
                      display:inline-block;
                    ">${safe.slotLabel}</span>
                  </td>
                </tr>
                ` : ""}

                <!-- Divider -->
                <tr><td colspan="2" style="padding:0 24px;"><div style="height:1px;background:rgba(255,255,255,0.05);"></div></td></tr>

                <!-- Phone -->
                <tr>
                  <td style="padding:14px 24px 8px;vertical-align:top;">
                    <span style="font-size:11px;color:#64748b;font-family:'Courier New',monospace;letter-spacing:1.5px;text-transform:uppercase;">Phone</span>
                  </td>
                  <td style="padding:14px 24px 8px;vertical-align:top;">
                    <span style="font-size:14px;color:#cbd5e1;font-family:Georgia,serif;">${safe.number}</span>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td colspan="2" style="padding:0 24px;"><div style="height:1px;background:rgba(255,255,255,0.05);"></div></td></tr>

                <!-- Country -->
                <tr>
                  <td style="padding:14px 24px 20px;vertical-align:top;">
                    <span style="font-size:11px;color:#64748b;font-family:'Courier New',monospace;letter-spacing:1.5px;text-transform:uppercase;">Country</span>
                  </td>
                  <td style="padding:14px 24px 20px;vertical-align:top;">
                    <span style="font-size:14px;color:#cbd5e1;font-family:Georgia,serif;">${safe.country}</span>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ── NOTICE BANNER ── -->
          <tr>
            <td style="background-color:#0f1e2e;padding:0 48px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="
                  background: linear-gradient(135deg, rgba(234,179,8,0.08), rgba(234,179,8,0.04));
                  border: 1px solid rgba(234,179,8,0.2);
                  border-radius: 10px;
                  padding: 14px 20px;
                ">
                <tr>
                  <td width="24" style="vertical-align:top;padding-top:2px;">
                    <span style="font-size:14px;color:#fbbf24;">&#9888;</span>
                  </td>
                  <td style="padding-left:8px;">
                    <p style="margin:0;font-size:12.5px;color:#92833a;font-family:Georgia,serif;line-height:1.6;">
                      If you need to reschedule or cancel, please contact us at least 24 hours in advance. Reply to this email or reach out through our website.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="
              background: linear-gradient(180deg, #0a1628, #070e1c);
              padding: 28px 48px 36px;
              text-align: center;
              border-top: 1px solid rgba(52,211,153,0.1);
            ">
              <!-- Decorative dot row -->
              <div style="margin-bottom:20px;">
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#1e3a52;margin:0 3px;"></span>
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#10b981;margin:0 3px;"></span>
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#1e3a52;margin:0 3px;"></span>
              </div>

              <p style="margin:0 0 6px;font-size:13px;color:#334155;font-family:'Courier New',monospace;letter-spacing:2px;text-transform:uppercase;">
                ZenPix
              </p>
              <p style="margin:0;font-size:11.5px;color:#1e3a52;font-family:Georgia,serif;">
                This is an automated confirmation. Please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

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