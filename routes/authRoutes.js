const express = require('express');
const { renderLoginPage, renderRegisterPage, handleLogin, handleRegister } = require('../controllers/authController');
const { rateLimiter } = require('../middleware/authMiddleware')
const router = express.Router();

router.get('/login', rateLimiter,renderLoginPage);
router.post('/login', handleLogin);

router.get('/register', rateLimiter,renderRegisterPage);
router.post('/register', handleRegister);

module.exports = router;
