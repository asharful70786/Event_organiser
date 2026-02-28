// src/pages/admin/Pagination.jsx
export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-3 py-2 rounded border disabled:opacity-50"
      >
        Prev
      </button>

      <div className="text-sm">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </div>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-3 py-2 rounded border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}