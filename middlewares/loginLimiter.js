import { rateLimit } from "express-rate-limit"; // Import the rateLimit function from the express-rate-limit package

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Set the time window for rate limiting to 1 minute (1 * 60 * 1000 milliseconds)
  limit: 2, // Allow a maximum of 2 requests per windowMs
  message: "Too many login attempts, please try again later.", // Message to send when the rate limit is exceeded
  standardHeaders: "draft-7", // Use the standard rate limit headers (draft-7)
  legacyHeaders: false, // Disable the legacy rate limit headers
});
