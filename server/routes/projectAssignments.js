const express = require('express');
const router = express.Router();
const ProjectAssignment = require('../models/ProjectAssignment');
const Employee = require('../models/Employee');
const Project = require('../models/Project');

// POST /api/assignments – Assign an employee to a project
router.post('/', async (req, res) => {
  const { employee_id, project_code, start_date } = req.body;

  if (!employee_id || !project_code || !start_date) {
    return res.status(400).json({ message: 'All fields are required: employee_id, project_code, start_date' });
  }

  try {
    // Lookup by business key (employee_id/project_code) and fetch _id
    const employee = await Employee.findOne({ employee_id });
    const project = await Project.findOne({ project_code });

    if (!employee || !project) {
      return res.status(404).json({ message: 'Employee or Project not found' });
    }

    const newAssignment = new ProjectAssignment({
      employee_id: employee._id,
      project_code: project._id,
      start_date: new Date(start_date)
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created', assignment: newAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating assignment' });
  }
});

// GET /api/assignments – Fetch all assignments with populated fields
router.get('/', async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find()
      .populate('employee_id', 'employee_id full_name')
      .populate('project_code', 'project_code project_name')
      .sort({ start_date: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

module.exports = router;
