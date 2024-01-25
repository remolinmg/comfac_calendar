import React, { useState, useEffect } from "react";
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
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [tableModalIsOpen, setTableModalIsOpen] = useState(false);
  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [selectedRowData, setSelectedRowData] = useState("");
  const [project, setProject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const localizer = momentLocalizer(moment);
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  //Display Project Name in the Calendar
  const CustomEvent = ({ event }) => (
    <div>
      <strong> {event.Project}</strong>
    </div>
  );

  // Asssign Modal
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

  //Project Modal
  const openProjectModal = (slotInfo) => {
    setNewEvent({
      start: slotInfo.start,
      end: slotInfo.end,
      From_Time: "",
      To_Time: "",
      allDay: true,
      Project: "",
      Project_Name: "",
    });
    setProjectModalIsOpen(true);
    setSelectedDate(slotInfo.start);
  };

  //Close all modals
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

  //Add Assign Data
  async function createAssignment(e) {
    if (!newEvent.Employee || !newEvent.Department || !newEvent.Project) {
      alert("Please fill in all required fields.");
      return;
    } else {
      e.preventDefault();
      try {
        const response = await axios.post(
          "http://localhost:8000/add/assign",
          newEvent
        );

        if (response.status === 201) {
          alert("Assigned successfully");
          fetchData();
        } else {
          alert("Assignment failed");
        }
      } catch (error) {
        alert("Error");
      }
    }
  }

  //Project to Assign
  const next = () => {
    createProject();
    setProjectModalIsOpen(false);
    openModal();
  };

  // Search Function
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

  //Edit Modal
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
  };

  const toTimeFormatter = (e) => {
    const formattedTime = convertTo12HourFormat(e.target.value);
    setNewEvent({
      ...newEvent,
      To_Time: format(selectedDate, "MMMM dd, yyyy") + " " + formattedTime,
    });
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
                      <h2>Assign People</h2>
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
                        <div className="col-12">
                          <TextField
                            id="projectname"
                            className="textfield"
                            label="Project Name"
                            variant="outlined"
                            style={{ paddingBottom: 15, width: "100%" }}
                            value={newEvent.Project_Name}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Project_Name: e.target.value,
                              })
                            }
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
                            // value={newEvent.From_Time}
                            onChange={fromTimeFormatter}
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
                            // value={newEvent.To_Time}
                            onChange={toTimeFormatter}
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
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Company: e.target.value,
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
                            style={{
                              paddingBottom: 15,
                              width: "100%",
                              height: "55px",
                              margin: "0",
                            }}
                            value={newEvent.Employee}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Employee: e.target.value,
                              })
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
                            value={newEvent.Department}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                Department: e.target.value,
                              })
                            }
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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "800px",
                        padding: "20px",
                        backgroundColor: "white",
                        height: "80%",
                      },
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <h2>Employee List for Project</h2>

                      <button
                        type="button"
                        onClick={closeModal}
                        className="btn btn-outline-danger btn-sm h-25"
                      >
                        X
                      </button>
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
                            <tr key={row._id}>
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
