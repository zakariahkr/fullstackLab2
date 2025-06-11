// Import required packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Import route modules
const employeesRoutes = require('./routes/employees');
const projectsRoutes = require('./routes/projects');
const projectAssignmentsRoutes = require('./routes/projectAssignments');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Route setup
app.use('/api/employees', employeesRoutes); // Employee-related routes
app.use('/api/projects', projectsRoutes);   // Project-related routes
app.use('/api/assignments', projectAssignmentsRoutes); // Project assignment routes

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Connect to MongoDB using connection string from .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Connected to MongoDB database: ${dbName}`);

    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the app if DB connection fails
  });
