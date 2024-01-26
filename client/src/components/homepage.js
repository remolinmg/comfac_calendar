import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format } from 'date-fns';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import { TextField } from "@mui/material";
import "../assets/css/homepage.css";
import NavBar from "../components/navbar";
import Sidebar from "../components/sidebar";
import axios from "axios";

const Homepage = () => {
  // const timeFormat = moment().format("hh:mm:ss A");
  // const dateFormat = moment().format("MM/DD/YYYY hh:mm:ss A");
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [projectModalIsOpen, setProjectModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [tableModalIsOpen, setTableModalIsOpen] = useState(false);
  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState("");
  const [project, setProject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const localizer = momentLocalizer(moment);
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  //Display Project Name in the Calendar
  const CustomEvent = ({ event }) => (
    <div>
      <strong> {event.Project}</strong>
    </div>
  );


  //Project Modal----------------------------------------------

  const [newEvent, setNewEvent] = useState({
    start: "",
    end: "",
    From_Time: "",
    To_Time: "",
    allDay: true,
    Project: "",
    Project_Name: "",
    Hrs: ""
  });


  const openProjectModal = (slotInfo) => {
    console.log("slotInfo", slotInfo); // Check the value of slotInfo
    setNewEvent({
      ...newEvent,
      start: slotInfo.start,
      end: slotInfo.end,
      From_Time: "",
      To_Time: "",
      allDay: true,
      Project: "",
      Project_Name: "",
    });
    console.log("newEvent", newEvent); // Check the value of newEvent after updating
    setProjectModalIsOpen(true);
    setSelectedDate(slotInfo.start);
  };


  const [validationErrors, setValidationErrors] = useState({});
  const [projects, setProjects] = useState([]);

  // Define a function to retrieve existing projects for the selected date
  const getExistingProjectsForDate = (selectedDate) => {
    // Filter projects array to get projects that match the selected date
    return projects.filter(project => project.date === selectedDate);
  };

  // Function to validate form data
  const validateForm = () => {
    const errors = {};

    // Check if any required field is empty
    if (!newEvent.Project.trim()) {
      errors.project = "Project is required";
    } else {
      errors.project = ""; // Clear the error message if the field is not empty
    }

    if (!newEvent.Project_Name.trim()) {
      errors.projectName = "Project Name is required";
    } else {
      errors.projectName = ""; // Clear the error message if the field is not empty
    }

    if (!newEvent.From_Time.trim()) {
      errors.fromTime = "From Time is required";
    } else {
      errors.fromTime = ""; // Clear the error message if the field is not empty
    }

    if (!newEvent.To_Time.trim()) {
      errors.toTime = "To Time is required";
    } else {
      errors.toTime = ""; // Clear the error message if the field is not empty
    }

    if (!newEvent.Hrs.trim()) {
      errors.hours = "Hours is required";
    } else {
      errors.hours = ""; // Clear the error message if the field is not empty
    }

    setValidationErrors(errors);

    // Return true if there are no errors
    return Object.keys(errors).every(key => !errors[key]);
  };



  const next = () => {
    const isValid = validateForm(); // Validate the form
    if (isValid) {
      createProject(); // Proceed if the form is valid
      setProjectModalIsOpen(false);
      openModal();
    }
  };




  // Asssign Modal-----------------------------------------------------

  const [assignmentValidationErrors, setAssignmentValidationErrors] = useState({});

  const openModal = () => {
    setNewEvent({
      ID: "",
      Company: "",
      Project: newEvent.Project,
      Employee: "",
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

  // Function to validate form data for Assign People modal
  const validateAssignmentForm = () => {
    const errors = {};

    // Check if any required field is empty
    if (!newEvent.Employee.trim()) {
      errors.employee = "Employee is required";
    } else {
      errors.employee = ""; // Clear the error message if the field is not empty
    }

    if (!newEvent.Department.trim()) {
      errors.department = "Department is required";
    } else {
      errors.department = ""; // Clear the error message if the field is not empty
    }

    if (!newEvent.Company.trim()) {
      errors.company = "Company is required";
    } else {
      errors.company = ""; // Clear the error message if the field is not empty
    }

    setAssignmentValidationErrors(errors);

    // Return true if there are no errors
    return Object.values(errors).every(error => !error);
  };
  // Function to handle form submission for Assign People modal
  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    const isValid = validateAssignmentForm(); // Validate the form
    if (isValid) {
      createAssignment(); // Proceed if the form is valid
      closeModal(); // Close the modal after submission
    }
  };

  // Update the createAssignment function to include validation check
  const createAssignment = async () => {
    // Check if there are any validation errors
    if (!validateAssignmentForm()) {
      return; // Return early if there are validation errors
    }

    // Proceed with assignment logic
    try {
      const response = await axios.post("http://localhost:8000/add/assign", newEvent);
      if (response.status === 201) {
        alert("Assigned successfully");
        fetchData(); // Update the data after assignment
      } else {
        alert("Assignment failed");
      }
    } catch (error) {
      alert("Error");
    }
  };



  //Close all modals--------------------------------------------------------------
  const closeModal = () => {
    setModalIsOpen(false);
    setEditModalIsOpen(false);
    setTableModalIsOpen(false);
    setProjectModalIsOpen(false);
    setEventModalIsOpen(false);
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
  const [searchEvent, setSearchEvent] = useState("");
  const [foundEventDate, setFoundEventDate] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleSearch = () => {
    const foundEvent = events.find(
      (event) =>
        event.name.toLowerCase().includes(searchEvent.toLowerCase()) ||
        event.department.toLowerCase().includes(searchEvent.toLowerCase()) ||
        event.project.toLowerCase().includes(searchEvent.toLowerCase())
    );

    if (foundEvent) {
      const foundEventDate = moment(foundEvent.start).toDate();
      setCurrentDate(foundEventDate);
      console.log(foundEvent);
    }
  };

  const navigateToDate = (date) => {
    // Use onNavigate to set the new date
    onNavigate("day", date);
  };

  const onNavigate = (view, newDate) => {
    console.log("Navigated to:", view, newDate);
    // Handle navigation logic here
    // You might want to update the events based on the new date
  };

  const handleNavigate = (newDate, view, action) => {
    // Check if the new date is December 30, 2023
    const isDecember30_2023 =
      moment(newDate).month() === 11 &&
      moment(newDate).date() === 30 &&
      moment(newDate).year() === 2023;

    if (isDecember30_2023) {
      console.log("Navigating to December 30, 2023:", newDate);

      // setCurrentDate(newDate);
    }

    // Perform any other navigation logic as needed
  };

  // Table modal -------------------
  const [rowData, setRowData] = useState(null);

  // Function to handle click on table row and open edit modal
  const handleRowClick = (row) => {
    setRowData(row); // Set the data of the clicked row
    setEditModalIsOpen(true); // Open the edit modal
  };


  //Edit Modal----------------------------------------------------------------------------------------
  const editModal = (event) => {
    setSelectedRowData(event._id);
    setNewEvent({
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      company: event.company,
      project: event.project,
      name: event.name,
      department: event.department,
      fromtime: event.fromtime,
      totime: event.totime,
      hours: event.hours,
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
  const deleteRow = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/delete/assign/${selectedRowData}`
      );
      fetchData();
      setEditModalIsOpen(false);
      alert("Deleted Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  //set option in selectfield in name field
  const [options, setOptions] = useState([]);

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
                <div className="calendarSearchBar">
                  <input
                    class="form-control mr-sm-2 searchBar"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchEvent}
                    onChange={(e) => setSearchEvent(e.target.value)}
                    Event
                  />
                  <button
                    class="btn btn-success my-2 my-sm-0 searchBtn"
                    type="submit"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
                <div className="calendar">
                  <Calendar
                    localizer={localizer}
                    defaultDate={currentDate}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={tableAssign}
                    events={events}
                    components={{
                      event: CustomEvent
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
                  {/* project modal */}
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
                      <h2 className="text-danger">Create Project</h2>
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
                                project: e.target.value.trim() ? "" : "Project is required",
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
                                projectName: e.target.value.trim() ? "" : "Project Name is required",
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
                            value={newEvent.From_Time}
                            onChange={(e) => {
                              setNewEvent((prevState) => ({
                                ...prevState,
                                From_Time: e.target.value,
                              }));
                              setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                fromTime: e.target.value.trim() ? "" : "From Time is required",
                              }));
                            }}
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
                            value={newEvent.To_Time}
                            onChange={(e) => {
                              setNewEvent((prevState) => ({
                                ...prevState,
                                To_Time: e.target.value,
                              }));
                              setValidationErrors((prevErrors) => ({
                                ...prevErrors,
                                toTime: e.target.value.trim() ? "" : "To Time is required",
                              }));
                            }}
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
                                hours: e.target.value.trim() ? "" : "Hours is required",
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
                        className="modalBtn"
                        onClick={closeModal}
                        style={{ marginBottom: 15 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Modal>

                  {/* modal for assign project */}
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
                    <div className="assign-form d-flex flex-column justify-content-center popup-form">
                      <h2>Assign People</h2>
                      <div class="mb-3 form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="exampleCheck1"
                        />
                        <label class="form-check-label" for="exampleCheck1">
                          Listed Employee
                        </label>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <TextField
                            id="date"
                            className="textfield"
                            label="Date"
                            variant="outlined"
                            value={format(selectedDate, 'MMMM dd, yyyy')}
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
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Company: e.target.value,
                              })
                            }
                            error={!!assignmentValidationErrors.company}
                            helperText={assignmentValidationErrors.company}
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
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, Employee: e.target.value })
                            }
                            error={!!assignmentValidationErrors.employee}
                            required
                          >
                            <option value="">Name*</option>
                            {options.map((option) => (
                              <option key={option.id} value={option.value}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6">
                          <TextField
                            id="department"
                            className="textfield"
                            label="Department"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%", }}
                            value={newEvent.Department}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Department: e.target.value,
                              })
                            }
                            error={!!assignmentValidationErrors.department}
                            helperText={assignmentValidationErrors.department}
                            required
                          />
                        </div>
                      </div>
                      <button
                        className="modalBtn"
                        onClick={createAssignment}
                        style={{ marginBottom: 15 }}
                      >
                        Assign
                      </button>
                      <button
                        className="modalBtn"
                        onClick={closeModal}
                        style={{ marginBottom: 15 }}
                      >
                        Cancel
                      </button>
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
                    <div className="d-flex justify-content-between">
                      <div>
                        <h2>Employee List for Project</h2>
                      </div>
                      <div>
                      <button type="button" class="btn btn-danger">Delete</button>
                        <button type="button" onClick={closeModal} className="btn btn-outline-danger">X</button>
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
                            <tr key={row._id} onClick={() => handleRowClick(row)}>
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
                  </Modal>

                  {/* modal for edit employee */}
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
                      <h2>Edit Assign People</h2>
                      <div class="mb-3 form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="exampleCheck1"
                        />
                        <label class="form-check-label" for="exampleCheck1">
                          Listed Employee
                        </label>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <TextField
                            id="date"
                            className="textfield"
                            label="Date"
                            variant="outlined"
                            value={newEvent.start}
                            style={{ paddingBottom: 15, width: "100%" }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <TextField
                            id="company"
                            label="Company"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.company}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                company: e.target.value,
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
                            value={newEvent.project}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                project: e.target.value,
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
                            style={{ paddingBottom: 15, width: 355 }}
                            value={newEvent.name}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, name: e.target.value })
                            }
                          >
                            <option value="">Name*</option>
                            {options.map((option) => (
                              <option key={option.id} value={option.value}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6">
                          <TextField
                            id="department"
                            className="textfield"
                            label="Department"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.department}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                department: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-4">
                          <TextField
                            id="fromtime"
                            className="textfield"
                            label="From Time"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.fromtime}
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
                            value={newEvent.totime}
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
                            value={newEvent.hours}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                hours: e.target.value,
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
                        Edit
                      </button>
                      <button
                        className="modalBtn"
                        onClick={deleteRow}
                        style={{ marginBottom: 15 }}
                      >
                        Delete
                      </button>
                      <button
                        className="modalBtn"
                        onClick={closeModal}
                        style={{ marginBottom: 15 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Modal>

                  {/* table events */}
                  <Modal
                    isOpen={eventModalIsOpen}
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
                        width: "800px",
                        padding: "20px",
                        backgroundColor: "white",
                        height: "80%",
                      },
                    }}
                  >
                    <h2>Table Modal</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Project</th>
                          <th>Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((row) => (
                          <tr key={row._id}>
                            <td>{row.project}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button onClick={closeModal}>Close Modal</button>
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
