const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const { handleCORS, logRequests } = require('./middleware/authMiddleware');
const fs = require('fs'); // Import the fs module
const https = require('https'); // Import the https module

const cookieParser = require('cookie-parser');


dotenv.config({ path: './config.env' });
const app = express();

app.use(cookieParser());
// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use(handleCORS);
app.use(logRequests);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

// Routes
app.use(authRoutes);
app.use(scheduleRoutes);


// Home Page
app.get('/', (req, res) => {
    res.render('home', { title: 'Study Schedule App' });
});


// SSL Certificates
const sslOptions = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert'),
};

// HTTPS Server
const PORT = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure server running on https://localhost:${PORT}`);
});

app.use((req, res, next) => {
    if (req.protocol === 'http') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});