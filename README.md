# Event Booking System — March 2026

## Overview

A production-ready full-stack Event Booking System built with React, Node.js, Express, and MongoDB Atlas.

This system allows users to book a single seat for an event that takes place exclusively during March 2026, under strict scheduling and capacity constraints. An admin panel provides filtered booking views, pagination, and CSV export functionality.

The application enforces business rules at both frontend and backend levels, with atomic capacity protection to prevent race conditions.

---

## Live Demo

Frontend: [https://app.zenpix.shop](https://app.zenpix.shop)
Backend API: [https://server-event-organiser.vercel.app/api](https://server-event-organiser.vercel.app/api)

---

## Core Business Rules

* Event occurs only in March 2026
* Only odd dates are selectable
* Alternating daily schedules:

  * Schedule A: 10:00 AM – 7:00 PM (9 hourly slots)
  * Schedule B: 9:00 AM – 5:00 PM (8 hourly slots)
* Each slot has a maximum capacity of 4 bookings
* One booking equals one seat
* Overbooking is prevented using database-level atomic enforcement

---

## Tech Stack

### Frontend

* React (Vite)
* Responsive UI
* Client-side validation

### Backend

* Node.js v22.19.0
* Express.js
* MongoDB Atlas (Free Tier)
* Mongoose
* Winston (structured logging)
* Helmet (HTTP security headers)
* express-rate-limit
* CORS (restricted to frontend origin)
* Resend (email service)

---

## Architecture Overview

### 1. Slot Generation

* Frontend requests: `GET /api/slots?date=YYYY-MM-DD`
* Backend validates date:

  * Must be March 2026
  * Must be an odd date
* Backend determines Schedule A or B using alternating pattern
* Hourly slots are dynamically generated
* Slots are upserted in the database if they do not exist (idempotent creation)
* Response includes remaining capacity

### 2. Capacity Enforcement

* Each slot document stores `capacity` and `bookedCount`
* Booking controller runs inside a MongoDB transaction session
* Atomic conditional update ensures `bookedCount < capacity`
* If capacity is reached, API returns HTTP 409 (Conflict)
* Prevents race-condition overbooking under concurrency

### 3. Booking Flow

1. User selects valid date
2. Slots fetched dynamically
3. User selects available slot
4. Atomic capacity increment performed
5. Booking document created inside transaction
6. Transaction committed
7. Confirmation emails sent (admin first, then user)

---

## Folder Structure

```
client/
  src/
  public/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  validation/
```

---

## API Endpoints

### Public

* `GET /api/slots?date=YYYY-MM-DD`
* `POST /api/bookings`

### Admin

* `GET /api/admin/bookings`
* `GET /api/admin/bookings/export`

---

## Admin Features

* Backend-driven pagination
* Filtering by name, phone, and date
* CSV export with proper `Content-Disposition` headers
* Protected via header-based middleware authentication
* Admin secret stored in environment variables

---

## Security Measures

* Helmet for HTTP security headers
* Rate limiting using express-rate-limit
* CORS restricted to frontend origin
* Strict server-side schema validation (Zod)
* Explicit field destructuring before persistence (prevents operator injection)
* Transaction-based atomic capacity enforcement
* Environment variables managed via `.env` with `.env.example` provided
* Lock files committed (`package-lock.json`) to ensure deterministic builds and version pinning

---

## Email System

* Email service: Resend (custom domain configured)
* Emails sent only after successful database transaction commit
* Admin notification sent first
* User confirmation sent second

---

## Environment Variables

Create a `.env` file using `.env.example` template.

Required variables include:

* MONGO_URI
* ADMIN_SECRET_KEY
* RESEND_API_KEY
* FRONTEND_URL

---

## Deployment

* Frontend deployed via Vercel-compatible static hosting
* Backend deployed via Vercel serverless
* MongoDB hosted on MongoDB Atlas free tier
* Node version pinned to v22.19.0

---

## Logging

Winston is used for structured server-side logging, including:

* Booking attempts
* Capacity conflicts
* Server errors

---

## Testing Strategy

* Manual API verification performed during development
* Server-side validation enforced via schema validation layer
* Atomic capacity logic tested under concurrent request simulation
* Automated unit and integration tests planned as future enhancement

---

## Growth Roadmap

* Add automated integration tests using Jest + Supertest
* Introduce additional input sanitization layer for defense-in-depth
* Implement email retry mechanism
* Add observability and monitoring
* Upgrade admin authentication to JWT-based system

---

## Conclusion

This project demonstrates:

* Strict backend business-rule enforcement
* Concurrency-safe capacity handling
* Clean API boundaries
* Structured logging
* Secure configuration management
* Deployment-ready full-stack architecture

It is intentionally designed as a production-grade hiring assignment with emphasis on backend integrity and system correctness.
