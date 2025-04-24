const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { renderSchedulePage, handleScheduleCreation, renderSavedSchedule } = require('../controllers/scheduleController');

// Display the schedule creation page
router.get('/schedule', verifyToken, renderSchedulePage);

// Handle schedule creation
router.post('/schedule', verifyToken, handleScheduleCreation);

// Display the saved schedule
router.get('/view-schedule', verifyToken, renderSavedSchedule);

module.exports = router;
