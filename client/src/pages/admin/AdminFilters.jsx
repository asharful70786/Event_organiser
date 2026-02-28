// src/pages/admin/AdminFilters.jsx
import { useEffect, useMemo, useState } from "react";

const MARCH_2026_MIN = "2026-03-01";
const MARCH_2026_MAX = "2026-03-31";

const COUNTRY_OPTIONS = [
  { code: "", label: "All Countries" },
  { code: "IN", label: "India" },
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "AE", label: "UAE" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "SG", label: "Singapore" },
  // You can easily add more later
];

export default function AdminFilters({
  filters,
  onSearch,
  onReset,
  loading = false,
}) {
  const [draft, setDraft] = useState(filters);

  // Sync with parent when applied filters change
  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(draft);
  };

  const handleReset = () => {
    const empty = { name: "", phone: "", date: "", country: "", city: "" };
    setDraft(empty);
    onReset?.(empty);
  };

  const isFormEmpty = useMemo(() => {
    return (
      !draft.name.trim() &&
      !draft.phone.trim() &&
      !draft.date &&
      !draft.country &&
      !draft.city?.trim()
    );
  }, [draft]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Mobile: stacked – Desktop: tighter grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-5 md:p-6">
        {/* Name */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
            Name
          </label>
          <input
            type="text"
            placeholder="Search by name"
            value={draft.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={loading}
            className={`
              w-full px-3 py-2.5 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-black/30 focus:border-black/60 
              disabled:opacity-60 disabled:bg-gray-50
              transition-colors text-sm
            `}
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
            Phone
          </label>
          <input
            type="text"
            placeholder="Search by phone"
            value={draft.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={loading}
            className={`
              w-full px-3 py-2.5 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-black/30 focus:border-black/60 
              disabled:opacity-60 disabled:bg-gray-50
              transition-colors text-sm
            `}
          />
        </div>

        {/* Date – restricted to March 2026 */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
            Booking Date
          </label>
          <input
            type="date"
            min={MARCH_2026_MIN}
            max={MARCH_2026_MAX}
            value={draft.date || ""}
            onChange={(e) => handleChange("date", e.target.value)}
            disabled={loading}
            className={`
              w-full px-3 py-2.5 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-black/30 focus:border-black/60 
              disabled:opacity-60 disabled:bg-gray-50
              transition-colors text-sm
            `}
          />
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
            Country
          </label>
          <select
            value={draft.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
            disabled={loading}
            className={`
              w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white
              focus:ring-2 focus:ring-black/30 focus:border-black/60 
              disabled:opacity-60 disabled:bg-gray-50
              transition-colors text-sm appearance-none
            `}
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="space-y-1 lg:col-span-2 xl:col-span-1">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
            City
          </label>
          <input
            type="text"
            placeholder="e.g. Mumbai, Dubai"
            value={draft.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            disabled={loading}
            className={`
              w-full px-3 py-2.5 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-black/30 focus:border-black/60 
              disabled:opacity-60 disabled:bg-gray-50
              transition-colors text-sm
            `}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 px-5 md:px-6 py-4 border-t border-gray-100 bg-gray-50/70">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading || isFormEmpty}
          className={`
            px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300
            hover:bg-gray-100 active:bg-gray-200
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`
            px-6 py-2.5 text-sm font-medium rounded-lg 
            bg-black text-white
            hover:bg-gray-900 active:bg-gray-950
            disabled:opacity-60 disabled:cursor-not-allowed
            shadow-sm hover:shadow
            transition-all duration-150
          `}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Searching...
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </form>
  );
}