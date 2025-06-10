const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const employeesRoutes = require('./routes/employees');
const projectsRoutes = require('./routes/projects');
const projectAssignmentsRoutes = require('./routes/projectAssignments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/assignments', projectAssignmentsRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Connected to MongoDB database: ${dbName}`);
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

