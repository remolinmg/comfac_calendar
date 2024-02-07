import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [projectName, setProjectName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeInput, setEmployeeInput] = useState('');

  const [tableData, setTableData] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'projectName') {
      setProjectName(value);
    } else if (name === 'employeeInput') {
      setEmployeeInput(value);
    }
  };

  const addEmployee = () => {
    if (employeeInput.trim() !== '') {
      setEmployees((prevEmployees) => [...prevEmployees, employeeInput]);
      setEmployeeInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if both fields are filled
    if (projectName.trim() === '' || employees.length === 0) {
      alert('Please fill in all fields');
      return;
    }
  
    try {
      // Send data to the server using Axios
      const response = await axios.post('http://localhost:8000/addsample', {
        projectName,
        employees,
      });
  
      if (response.status === 201) {
        // Update table data if successful
        setTableData((prevData) => [
          ...prevData,
          ...response.data.savedEmployees,
        ]);
  
        // Clear form fields
        setProjectName('');
        setEmployees([]);
        setEmployeeInput('');
      } else {
        console.error('Failed to save data to the server');
        alert('Failed to save data. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting to the server', error);
      alert('Error connecting to the server. Please try again later.');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            name="projectName"
            value={projectName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Employees:
          <textarea
            name="employeeInput"
            value={employeeInput}
            onChange={handleInputChange}
          />
          <button type="button" onClick={addEmployee}>
            Add Employee
          </button>
        </label>
        <br />
        <button type="submit">Add Project</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Employee</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            row.employees.map((employee, employeeIndex) => (
              <tr key={`${index}-${employeeIndex}`}>
                {employeeIndex === 0 ? (
                  <td rowSpan={row.employees.length}>{row.projectName}</td>
                ) : null}
                <td>{employee}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
