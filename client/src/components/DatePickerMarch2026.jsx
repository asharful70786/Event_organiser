export default function DatePickerMarch2026({ selectedDate, onSelect }) {
  const year = 2026;
  const month = 2; // March (0-based)

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun

  // Get today's date at local midnight for safe comparison
  const today = new Date();
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const handleClick = (day) => {
    const currentDate = new Date(year, month, day);

    const isEven = day % 2 === 0;
    const isPast = currentDate < todayOnly;

    if (isEven || isPast) return;

    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    onSelect(formatted);
  };

  const daysArray = [];
  for (let i = 0; i < firstDayOfWeek; i++) daysArray.push(null);
  for (let day = 1; day <= daysInMonth; day++) daysArray.push(day);

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
          Mar 2026
        </p>
        <span className="text-[11px] text-gray-500">Odd days only</span>
      </div>

      {/* Weekdays */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {weekdays.map((d, i) => (
          <div key={i} className="py-1 text-[10px] font-medium text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="rounded-lg bg-white p-2 ring-1 ring-gray-200/60">
        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((day, idx) => {
            if (!day) return <div key={idx} className="h-9 w-9" />;

            const formatted = `2026-03-${String(day).padStart(2, "0")}`;
            const currentDate = new Date(year, month, day);

            const isEven = day % 2 === 0;
            const isPast = currentDate < todayOnly;
            const isDisabled = isEven || isPast;
            const isSelected = selectedDate === formatted;

            return (
              <button
                key={day}
                type="button"
                disabled={isDisabled}
                onClick={() => handleClick(day)}
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                className={[
                  "h-9 w-9 rounded-full text-sm font-medium transition duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/35",
                  isDisabled
                    ? "cursor-not-allowed text-gray-300"
                    : isSelected
                    ? "bg-[#FF7A59] text-white shadow-sm"
                    : "text-gray-800 ring-1 ring-gray-200/60 hover:bg-gray-50 hover:text-[#FF7A59]",
                ].join(" ")}
                title={
                  isPast
                    ? "Past date not available"
                    : isEven
                    ? "Even dates disabled"
                    : formatted
                }
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper */}
      <p className="mt-2 text-center text-[11px] text-gray-500">
        Past and even dates disabled • Slots load after date selection
      </p>
    </div>
  );
}