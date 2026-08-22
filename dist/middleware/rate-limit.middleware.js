import { rateLimit } from 'express-rate-limit';
export const authRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per `window` (here, per minute)
    message: {
        error: 'Too many requests from this IP, please try again after a minute',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
//# sourceMappingURL=rate-limit.middleware.js.map