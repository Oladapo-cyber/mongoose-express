import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 2,
  message: "Too many login attempts, please try again later.",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
