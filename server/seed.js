require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Employee = require('./models/Employee.js');
const Project = require('./models/Project.js');
const ProjectAssignment = require('./models/ProjectAssignment.js');

const MONGODB_URI = (process.env.MONGODB_URI);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Employee.deleteMany({});
        await Project.deleteMany({});
        await ProjectAssignment.deleteMany({});

        const plainPasswords = ['ziko1zxc', 'lukas1zxc', 'messi1zxc', 'ronaldo1zxc', 'alex1zxc'];
        const hashedPasswords = await Promise.all(plainPasswords.map(pw => bcrypt.hash(pw, 10))
        );

        const employees = await Employee.insertMany([
            {employee_id: 'E001', full_name: 'Zakaria Majkouma', email: 'zakaria@hkr.se', hashed_password: hashedPasswords[0] },
            {employee_id: 'E002', full_name: 'Lukas Nilsson', email: 'lukas@hkr.se', hashed_password: hashedPasswords[1] },
            {employee_id: 'E003', full_name: 'Lionel Messi', email: 'messi@hkr.se', hashed_password: hashedPasswords[2] },
            {employee_id: 'E004', full_name: 'Cristiano Ronaldo', email: 'ronaldo@hkr.se', hashed_password: hashedPasswords[3] },
            {employee_id: 'E005', full_name: 'Alex Johnson', email: 'alex@hkr.se', hashed_password: hashedPasswords[4] }
        ]);

        const projects = await Project.insertMany([
            { project_code: 'P001', project_name: 'Website Redesign', project_description: 'Redesign the corporate website.'},
            { project_code: 'P002', project_name: 'Mobile App', project_description: 'Develop a new mobile application.'},
            { project_code: 'P003', project_name: 'Backend API', project_description: 'Build and document the backend API.'},
            { project_code: 'P004', project_name: 'Marketing Campaign', project_description: 'Create campaign assets.'},
            { project_code: 'P005', project_name: 'Cloud Migration', project_description: 'Migrate infrastructure to the cloud.'}
        ]);

        const assignments = await ProjectAssignment.insertMany([
            { employee_id: employees[0]._id, project_code: projects[0]._id, start_date: new Date('2025-06-01') },
            { employee_id: employees[1]._id, project_code: projects[1]._id, start_date: new Date('2025-06-05') },
            { employee_id: employees[2]._id, project_code: projects[2]._id, start_date: new Date('2025-06-10') },
            { employee_id: employees[3]._id, project_code: projects[3]._id, start_date: new Date('2025-06-15') },
            { employee_id: employees[4]._id, project_code: projects[4]._id, start_date: new Date('2025-06-25') }
        ]);
        console.log('Seed data inserted successfully!');
        process.exit();
    } catch (error) {
        console.error(' Error seeding data:', error);
        process.exit(1);
    }
}
seed();