const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employee_id: { type: String, unique:true, required: true},
    full_name: { type: String, required: true},
    email: { type: String, unique: true, required: true},
    hashed_password: { type: String}
});

module.exports = mongoose.model('Employee', employeeSchema);