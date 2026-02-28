// src/pages/admin/Pagination.jsx
export default function Pagination({ page, totalPages, onPageChange }) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      <div className="text-sm">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </div>

      <button
        type="button"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}