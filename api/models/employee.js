const mongoose = require('mongoose');

const employeesSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },

    employeeName: {
        type:String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    joiningDate: {
        type: String,
        required: true    
    },

    dateOfBirth: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        require: true
    },

    activeEmployee: {
        type:Boolean,
        require: true
    },

    phoneNumber: {
        type: String,
        require: true
    },

    address: {
        type: String,
        require: true
    },

    createAt: {
        type: Date,
        default: Date.now
    }
})

const Employee = mongoose.model('Employee', employeesSchema);
module.exports = Employee