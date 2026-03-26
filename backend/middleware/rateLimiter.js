import rateLimit from 'express-rate-limit';

// Rate limiter for login routes - 5 requests per minute per IP
export const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per window
    message: {
        success: false,
        message: 'Too many login attempts, please try again after a minute'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many login attempts, please try again after a minute'
        });
    }
});
