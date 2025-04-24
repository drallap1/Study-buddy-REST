const jwt = require('jsonwebtoken');


exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.render('login', { title: 'Login', error: 'Login to get Schedules' });
        
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded;
        console.log('User from token:', req.user); // Log to check if req.user is set
        next();
    });
};

// Middleware to log requests
exports.logRequests = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

// Middleware to handle CORS
exports.handleCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

// Middleware for rate limiting
const rateLimit = require('express-rate-limit');
exports.rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
});

