import rateLimit from 'express-rate-limit';

// Login-specific rate limiter - 5 requests per 15 minutes per IP
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes per IP
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use IP address as the key for rate limiting
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  handler: (req, res) => {
    console.log('🚫 Rate limit exceeded for IP:', req.ip || req.connection.remoteAddress);
    console.log('🕐 Rate limit window: 15 minutes, max attempts: 5');
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 15 minutes.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: 900,
      timestamp: new Date().toISOString()
    });
  }
});

export default loginRateLimiter;
