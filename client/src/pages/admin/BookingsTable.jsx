// src/pages/admin/BookingsTable.jsx
import { useState } from "react";

const formatDate = (isoDate) => {
  if (!isoDate) return "—";
  try {
    const d = new Date(`${isoDate}T00:00:00Z`);
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoDate || "—";
  }
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// ─── Avatar ────────────────────────────────────────────────
function Avatar({ name = "?" }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase tracking-tight"
      style={{
        background: `hsl(${hue}, 55%, 88%)`,
        color: `hsl(${hue}, 45%, 35%)`,
        border: `1.5px solid hsl(${hue}, 30%, 78%)`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Expandable Message Cell ───────────────────────────────
function MessageCell({ message }) {
  const [expanded, setExpanded] = useState(false);
  const text = (message || "").trim();

  if (!text) {
    return <span className="text-gray-300">—</span>;
  }

  const isLong = text.length > 55;
  const preview = isLong ? text.slice(0, 52) + "…" : text;

  return (
    <div
      className={`max-w-[320px] text-[13px] leading-relaxed text-gray-700 ${
        isLong ? "cursor-pointer" : ""
      }`}
      onClick={() => isLong && setExpanded(!expanded)}
      title={isLong && !expanded ? text : undefined}
    >
      {expanded ? text : preview}
    </div>
  );
}

// ─── Main Table Component ──────────────────────────────────
export default function BookingsTable({ rows = [], loading = false }) {
  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-[#faf9f6] text-[#8a8070]">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e0d8cc] border-t-[#a0753a]" />
          <span className="text-sm font-medium">Loading bookings…</span>
        </div>
      </div>
    );
  }

  const hasData = rows.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#ede9e0] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ede9e0] bg-white px-6 py-4">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-[#1a1510]">
          Bookings
        </h2>
        <div className="rounded-full bg-[#1a1510] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#f7f4ed]">
          {rows.length} {rows.length === 1 ? "booking" : "bookings"}
        </div>
      </div>

      {/* Table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#f0ece3]">
          <thead>
            <tr className="bg-[#faf9f6]">
              {[
                "Client",
                "Email",
                "Phone",
                "Location",
                "Date",
                "Slot",
                "Message",
                "Booked At",
              ].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#8a8070]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f0ece3] bg-white">
            {hasData ? (
              rows.map((booking) => {
                const key =
                  booking._id ||
                  `${booking.email || "x"}-${booking.date || "x"}-${
                    booking.slotLabel || "x"
                  }`;

                const location = [booking.city, booking.country]
                  .filter(Boolean)
                  .join(", ") || "—";

                return (
                  <tr
                    key={key}
                    className="transition-colors hover:bg-[#fdf8ef]"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={booking.fullName} />
                        <span className="font-medium text-[#1a1510]">
                          {booking.fullName || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {booking.email ? (
                        <a
                          href={`mailto:${booking.email}`}
                          className="font-medium text-[#a0753a] hover:underline"
                        >
                          {booking.email}
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                      {booking.phone ? (
                        <a
                          href={`tel:${booking.phone}`}
                          className="font-medium text-[#a0753a] hover:underline"
                        >
                          {booking.phone}
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#5a4e3a]">
                      {location}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#4a4030]">
                      {formatDate(booking.date)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {booking.slotLabel ? (
                        <span className="inline-flex rounded-md bg-[#f0ece3] px-2.5 py-1 text-xs font-medium text-[#5a4e3a]">
                          {booking.slotLabel}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <MessageCell message={booking.message} />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#8a8070]">
                      {formatDateTime(booking.createdAt)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="text-4xl opacity-40">📋</div>
                  <p className="mt-3 text-sm font-medium text-[#b0a898]">
                    No bookings found
                  </p>
                  <p className="mt-1 text-xs text-[#c0b8a8]">
                    Try changing filters or come back later
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}