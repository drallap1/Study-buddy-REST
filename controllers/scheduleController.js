
const Schedule = require('../models/Schedule');

exports.renderSchedulePage = async(req, res) => {
   
        const schedule = await Schedule.find({ user: req.user.id });
       
        if (!schedule) {
            // No schedule found for the user
            return res.render('schedule', { 
                title: 'Study Schedule', 
                error: 'No schedule found for this user.' 
            });
        }

        // Render the schedule on the page
        res.render('schedule', { 
            title: 'Your Study Schedule', 
            error: null, 
            schedule 
        });
};

exports.handleScheduleCreation = async (req, res) => {
    const { days, hours, modules } = req.body;

    // Parse inputs from the form
    const daysToTest = parseInt(days); // Number of days to study
    const dailyStudyHours = parseInt(hours); // Daily study hours
    const difficultyLevels = modules.map(module => parseInt(module.difficulty)); // Difficulty levels array
    const moduleNames = modules.map(module => module.name); // Module names array

    // Validate inputs
    if (difficultyLevels.length !== moduleNames.length) {
        return res.send("The number of modules and difficulty levels must match.");
    }

    // Calculate total difficulty
    const totalDifficulty = difficultyLevels.reduce((a, b) => a + b, 0);

    // Allocate study time proportionally
    const schedule = difficultyLevels.map((difficulty, index) => {
        const proportion = difficulty / totalDifficulty; // Proportional allocation based on difficulty
        const moduleDays = Math.round(proportion * daysToTest); // Calculate days for this module
        const totalHours = moduleDays * dailyStudyHours; // Calculate total hours for this module

        return {
            module: moduleNames[index], // Module name
            days: moduleDays,
            dailyHours: dailyStudyHours,
            totalHours: totalHours,
        };
    });

    // Save the schedule to the database
    try {
        const userId = req.user.id; // Assuming user is authenticated and user ID is available

        const newSchedule = new Schedule({
            user: userId,
            days: daysToTest,
            dailyStudyHours: dailyStudyHours,
            modules: schedule, // Storing module breakdown
        });

        await newSchedule.save(); // Save to the database
        res.redirect('/schedule'); // Redirect to schedule page
    } catch (err) {
        console.error(err);
        res.send("Error creating schedule."); // Handle errors
    }
};


exports.renderSavedSchedule = async (req, res) => {
    try {
        // Fetch the user's schedule from the database based on the user ID
        const schedule = await Schedule.find({ user: req.user.id });

        if (!schedule) {
            // No schedule found for the user
            return res.render('schedule', { 
                title: 'Study Schedule', 
                error: 'No schedule found for this user.' 
            });
        }

        // Render the schedule on the page
        res.render('schedule', { 
            title: 'Your Study Schedule', 
            error: null, 
            schedule 
        });
    } catch (err) {
        console.error(err);
        res.render('schedule', { 
            title: 'Study Schedule', 
            error: 'Error fetching schedule.' 
        });
    }
};
