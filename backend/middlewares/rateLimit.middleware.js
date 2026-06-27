import rateLimit from 'express-rate-limit';

export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: 'Too many requests. Please wait before sending another message.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts. Try again in 15 minutes.' },
});

export const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: { error: 'Too many OTP requests. Try again in 5 minutes.' },
});
