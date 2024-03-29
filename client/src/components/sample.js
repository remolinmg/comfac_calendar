import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import { TextField } from "@mui/material";
import "../assets/css/homepage.css";
import NavBar from "../components/navbar";
import Sidebar from "../components/sidebar";
import axios from "axios";

const Homepage = () => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [projectModalIsOpen, setProjectModalIsOpen] = useState(false);
  const [duplicateModalIsOpen, setDuplicateModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [tableModalIsOpen, setTableModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [selectedRowData, setSelectedRowData] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [project, setProject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const localizer = momentLocalizer(moment);
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addHours, setAddHours] = useState('')
  const [addProjectName, setAddProjectName] = useState('')


  //set option in selectfield in name field
  const [options, setOptions] = useState([]);


  //Display Project Name in the Calendar
  const CustomEvent = ({ event }) => (
    <div>
      <strong> {event.Project}</strong>
    </div>
  );


  //Project Modal----------------------------------------------

  const openProjectModal = (slotInfo) => {
    setNewEvent({
      start: slotInfo.start,
      end: slotInfo.end,
      From_Time: "",
      To_Time: "",
      allDay: true,
      Project: "",
      Project_Name: "",
      Hrs: "",
    });
    setProjectModalIsOpen(true);
    setSelectedDate(slotInfo.start);
  };

  const [validationErrors, setValidationErrors] = useState({});
  const [projects, setProjects] = useState([]);

  // Define a function to retrieve existing projects for the selected date
  const getExistingProjectsForDate = (selectedDate) => {
    // Filter projects array to get projects that match the selected date
    return projects.filter((project) => project.date === selectedDate);
  };

  // Function to validate form data
  const validateForm = () => {
    const errors = {};
    const { Project = '', Project_Name = '', From_Time = '', To_Time = '', Hrs = '' } = newEvent;

    // Check if any required field is empty
    if (!Project.trim()) {
      errors.project = "Project is required";
    } else {
      errors.project = ""; // Clear the error message if the field is not empty
    }

    if (!Project_Name.trim()) {
      errors.projectName = "Project Name is required";
    } else {
      errors.projectName = ""; // Clear the error message if the field is not empty
    }

    if (!From_Time.trim()) {
      errors.fromTime = "From Time is required";
    } else {
      errors.fromTime = ""; // Clear the error message if the field is not empty
    }

    if (!To_Time.trim()) {
      errors.toTime = "To Time is required";
    } else {
      errors.toTime = ""; // Clear the error message if the field is not empty
    }

    if (!Hrs.trim()) {
      errors.hours = "Hours is required";
    } else {
      errors.hours = ""; // Clear the error message if the field is not empty
    }

    // Check if both time fields are filled, clear errors if they are
    if (From_Time.trim() && To_Time.trim()) {
      errors.fromTime = "";
      errors.toTime = "";
    }

    setValidationErrors(errors);

    // Return true if there are no errors
    return Object.keys(errors).every((key) => !errors[key]);
  };



  const next = () => {
    const isValid = validateForm(); // Validate the form
    if (isValid) {
      createProject(); // Proceed if the form is valid
      setProjectModalIsOpen(false);
      openModal();
    }
  };

  // Duplicate  Modal-----------------------------------------------------
  const openDuplicateModal = () => {
    setDuplicateModalIsOpen(true);
  };

  const closeDuplicateModal = () => {
    setDuplicateModalIsOpen(false);
  };

  const handleOptionClick = (selectedOption) => {
    setProject(selectedOption.Project);
    setStartTime(selectedOption.From_Time);
    setEndTime(selectedOption.To_Time);
    setNewEvent({
      ...newEvent,
      Project: selectedOption.Project,
      Project_Name: selectedOption.Project_Name,
    });
  };

  // validation duplicate --------
  const validateDuplicateForm = () => {
    const errors = {};
    const { From_Time = '', To_Time = '', Hrs = '' } = newEvent;

    if (!From_Time.trim()) {
      errors.fromTime = 'From Time is required';
    } else {
      errors.fromTime = '';
    }

    if (!To_Time.trim()) {
      errors.toTime = 'To Time is required';
    } else {
      errors.toTime = '';
    }

    if (!Hrs.trim()) {
      errors.hours = 'Hours is required';
    } else {
      errors.hours = '';
    }

    setValidationErrors(errors);
    return Object.keys(errors).every((key) => !errors[key]);
  };


  const duplicateProject = async () => {
    try {
      const response = await axios.post("http://localhost:8000/duplicate/project", newEvent,
        {
          params: {
            project,
            startTime,
            endTime,
          }
        });

      if (response.status === 201) {
        console.log('Document duplicated and modified successfully.');
      } else {
        console.error('Error duplicating and modifying document:', response.statusText);
      }
    } catch (error) {
      console.error('Error duplicating and modifying document:', error.message);
    }
  };

  const duplicateAssigned = async () => {
    try {
      const response = await axios.post("http://localhost:8000/duplicate/assign", newEvent, {
        params: {
          project,
          startTime,
          endTime,
        }
      });

      if (response.status === 201) {
        console.log('Document duplicated and modified successfully.');
      } else {
        console.error('Error duplicating and modifying document:', response.statusText);
      }
    } catch (error) {
      console.error('Error duplicating and modifying document:', error.message);
    }
  };


  const duplicate = () => {
    const isValid = validateDuplicateForm();
    if (isValid) {
      duplicateProject();
      duplicateAssigned();
    }
  };

  // Asssign Modal-----------------------------------------------------


  const [assignmentValidationErrors, setAssignmentValidationErrors] = useState(
    {}
  );

  const openModal = () => {
    setNewEvent({
      ID: "",
      Company: "",
      Project: newEvent.Project,
      Employee: [],
      Department: "",
      Series: "",
      ID_Time_Sheet: "",
      From_Time: newEvent.From_Time,
      To_Time: newEvent.To_Time,
      Project_Name: newEvent.Project_Name,
      Hrs: newEvent.Hrs,
    });
    setModalIsOpen(true);
  };

  //add more employee

  const openADDModal = () => {
    setNewEvent({
      ID: "",
      Company: "",
      Project: project,
      Employee: [],
      Department: "",
      Series: "",
      ID_Time_Sheet: "",
      From_Time: startTime,
      To_Time: endTime,
      Project_Name: addProjectName,
      Hrs: addHours,
    });
    setTableModalIsOpen(false);
    setModalIsOpen(true);
  };

  // Function to validate form data for Assign People modal
  const validateAssignmentForm = () => {
    const errors = {};


    // Check if Department is defined and is a non-empty string
    if (!newEvent.Department || typeof newEvent.Department !== 'string' || !newEvent.Department.trim()) {
      errors.department = "Department is required";
    } else {
      errors.department = ""; // Clear the error message if the field is not empty
    }

    // Check if Company is defined and is a non-empty string
    if (!newEvent.Company || typeof newEvent.Company !== 'string' || !newEvent.Company.trim()) {
      errors.company = "Company is required";
    } else {
      errors.company = ""; // Clear the error message if the field is not empty
    }

    setAssignmentValidationErrors(errors);

    // Return true if there are no errors
    return Object.values(errors).every((error) => !error);
  };


  // Update the createAssignment function to include validation check

  const createAssignment = async () => {
    // Check if there are any validation errors
    if (!validateAssignmentForm()) {
      return; // Return early if there are validation errors
    }

    // Proceed with assignment logic
    try {
      const response = await axios.post(
        "http://localhost:8000/add/assign",
        newEvent
      );
      if (response.status === 201) {
        alert("Assigned successfully");
        fetchData(); // Update the data after assignment

        // Clear all fields after successful assignment
        setNewEvent({
          ID: "",
          Company: "",
          Project: newEvent.Project,
          Employee: [],
          Department: "",
          Series: "",
          ID_Time_Sheet: "",
          From_Time: newEvent.From_Time,
          To_Time: newEvent.To_Time,
          Project_Name: newEvent.Project_Name,
          Hrs: newEvent.Hrs,
        });

        // Clear validation errors
        setAssignmentValidationErrors({});
      } else {
        alert("Assignment failed");
      }
    } catch (error) {
      alert("Error");
    }
  };

  const clearValidationErrors = (field) => {
    setAssignmentValidationErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '', // Clear the error message for the specified field
    }));
  };


  // text area assign employee-----------
  const [selectedNames, setSelectedNames] = useState([]);
  const textAreaRef = useRef(null);
  const appendToTextArea = (value) => {
    textAreaRef.current.value += `${value}\n`; // Append selected option to textarea with a newline
  };
  const removeName = (index) => {
    const updatedNames = [...newEvent.Employee];
    updatedNames.splice(index, 1);

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      Employee: updatedNames,
    }));

    updateTextArea(updatedNames);
  };

  const updateTextArea = () => {
    textAreaRef.current.value = selectedNames.join('\n'); // Update textarea content
  };


  //--------------------------------------------------------------

  // Function to get employees based on the selected department
  const getEmployeesByDepartment = (selectedDepartment) => {
    return options.filter((option) => option.department === selectedDepartment);
  };

  // Inside your component
  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    const employeesForDepartment = getEmployeesByDepartment(selectedDepartment);

    setNewEvent({
      ...newEvent,
      Department: selectedDepartment,
      Employee: '', // Reset selected employee when the department changes
    });

    clearValidationErrors('department');
    clearValidationErrors('employee'); // Clear validation error for employee

    // Update the options for the Employee dropdown
    setEmployeeOptions(employeesForDepartment);
  };

  // Assuming you have state for employeeOptions
  const [employeeOptions, setEmployeeOptions] = useState([]);

  // Dropdown of department option in Add Assign
  const uniqueOptions = options.reduce((unique, option) => {
    const exists = unique.some((u) => u.department === option.department);
    if (!exists) {
      unique.push(option);
    }
    return unique;
  }, []);



  //Close all modals--------------------------------------------------------------
  const closeModal = () => {
    setModalIsOpen(false);
    setTableModalIsOpen(false);
    setProjectModalIsOpen(false);

    setNewEvent({});
    refreshPage();
  };

  //get data from database
  // DATA ---------------------------------------------------------------
  useEffect(() => {
    fetchData();
    // Fetch initial data when the component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get/project");
      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.error("Data is not an array:", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/get/assignpeople",
        {
          params: {
            project,
            startTime,
            endTime,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error here, e.g., set an error state
    }
  };

  const tableAssign = (event) => {
    setProject(event.Project);
    setStartTime(event.From_Time);
    setEndTime(event.To_Time);
    setSelectedProject(event._id);
    setAddHours(event.Hrs);
    setAddProjectName(event.Project_Name);
    setTableModalIsOpen(true);
  };

  useEffect(() => {
    // Call fetchEmployeeData here or perform other actions
    fetchEmployeeData();
  }, [project, startTime, endTime, tableModalIsOpen]);

  //Add Project Data
  async function createProject() {
    try {
      const response = await axios.post(
        "http://localhost:8000/add/project",
        newEvent
      );

      if (response.status === 201) {
        fetchData();
      } else {
      }
    } catch (error) {
      alert("Error");
    }
  }

  // Search Function----------------------------------------------------------------------------

  const [currentDate, setCurrentDate] = useState(new Date());


  // Table modal -------------------

  // Function to handle click on table row and open edit modal


  //Edit Modal----------------------------------------------------------------------------------------
  const handleRowClick = (event) => {
    setSelectedRowData(event._id);
    setNewEvent({
      Company: event.Company,
      Project: event.Project,
      Employee: event.Employee,
      Department: event.Department,
      From_Time: event.From_Time,
      To_Time: event.To_Time,
      Hrs: event.Hrs,
    });
    setEditModalIsOpen(true);

  };

  const updateRowData = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/update/assign/${selectedRowData}`,
        newEvent
      );
      console.log(response.data);
      fetchData();
      setEditModalIsOpen(false);
      alert("Edited Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  //Delete
  const deleteRow = async () => {
    try {
      await axios.delete(
        'http://localhost:8000/delete/assign',
        {
          Project: project,
          To_Time: endTime,
          From_Time: startTime,
          selectedRowData
        } // Send parameters in the request body
      );

      fetchEmployeeData();
      alert('Deleted Successfully');
    } catch (error) {
      console.error(error);
      // Handle errors as needed
    }
  };

  //Delete Project

  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/delete/project/${selectedProject}`
      );
      deleteRow();
      fetchData();
      setEditModalIsOpen(false);
      alert("Deleted Successfully");
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };




  useEffect(() => {
    // Fetch data from the database or API endpoint
    fetch("http://localhost:8000/get/people")
      .then((response) => response.json())
      .then((data) => setOptions(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  function refreshPage() {
    window.location.reload(false);
  }

  function convertTo12HourFormat(timeString) {
    // Parse the time string to get hours and minutes
    const [hours, minutes] = timeString.split(":");

    // Convert hours to 12-hour format
    const twelveHourFormat = hours % 12 || 12;

    // Determine whether it is AM or PM
    const period = hours < 12 ? "AM" : "PM";

    // Return the formatted time
    return `${twelveHourFormat}:${minutes}:00 ${period}`;
  }

  const fromTimeFormatter = (e) => {
    const formattedTime = convertTo12HourFormat(e.target.value);
    setNewEvent({
      ...newEvent,
      From_Time: format(selectedDate, "MMMM dd, yyyy") + " " + formattedTime,
    });
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      From_Time: e.target.value.trim() ? "" : "From Time is required",
    }));
  };

  const toTimeFormatter = (e) => {
    const formattedTime = convertTo12HourFormat(e.target.value);
    setNewEvent({
      ...newEvent,
      To_Time: format(selectedDate, "MMMM dd, yyyy") + " " + formattedTime,
    });
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      To_Time: e.target.value.trim() ? "" : "To Time is required",
    }));
  };


  return (
    <div className="homepage-container p-0 max-vh-100 max-vw-100">
      <NavBar />
      <div className="max-vh-100 max-vw-100">
        <div className="row p-0 m-0">
          <div className="col-2 p-0">
            <Sidebar />
          </div>
          <div className="col-10 p-0 vh-100">
            <div className="calendar-container">
              <div className="calendar-card">

                <div className="calendar">
                  <Calendar
                    localizer={localizer}
                    defaultDate={currentDate}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={tableAssign}
                    events={events}
                    components={{
                      event: CustomEvent,
                    }}
                    style={{
                      position: "relative",
                      height: 450,
                      width: 800,
                      color: "white",
                      zIndex: 200,
                    }}
                    selectable={true}
                    onSelectSlot={openProjectModal}
                    dayPropGetter={(date) => {
                      if (moment(date).isSame(currentDate, "day")) {
                        return {
                          style: {
                            backgroundColor: "#00BA9D", // Today Color
                          },
                        };
                      }
                      return {}; // Return an empty object for days with default styling
                    }}
                  />
                  {/* Create Project modal */}
                  <Modal
                    isOpen={projectModalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Assign People"
                    style={{
                      overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 500,
                      },
                      content: {
                        position: "absolute",
                        top: "52%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "800px",
                        padding: "20px",
                        backgroundColor: "white",
                        height: "80%",
                      },
                    }}
                  >
                    <div className="assign-form d-flex flex-column justify-content-center popup-form">

                      <div className="d-flex justify-content-between ">
                        <div className="text-success">
                          <h2>Create Project</h2>
                        </div>
                        <div>
                          <button
                            className="btn btn-outline-danger m-1 mt-0"
                            onClick={closeModal} >
                            X
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <TextField
                            id="date"
                            className="textfield"
                            label="Date"
                            variant="outlined"
                            value={moment(newEvent.start).format("LL")}
                            style={{ paddingBottom: 15, width: "100%" }}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                start: e.target.value,
                              })
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <TextField
                            id="project"
                            className="textfield"
                            label="Project"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.Project}
                            onChange={(e) => {
                              setNewEvent((prevState) => ({
                                ...prevState,
                                Project: e.target.value,
                              }));
                              setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                project: e.target.value.trim()
                                  ? ""
                                  : "Project is required",
                              }));
                            }}
                            error={!!validationErrors.project}
                            helperText={validationErrors.project}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <TextField
                            id="projectname"
                            className="textfield"
                            label="Project Name"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.Project_Name}
                            onChange={(e) => {
                              setNewEvent((prevState) => ({
                                ...prevState,
                                Project_Name: e.target.value,
                              }));
                              setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                projectName: e.target.value.trim()
                                  ? ""
                                  : "Project Name is required",
                              }));
                            }}
                            error={!!validationErrors.projectName}
                            helperText={validationErrors.projectName}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-4">
                          <TextField
                            type="time"
                            id="fromtime"
                            className="textfield"
                            label="From Time"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            onChange={fromTimeFormatter}
                            error={!!validationErrors.fromTime}
                            helperText={validationErrors.fromTime}
                            required
                          />
                        </div>
                        <div className="col-4">
                          <TextField
                            type="time"
                            id="totime"
                            className="textfield"
                            label="To Time"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            onChange={toTimeFormatter}
                            error={!!validationErrors.toTime}
                            helperText={validationErrors.toTime}
                            required
                          />
                        </div>
                        <div className="col-4">
                          <TextField
                            id="hours"
                            label="Hours"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.Hrs}
                            onChange={(e) => {
                              setNewEvent((prevState) => ({
                                ...prevState,
                                Hrs: e.target.value,
                              }));
                              setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                hours: e.target.value.trim()
                                  ? ""
                                  : "Hours is required",
                              }));
                            }}
                            error={!!validationErrors.hours}
                            helperText={validationErrors.hours}
                            required
                          />
                        </div>
                      </div>
                      <button
                        className="modalBtn"
                        onClick={next}
                        style={{ marginBottom: 15 }}
                      >
                        Assign
                      </button>

                      <button
                        className="modalBtnExt"
                        onClick={openDuplicateModal}
                        style={{ marginBottom: 15 }}
                      >
                        Duplicate Project
                      </button>
                    </div>
                  </Modal>

                  {/* Duplicate Assign Employee modal */}
                  <Modal
                    isOpen={duplicateModalIsOpen}
                    onRequestClose={closeDuplicateModal}
                    contentLabel="Assign People"
                    style={{
                      overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 500,
                      },
                      content: {
                        position: 'absolute',
                        top: '52%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '800px',
                        padding: '20px',
                        backgroundColor: 'white',
                        height: '80%',
                      },
                    }}
                  >
                    <div className="assign-form d-flex flex-column justify-content-center popup-form">
                      <div className="d-flex justify-content-between">
                        <div className="text-primary">
                          <h2>Duplicate Project</h2>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={closeModal}
                            className="btn btn-outline-danger m-1 mt-0"
                          >
                            X
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <TextField
                            id="date"
                            className="textfield"
                            label="Date"
                            variant="outlined"
                            value={format(selectedDate, 'MMMM dd, yyyy')}
                            style={{ paddingBottom: 15, width: '100%' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <select
                            id="ExtPorject"
                            className="textfield"
                            label="ExtPorject"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: '100%', height: '55px' }}
                            required
                          >
                            <option value="">Select Project</option>
                            {events.slice().reverse().map((option) => (
                              <option
                                key={option.id}
                                value={option.value}
                                onClick={() => handleOptionClick(option)}
                              >
                                {option.Project} - {option.From_Time} - {option.To_Time}
                              </option>
                            ))}
                          </select>
                        </div>

                      </div>
                      <div className="row">
                        <div className="col-4">
                          <TextField
                            type="time"
                            id="fromtime"
                            className="textfield"
                            label="From Time"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: '100%' }}
                            onChange={fromTimeFormatter}
                            error={!!validationErrors.fromTime}
                            helperText={validationErrors.fromTime}
                            required
                          />
                        </div>
                        <div className="col-4">
                          <TextField
                            type="time"
                            id="totime"
                            className="textfield"
                            label="To Time"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: '100%' }}
                            onChange={toTimeFormatter}
                            error={!!validationErrors.toTime}
                            helperText={validationErrors.toTime}
                            required
                          />
                        </div>
                        <div className="col-4">
                          <TextField
                            id="hours"
                            label="Hours"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: '100%' }}
                            value={newEvent.Hrs}
                            onChange={(e) => {
                              setNewEvent((prevState) => ({
                                ...prevState,
                                Hrs: e.target.value,
                              }));
                              setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                hours: e.target.value.trim() ? '' : 'Hours is required',
                              }));
                            }}
                            error={!!validationErrors.hours}
                            helperText={validationErrors.hours}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <button
                          className="modalBtnExt"
                          onClick={duplicate}
                          style={{ marginBottom: 15 }}
                        >
                          Duplicate
                        </button>
                        <button
                          className="modalBtndelete"
                          onClick={closeDuplicateModal}
                          style={{ marginBottom: 15 }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Modal>

                  {/* Assign Employee modal */}
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Assign People"
                    style={{
                      overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 500,
                      },
                      content: {
                        position: "absolute",
                        top: "52%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "800px",
                        padding: "20px",
                        backgroundColor: "white",
                        height: "80%",
                      },
                    }}
                  >
                    <div className="assign-form d-flex flex-column justify-cfontent-center popup-form">
                      <h2>Assign People</h2>

                      <div className="row">
                        <div className="col-12">
                          <TextField
                            id="date"
                            className="textfield"
                            label="Date"
                            variant="outlined"
                            value={format(selectedDate, "MMMM dd, yyyy")}
                            style={{ paddingBottom: 15, width: "100%" }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <TextField
                            id="company"
                            label="Company"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.Company}
                            onChange={(e) => {
                              setNewEvent({
                                ...newEvent,
                                Company: e.target.value,
                              });
                              clearValidationErrors('company'); // Clear validation error for company
                            }}
                            error={!!assignmentValidationErrors.company}
                            helperText={assignmentValidationErrors.company}
                            required
                          />
                        </div>
                      </div>

                      <div className="row ">
                        <div className="col-6">
                          <select
                            id="name"
                            label="Name"
                            variant="outlined"
                            className="textfield"
                            style={{ paddingBottom: 15, width: "100%", height: "55px", margin: "0" }}
                            value={""}
                            onChange={(e) => {
                              const selectedName = e.target.value;

                              if (!newEvent.Employee.includes(selectedName)) {
                                setNewEvent((prevEvent) => ({
                                  ...prevEvent,
                                  Employee: [...prevEvent.Employee, selectedName],
                                }));

                                appendToTextArea(selectedName);
                              }
                            }}
                            error={!!assignmentValidationErrors.employee}
                            required
                          >
                            <option value="" disabled>
                              Select Name
                            </option>
                            {employeeOptions.map((option) => (
                              <option key={option.id} value={option.value}>
                                {option.name}
                              </option>
                            ))}
                          </select>

                        </div>

                        <div className="col-6">
                          <select
                            id="department"
                            className="textfield"
                            label="Department"
                            variant="outlined"
                            value={newEvent.Department}
                            style={{ paddingBottom: 15, width: "100%", height: "55px", margin: "0" }}
                            onChange={handleDepartmentChange}
                            error={!!assignmentValidationErrors.department}
                            helperText={assignmentValidationErrors.department}
                            required
                          >
                            <option value="">Department*</option>
                            {uniqueOptions.map((option) => (
                              <option key={option.id} value={option.value}>
                                {option.department}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <textarea
                            ref={textAreaRef} // Attach the ref to the textarea
                            id="textareaassign"
                            label="textareaassign"
                            variant="outlined"
                            style={{ paddingBottom: 30, width: "100%", marginBottom: "20%", marginTop: 20, height: "80%" }}
                            onChange={(e) => {
                              // Split the textarea value into an array of names
                              const namesFromTextarea = e.target.value.split('\n').filter(Employee => Employee.trim() !== '');

                              // Update the state with the names from the textarea
                              setNewEvent({ ...newEvent, Employee: namesFromTextarea });

                              // Update the textarea content
                              updateTextArea(namesFromTextarea);
                            }}
                            required
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
                        <button
                          className="modalBtn"
                          onClick={createAssignment}
                          style={{ marginBottom: 15 }}
                        >
                          Assign
                        </button>
                        <button
                          className="modalBtndelete"
                          onClick={() => {
                            closeModal(); // Close the "Assign People" modal

                          }}
                          style={{ marginBottom: 15 }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Modal>

                  {/* table modal */}
                  <Modal
                    isOpen={tableModalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={{
                      overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
                        zIndex: 500,
                      },
                      content: {
                        position: "absolute",
                        top: "52%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "1200px",
                        padding: "20px",
                        backgroundColor: "white",
                        height: "80%",
                      },
                    }}
                  >
                    <div className="d-flex justify-content-between ">
                      <div>
                        <h2>Employee List for Project</h2>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={openADDModal}
                          className="addemployee btn btn-outline-success m-1 mt-0"
                        >
                          Add
                        </button>

                        <button

                          type="button"
                          onClick={closeModal}
                          className="btn btn-outline-danger m-1 mt-0"
                        >
                          X
                        </button>
                      </div>
                    </div>
                    <div className="table-container-employeetoday">
                      <table className="tablelistemployeetoday">
                        <thead className="listemployeetodayhead">
                          <tr>
                            <th>Company</th>
                            <th>Project</th>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>From Time</th>
                            <th>To Time</th>
                            <th>Hrs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row) => (
                            <tr
                              key={row._id}
                              onClick={() => handleRowClick(row)}
                            >
                              <td>{row.Company}</td>
                              <td>{row.Project}</td>
                              <td>{row.Employee}</td>
                              <td>{row.Department}</td>
                              <td>{row.From_Time}</td>
                              <td>{row.To_Time}</td>
                              <td>{row.Hrs}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button type="button" class="btn btn-danger float-xl-end mt-2" onClick={deleteProject}>
                      Delete Project
                    </button>
                  </Modal>

                  {/* Edit Employee */}
                  <Modal
                    isOpen={editModalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Edit Assign People"
                    style={{
                      overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
                        zIndex: 500,
                      },
                      content: {
                        position: "absolute",
                        top: "52%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "800px",
                        padding: "20px",
                        backgroundColor: "white",
                        height: "80%",
                      },
                    }}
                  >
                    <div className="assign-form d-flex flex-column justify-content-center popup-form">
                      <div className="d-flex justify-content-between ">
                        <div className="text-success">
                          <h2>Edit Assign People</h2>
                        </div>
                        <div>
                          <button
                            className="btn btn-outline-danger m-1 mt-0"
                            onClick={() => setEditModalIsOpen(false)} >
                            X
                          </button>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <TextField
                            id="company"
                            label="Company"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.Company}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Company: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-6">
                          <TextField
                            id="project"
                            className="textfield"
                            label="Project"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.Project}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Project: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <select
                            id="name"
                            label="Name"
                            variant="outlined"
                            className="textfield"
                            style={{ paddingBottom: 15, width: "100%", height: "55px", margin: "0" }}
                            value={newEvent.Employee}
                            error={!!assignmentValidationErrors.employee}
                            required
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Employee: e.target.value,
                              })
                            }
                          >
                            <option value="" disabled>
                              Select Name
                            </option>
                            {options.map((option) => (
                              <option key={option.id} value={option.value}>
                                {option.name}
                              </option>
                            ))}
                          </select>

                        </div>

                        <div className="col-6">
                          <select
                            id="department"
                            className="textfield"
                            label="Department"
                            variant="outlined"
                            value={newEvent.Department}
                            style={{ paddingBottom: 15, width: "100%", height: "55px", margin: "0" }}
                            onChange={handleDepartmentChange}
                            error={!!assignmentValidationErrors.department}
                            helperText={assignmentValidationErrors.department}
                            required
                          >
                            <option value="">Department*</option>
                            {uniqueOptions.map((option) => (
                              <option key={option.id} value={option.value}>
                                {option.department}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col-4">
                          <TextField
                            id="fromtime"
                            className="textfield"
                            label="From Time"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.From_Time}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                fromtime: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-4">
                          <TextField
                            id="totime"
                            className="textfield"
                            label="To Time"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.To_Time}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                totime: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-4">
                          <TextField
                            id="hours"
                            label="Hours"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.Hrs}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Hrs: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <button
                        className="modalBtn"
                        onClick={updateRowData}
                        style={{ marginBottom: 15 }}
                      >
                        Save
                      </button>
                      <button
                        className="modalBtndelete "
                        onClick={deleteRow}
                        style={{ marginBottom: 15 }}
                      >
                        Delete
                      </button>

                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
