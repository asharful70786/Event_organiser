// src/utils/logger.js
import winston from "winston";

const { combine, timestamp, errors, splat, json, colorize, printf } =
  winston.format;

const isProd = process.env.NODE_ENV === "production";


const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  splat(),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr =
      meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), splat(), json());

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  format: isProd ? prodFormat : devFormat,
  defaultMeta: {
    service: process.env.SERVICE_NAME || "event-booking-api",
    env: process.env.NODE_ENV || "development",
  },
  transports: [new winston.transports.Console()],
});


export function reqMeta(req) {
  return {
    ip:
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress,
    ua: req.headers["user-agent"],
    path: req.originalUrl,
    method: req.method,
  };
}