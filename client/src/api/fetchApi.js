const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message || "Something went wrong",
    };
  }

  return data;
}

export const getSlots = (date) =>
  request(`/slots?date=${date}`);

export const createBooking = (payload) =>
  request(`/bookings`, {
    method: "POST",
    body: JSON.stringify(payload),
  });