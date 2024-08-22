const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },

    employeeName: {
        type: String,
        required: true
    },

    date: {
        type: String,
        require: true,
    },

    status: {
        type: String,
        require: true
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance