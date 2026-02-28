# Architecture Documentation — Event Booking System

## 1. System Overview

This system is designed as a production-grade full-stack booking platform with strict business constraints, atomic capacity control, and controlled admin access.

Architecture follows a modular MVC pattern on the backend and component-driven architecture on the frontend.

---

# 2. High-Level Architecture

Client (React) → Express API → MongoDB Atlas
↓
Resend Email Service

Frontend handles UI/UX validation and date restrictions.
Backend enforces all business rules and capacity constraints.
Database guarantees atomic booking under concurrency.

---

# 3. Core Business Constraints

1. Event occurs only in March 2026.
2. Only odd dates are allowed.
3. Alternating daily schedule pattern.
4. Each slot has a fixed capacity.
5. One booking equals one seat.
6. Overbooking must be impossible even under concurrent requests.

All critical rules are enforced on the backend.

---

# 4. Schedule Alternation Logic

Schedule is dynamically determined based on the selected date.

Rule:

* If odd date index position alternates → Schedule A
* Next odd date → Schedule B

Schedules:

Schedule A → 10:00 AM – 7:00 PM (9 slots)
Schedule B → 9:00 AM – 5:00 PM (8 slots)

The backend validates:

* Date must belong to March 2026
* Date must be odd
* Then determines schedule
* Then generates hourly slots accordingly

Slots are upserted if they do not already exist.

This ensures:

* Idempotent slot creation
* No duplicate slot generation

---

# 5. Slot Model Strategy

Each slot document contains:

* date
* startTime
* endTime
* capacity (default: 4)
* bookedCount (incremented atomically)

Slots are created dynamically per date when first requested.

---

# 6. Capacity Enforcement (Race Condition Safe)

Atomic protection is implemented using MongoDB transactions and conditional updates.

Booking controller performs:

```
Slot.findOneAndUpdate(
  {
    _id: slotId,
    $expr: { $lt: ["$bookedCount", "$capacity"] }
  },
  { $inc: { bookedCount: 1 } },
  { returnDocument: "after", session }
)
```

Key properties:

* `$expr` ensures bookedCount < capacity
* `$inc` increments in the same operation
* Operation runs inside a MongoDB transaction session

This guarantees:

* No read-then-write race condition
* No possibility of >capacity booking
* Concurrent requests are safely serialized

If update fails (null result):

* Slot is already full
* API returns HTTP 409

Frontend handles this gracefully by refetching slots.

This is database-level protection — not UI-level.

---

# 7. Booking Flow (Transaction-Level Sequence)

1. Validate request payload
2. Start MongoDB session
3. Attempt atomic slot increment
4. If successful → create booking document
5. Commit transaction
6. Send email notifications

Emails are sent only after successful DB commit.

Order:

* Admin email
* User confirmation email

This prevents ghost bookings.

---

# 8. API Design

Public Routes:

* GET /api/slots?date=YYYY-MM-DD
* POST /api/bookings

Admin Routes:

* GET /api/admin/bookings
* GET /api/admin/bookings/export

Admin routes protected via header validation middleware.
Secret stored in environment variables.

---

# 9. Pagination & Filtering

Backend-driven pagination implemented.

Query parameters:

* page
* limit
* name
* phone
* date

Filtering happens at database query level.

CSV export sets proper content-disposition headers.

---

# 10. Security Layers

* Helmet for HTTP security headers
* express-rate-limit to mitigate abuse
* CORS restricted to frontend origin
* Environment variables via .env
* Admin header authentication
* Database-level capacity enforcement

---

# 11. Logging Strategy

Winston used for structured logging.

Logs include:

* Booking attempts
* Failed capacity checks
* Server errors

Provides production-level traceability.

---

# 12. Design Tradeoffs

1. Slots generated dynamically instead of pre-seeding entire month
   → Reduces initial DB footprint
   → Keeps system flexible

2. Header-based admin protection instead of JWT
   → Simpler for demo environment
   → Acceptable for controlled usage

3. No email retry mechanism
   → Booking integrity prioritized over email reliability

---

# 13. Scalability Considerations

Current design scales horizontally because:

* Atomic DB updates prevent race conditions across instances
* Stateless API design
* Serverless-compatible

Potential improvements:

* Add Redis layer for slot caching
* Add email retry queue
* Add monitoring & observability

---

# 14. Conclusion

This system is built with production discipline:

* Business rules enforced server-side
* Capacity protected atomically
* Clean API boundaries
* Secure configuration
* Modular architecture

It is intentionally designed to demonstrate real-world backend engineering practices under concurrency constraints.
