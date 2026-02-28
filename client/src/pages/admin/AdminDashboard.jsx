// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { getAdminBookings, exportAdminBookings } from "../../api/adminApi";
import AdminFilters from "./AdminFilters";
import BookingsTable from "./BookingsTable";
import Pagination from "./Pagination";

const EMPTY_FILTERS = { name: "", phone: "", date: "", country: "", city: "" };

export default function AdminDashboard({ onUnauthorized }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const limit = 15;

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total]
  );

  // Reset page when filters change
  useEffect(() => setPage(1), [filters]);

  useEffect(() => {
    let cancelled = false;

    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminBookings({ page, limit, ...filters });

        if (!cancelled) {
          setRows(data.items || []);
          setTotal(data.total || 0);
        }
      } catch (e) {
        if (String(e?.message).includes("ADMIN_UNAUTHORIZED")) {
          onUnauthorized?.();
          return;
        }
        if (!cancelled) setError(e?.message || "Failed to load bookings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBookings();
    return () => { cancelled = true; };
  }, [page, limit, filters, onUnauthorized]);

  async function handleExport() {
    try {
      const res = await exportAdminBookings(filters);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      if (String(e?.message).includes("ADMIN_UNAUTHORIZED")) {
        onUnauthorized?.();
        return;
      }
      setError(e?.message || "Export failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage bookings
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={loading || rows.length === 0}
          className={`
            px-5 py-2.5 rounded-lg font-medium text-sm
            bg-gradient-to-r from-gray-900 to-black 
            text-white shadow-sm hover:shadow 
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          Export to CSV
        </button>
      </div>

      <main className="p-6 max-w-[1600px] mx-auto space-y-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <AdminFilters
            filters={filters}
            loading={loading}
            onSearch={(draft) => setFilters(draft)}
            onReset={() => setFilters(EMPTY_FILTERS)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Table container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Bookings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {loading  ? "Loading...": `Showing ${rows.length} of ${total} bookings`}
              </p>
            </div>
          </div>
          <BookingsTable rows={rows} loading={loading} /> 
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination  page={page} totalPages={totalPages} onPageChange={setPage}  />
          </div>
        </div>
      </main>
    </div>
  );
}