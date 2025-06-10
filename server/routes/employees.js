const express = require('express');
const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');
const router = express.Router();

// POST: Add new employee
router.post('/', async (req, res) => {
  const { employee_id, full_name, email, password } = req.body;

  if (!employee_id || !full_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required: employee_id, full_name, email, password' });
  }

  try {
    const existing = await Employee.findOne({ $or: [{ employee_id }, { email }] });
    if (existing) {
      return res.status(400).json({ message: 'Employee with this ID or Email already exists' });
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const newEmployee = await Employee.create({ employee_id, full_name, email, hashed_password });

    res.status(201).json({ message: 'Employee added', employee_id: newEmployee.employee_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: All employees (no populate needed)
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().select('-hashed_password');
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

module.exports = router;
