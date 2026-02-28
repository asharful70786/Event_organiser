// src/middlewares/requestLogger.js
import { logger, reqMeta } from "../utils/logger.js";
import crypto from "crypto";

export function requestLogger(req, res, next) {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();

  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;

    logger.info("HTTP %s %s %d %dms", req.method, req.originalUrl, res.statusCode, ms, {
      requestId: req.requestId,
      ...reqMeta(req),
    });
  });

  next();
}