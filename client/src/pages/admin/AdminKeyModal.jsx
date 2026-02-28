import { useState } from "react";
import { validateAdminKey } from "../../api/adminApi";

export default function AdminKeyModal({ onSuccess }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!key.trim()) return setError("Please enter the admin key");

    try {
      setLoading(true);
      setError("");

      await validateAdminKey(key);

      localStorage.setItem("adminKey", key);
      onSuccess();
    } catch (err) {
      setError("Invalid admin key. Please try again.");
      localStorage.removeItem("adminKey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`
          w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden
          transform transition-all duration-300
        `}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-full bg-black text-white">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0-3.866-3.134-7-7-7s-7 3.134-7 7m14 0c0-3.866 3.134-7 7-7s7 3.134 7 7m-13 5h2m4 0h2m-8 4h12"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Enter your admin key to continue
          </p>
        </div>

        {/* Form content */}
        <div className="px-8 pt-6 pb-8 space-y-6">
          <div>
            <label
              htmlFor="admin-key"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Admin Key
            </label>
            <input
              id="admin-key"
              type="password"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className={`
                w-full px-4 py-3.5 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-black/30 focus:border-black
                placeholder-gray-400 text-gray-900
                transition-all duration-200
                disabled:opacity-60 disabled:bg-gray-50
              `}
              placeholder="••••••••••••"
              value={key}
              onChange={(e) => {
                setError("");
                setKey(e.target.value);
              }}
              disabled={loading}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !key.trim()}
            className={`
              w-full py-3.5 px-6 rounded-xl font-medium text-base
              bg-black text-white
              hover:bg-gray-900 active:bg-gray-950
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-black/40
              transition-all duration-200
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                <span>Verifying...</span>
              </div>
            ) : (
              "Unlock Admin Panel"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}