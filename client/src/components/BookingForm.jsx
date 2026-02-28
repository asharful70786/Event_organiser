// src/components/BookingForm.jsx
import { useEffect, useState } from "react";
import { getSlots, createBooking } from "../api/fetchApi";
import DatePickerMarch2026 from "./DatePickerMarch2026";
import SlotPicker from "./SlotPicker";
import BookingSuccess from "./BookingSuccess";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { normalizeSlots } from "../utils/normalizeSlots";
import { parsePhoneNumberFromString } from "libphonenumber-js";

function Field({ label, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function BookingForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("IN");

  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const [phoneError, setPhoneError] = useState("");

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ✅ NEW: gate errors behind user trying to submit
  const [didSubmit, setDidSubmit] = useState(false);

  const [success, setSuccess] = useState(false);

  // Phone validation
  useEffect(() => {
    if (!phone) {
      setPhoneError("");
      return;
    }
    const phoneObj = parsePhoneNumberFromString(phone);
    if (!phoneObj || !phoneObj.isValid()) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    if (phoneObj.country && phoneObj.country !== phoneCountry) {
      setPhoneError("Phone number doesn't match selected country.");
      return;
    }
    setPhoneError("");
  }, [phone, phoneCountry]);

  // Slots fetch
  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError("");
      setSelectedSlotId("");

      try {
        const raw = await getSlots(date);
        setSlots(normalizeSlots(raw));
      } catch (err) {
        setSlotsError(err?.message || "Could not load available slots.");
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  // ✅ NEW: once user tried submitting, clear submitError as soon as they edit any field
  useEffect(() => {
    if (!didSubmit) return;
    if (!submitError) return;
    setSubmitError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, email, phone, phoneCountry, city, date, selectedSlotId, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDidSubmit(true); // ✅ user attempted submit

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone ||
      !city.trim() ||
      !date ||
      !selectedSlotId ||
      !message.trim()
    ) {
      setSubmitError("Please complete all required fields.");
      return;
    }

    if (phoneError) {
      setSubmitError(phoneError);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await createBooking({
        fullName: fullName.trim(),
        email: email.trim(),
        phone,
        country: phoneCountry,
        city: city.trim(),
        date,
        slotId: selectedSlotId,
        message: message.trim(),
      });

      setSuccess(true);
    } catch (err) {
      if (err?.status === 409) {
        setSubmitError("This slot was just taken. Please select another.");
        try {
          const updatedRaw = await getSlots(date);
          setSlots(normalizeSlots(updatedRaw));
          setSelectedSlotId("");
        } catch {}
      } else {
        setSubmitError(err?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setPhoneCountry("IN");
    setCity("");
    setDate("");
    setMessage("");
    setSelectedSlotId("");
    setSlots([]);
    setSlotsError("");
    setSubmitError("");
    setPhoneError("");
    setSubmitting(false);
    setDidSubmit(false); // ✅ reset gating flag
  };

  if (success) return <BookingSuccess onReset={resetForm} />;

  return (
    <div className="min-h-screen bg-gray-50/40">
      {/* Global style overrides for PhoneInput */}
      <style>{`
        .PhoneInput {
          -- PhoneInputCountrySelectArrow-color: #6b7280;
        }
        .PhoneInputInput {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.95rem;
        }
        .PhoneInput--focus {
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }
      `}</style>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-4">
            Exclusive March 2026 Experience
          </p>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Reserve Your Place
            <span className="block mt-2 text-4xl font-light italic text-teal-600/90">
              Limited Slots
            </span>
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
            Secure your spot for this one-of-a-kind March event. Only a few seats remain.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-medium text-teal-700">
              📅 Selected odd dates
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700">
              👥 Max 4 per slot
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700">
              ⚡ High demand
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200/70 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Full Name" error={null}>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="peer w-full rounded-xl border border-gray-200 bg-white/60 px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all duration-200"
                />
              </Field>

              <Field label="Email" error={null}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full rounded-xl border border-gray-200 bg-white/60 px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all duration-200"
                />
              </Field>
            </div>

            <Field label="Phone" error={phoneError}>
              <div className="rounded-xl border border-gray-200 bg-white/60 transition-all duration-200 has-[:focus]:border-teal-500 has-[:focus]:ring-2 has-[:focus]:ring-teal-500/20">
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="IN"
                  country={phoneCountry}
                  onCountryChange={(c) => setPhoneCountry(c || "IN")}
                  className="w-full"
                />
              </div>
            </Field>

            <Field label="City" error={null}>
              <input
                type="text"
                placeholder="e.g. Kolkata, Mumbai…"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="peer w-full rounded-xl border border-gray-200 bg-white/60 px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all duration-200"
              />
            </Field>

            <hr className="border-gray-100 my-4" />

            <DatePickerMarch2026 selectedDate={date} onSelect={setDate} />

            {(slots.length > 0 || slotsLoading || slotsError) && (
              <>
                <hr className="border-gray-100 my-4" />
                <SlotPicker
                  slots={slots}
                  loading={slotsLoading}
                  error={slotsError}
                  selectedSlotId={selectedSlotId}
                  onSelect={setSelectedSlotId}
                />
              </>
            )}

            <hr className="border-gray-100 my-4" />

            <Field label="Message (Required)" error={null}>
              <div className="relative">
                <textarea
                  placeholder="Any special requests or notes…"
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="peer w-full rounded-xl border border-gray-200 bg-white/60 px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all duration-200 resize-none"
                />
                <p className="absolute bottom-2 right-4 text-xs text-gray-400">
                  {message.length}/200
                </p>
              </div>
            </Field>

            {/* ✅ NEW: show submit error only after first submit attempt */}
            {didSubmit && submitError && (
              <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700 border border-red-100">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !!phoneError}
              className={`
                w-full rounded-2xl py-4 px-6 font-semibold text-lg text-white
                transition-all duration-300 shadow-lg
                ${
                  submitting || phoneError
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-teal-600 hover:bg-teal-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                }
              `}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                  Reserving...
                </span>
              ) : (
                "Secure My Spot →"
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Limited availability • Secure & private booking
        </p>
      </div>
    </div>
  );
}