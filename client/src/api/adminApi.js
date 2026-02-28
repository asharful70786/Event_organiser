const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getKey = () => localStorage.getItem("adminKey");

// 1) Validate key (keep your exact style)
export const validateAdminKey = async (key) => {
  const res = await fetch(`${BASE_URL}/admin/validate`, {
    method: "GET",
    headers: {
      "x-admin-key": key,
      "Cache-Control": "no-cache",
    },
  });

  if (!res.ok) {
    throw new Error("INVALID_KEY");
  }
  return true;
};


export const getAdminBookings = async ({  page = 1,  limit = 15,  name = "",  phone = "",  date = "",  country = "",} = {}) => {  const key = getKey();

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (name) params.set("name", name);
  if (phone) params.set("phone", phone);
  if (date) params.set("date", date);
  if (country) params.set("country", country);

  const res = await fetch(`${BASE_URL}/admin/bookings?${params.toString()}`, {
    method: "GET",
    headers: {
      "x-admin-key": key,
      "Cache-Control": "no-cache",
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("adminKey");
      throw new Error("ADMIN_UNAUTHORIZED");
    }
    throw new Error("FAILED_TO_FETCH_BOOKINGS");
  }

  return res.json(); 
};


export const exportAdminBookings = async ({
  name = "",
  phone = "",
  date = "",
  country = "",
} = {}) => {
  const key = getKey();

  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (phone) params.set("phone", phone);
  if (date) params.set("date", date);
  if (country) params.set("country", country);

  const res = await fetch(`${BASE_URL}/admin/bookings/export?${params.toString()}`, {
    method: "GET",
    headers: {
      "x-admin-key": key,
      "Cache-Control": "no-cache",
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("adminKey");
      throw new Error("ADMIN_UNAUTHORIZED");
    }
    throw new Error("FAILED_TO_EXPORT");
  }

  return res; // caller will do blob/text
};