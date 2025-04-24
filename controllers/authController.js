const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();


exports.renderLoginPage = (req, res) => {
    res.render('login', { title: 'Login' , error: null});
};

exports.renderRegisterPage = (req, res) => {
    res.render('register', {title: 'Register', error: null }); // Pass an empty error initially
};


exports.handleRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', { title: 'Register', error: 'Error registering user.' });
    }
};

exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { title: 'Login', error: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/schedule');
    } catch (err) {
        console.error(err);
        res.render('login', { title: 'Login', error: 'Error logging in.' });
    }
};

