
export function isAllowedMarch2026OddDate(dateStr) {
  if (!dateStr) return false;
  // expecting "YYYY-MM-DD"
  const parts = dateStr.split("-");
  if (parts.length !== 3) return false;

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (year !== 2026) return false;
  if (month !== 3) return false;
  if (day < 1 || day > 31) return false;
  if (day % 2 === 0) return false;

  return true;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function hourToTime(h) {
  return `${pad2(h)}:00`;
}

export function generateSlotsForDate(dateStr) {
  const day = Number(dateStr.split("-")[2]);

  const oddIndex = (day - 1) / 2; 
  const schedule = oddIndex % 2 === 0 ? "A" : "B";

  const startHour = schedule === "A" ? 10 : 9;
  const endHour = schedule === "A" ? 19 : 17;

  const slots = [];

  for (let h = startHour; h < endHour; h++) {
    const start = hourToTime(h);
    const end = hourToTime(h + 1);
    slots.push({
      start,
      end,
      label: `${start}-${end}`,
    });
  }

  return slots;
}