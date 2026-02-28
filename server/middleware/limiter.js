import rateLimit from "express-rate-limit";

export const limitAllRequests = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: "Too many booking attempts from this IP, please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

