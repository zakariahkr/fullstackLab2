const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  const { project_code, project_name, project_description } = req.body;

  if (!project_code || !project_name || !project_description) {
    return res.status(400).json({ message: 'All fields are required: project_code, project_name, project_description' });
  }

  try {
    const exists = await Project.findOne({ project_code });
    if (exists) {
      return res.status(409).json({ message: 'Project code must be unique' });
    }

    const newProject = new Project({ project_code, project_name, project_description });
    await newProject.save();

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

module.exports = router;
