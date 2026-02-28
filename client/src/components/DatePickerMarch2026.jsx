// src/components/DatePickerMarch2026.jsx
export default function DatePickerMarch2026({ selectedDate, onSelect }) {
  const year = 2026;
  const month = 2; // March (0-based)

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun

  const handleClick = (day) => {
    if (day % 2 === 0) return;
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
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
          Mar 2026
        </p>
        <span className="text-[11px] text-gray-500">
          Odd days only
        </span>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center mb-1">
        {weekdays.map((d, i) => (
          <div key={i} className="text-[10px] font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg ring-1 ring-gray-200/60 p-2">
        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((day, idx) => {
            if (!day) return <div key={idx} className="h-9 w-9" />;

            const formatted = `2026-03-${String(day).padStart(2, "0")}`;
            const isEven = day % 2 === 0;
            const isSelected = selectedDate === formatted;

            return (
              <button
                key={day}
                type="button"
                disabled={isEven}
                onClick={() => handleClick(day)}
                aria-selected={isSelected}
                aria-disabled={isEven}
                className={[
                  "h-9 w-9 rounded-full text-sm font-medium",
                  "transition duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/35",
                  isEven
                    ? "text-gray-300 cursor-not-allowed"
                    : isSelected
                    ? "bg-[#FF7A59] text-white shadow-sm"
                    : "text-gray-800 hover:bg-gray-50 hover:text-[#FF7A59] ring-1 ring-gray-200/60",
                ].join(" ")}
                title={formatted}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper */}
      <p className="mt-2 text-[11px] text-gray-500 text-center">
        Even dates disabled • Slots load after date selection
      </p>
    </div>
  );
}