import { useEffect, useState } from "react";

export default function HealthDot() {
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/health`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(() => setStatus("ok"))
      .catch(() => setStatus("error"));
  }, []);

  const color =
    status === "ok"
      ? "rgba(16,185,129,0.65)"
      : status === "error"
      ? "rgba(239,68,68,0.65)"
      : "rgba(15,23,42,0.25)";

  return (
    <div
      title={`health: ${status}`}
      style={{
        position: "fixed",
        top: 18,
        right: 24,
        zIndex: 999999,
        fontSize: 20,
        letterSpacing: 6,
        color,
        fontWeight: 700,
        userSelect: "none",
        transition: "color 250ms ease",
      }}
    >
      ...
    </div>
  );
}