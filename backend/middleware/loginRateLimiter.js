import rateLimit from 'express-rate-limit';

// Login-specific rate limiter - 5 requests per 15 seconds per IP (for testing)
const loginRateLimiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds (reduced for testing)
  max: 5, // 5 requests per 15 seconds per IP
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 seconds.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 15 // 15 seconds in seconds
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Use default keyGenerator which handles IPv4/IPv6 properly
  handler: (req, res) => {
    console.log('🚫 Rate limit exceeded for IP:', req.ip || req.connection.remoteAddress);
    console.log('🕐 Rate limit window: 15 seconds, max attempts: 5');
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 15 seconds.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: 15,
      timestamp: new Date().toISOString()
    });
  }
});

export default loginRateLimiter;
