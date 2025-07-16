import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// OTP rate limiter - 4 requests per hour
export const otpLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  4,
  'Too many OTP requests. Please try again after an hour.'
);

// Login rate limiter - 5 attempts per 15 minutes
export const loginLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many login attempts. Please try again after 15 minutes.'
);

// General API rate limiter - 100 requests per 15 minutes
export const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests. Please try again later.'
);