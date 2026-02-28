
export function normalizeSlots(rawSlots) {
  if (!Array.isArray(rawSlots)) return [];

  return rawSlots
    .filter(Boolean)
    .map((s) => {
      const id = s._id ?? s.id; // tolerate either
      const capacity = Number(s.capacity ?? 0);

     
      const bookedCountRaw =
        s.bookedCount ??
        s.bookingsCount ??
        s.used ??
        s.booked ??
        s.count ??
        0;

      const bookedCount = Number(bookedCountRaw ?? 0);

      const remainingSeats = Math.max(0, capacity - bookedCount);

      return {
        id: String(id),
        date: s.date,
        label: s.label,
        capacity,
        bookedCount,
        remainingSeats,
      };
    })
    .filter((s) => s.id && s.label); // keep only valid ones
}