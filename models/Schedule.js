const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    days: { type: Number, required: true },
    dailyStudyHours: { type: Number, required: true },
    modules: [
        {
            module: { type: String, required: true },
            days: { type: Number, required: true },
            dailyHours: { type: Number, required: true },
            totalHours: { type: Number, required: true },
        }
    ]
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
