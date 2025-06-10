import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignmentsTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [sortField, setSortField] = useState('start_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/assignments');
      const sorted = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      setAssignments(sorted.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  // Auto-refresh every minute
  useEffect(() => {
    fetchAssignments(); // initial fetch
    const interval = setInterval(fetchAssignments, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    const sorted = [...assignments].sort((a, b) => {
      const valA = field === 'start_date' ? new Date(a[field]) : a[field]?.toString().toLowerCase();
      const valB = field === 'start_date' ? new Date(b[field]) : b[field]?.toString().toLowerCase();

      return order === 'asc' ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
    });

    setSortField(field);
    setSortOrder(order);
    setAssignments(sorted);
  };

  return (
    <div>
      <h2>Latest 5 Project Assignments</h2>
      <table border="1" cellPadding="6" cellSpacing="0">
        <thead>
          <tr>
            <th onClick={() => handleSort('employee_id')}>Employee ID</th>
            <th onClick={() => handleSort('employee_name')}>Employee Name</th>
            <th onClick={() => handleSort('project_name')}>Project Name</th>
            <th onClick={() => handleSort('start_date')}>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a._id}>
              <td>{a.employee_id?.employee_id}</td>
              <td>{a.employee_id?.full_name}</td>
              <td>{a.project_code?.project_name}</td>
              <td>{new Date(a.start_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsTable;
