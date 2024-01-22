import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
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
  const [newEvent, setNewEvent] = useState({});
  const [selectedRowData, setSelectedRowData] = useState("");
  const [project, setProject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const localizer = momentLocalizer(moment);
  const [data, setData] = useState([]);

  const CustomEvent = ({ event }) => (
    <div>
      <strong> {event.project}</strong>
    </div>
  );

  const CustomDay = ({ date, events, localizer }) => (
    <div>
      <strong>{localizer.format(date, "ddd MM/DD")}</strong>
      <div>
        {events.map((event, index) => (
          <CustomEvent key={index} event={event} />
        ))}
      </div>
    </div>
  );

  const CustomWeek = ({ date, events, localizer }) => (
    <div>
      <strong>{localizer.format(date, "MM/DD")}</strong>
      <div>
        {events.map((event, index) => (
          <CustomEvent key={index} event={event} />
        ))}
      </div>
    </div>
  );

  const openModal = (slotInfo) => {
    setNewEvent({
      start: slotInfo.start,
      end: slotInfo.end,
      timein: "",
      timeout: "",
      company: "",
      project: "",
      name: "",
      department: "",
      fromtime: "",
      totime: "",
      hours: "",
    });
    setModalIsOpen(true);
  };

  const openProjectModal = (slotInfo) => {
    setNewEvent({
      start: slotInfo.start,
      end: slotInfo.end,
      allDay: true,
      project: "",
    });
    setProjectModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditModalIsOpen(false);
    setTableModalIsOpen(false);
    setProjectModalIsOpen(false);
    setNewEvent({});

  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setNewEvent({});
  };

  const today = new Date();

  const customViews = {
    day: CustomDay,
    week: CustomWeek,
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
      const response = await axios.get('http://localhost:8000/get/assignpeople', {
        params: {
          project,
          startTime,
          endTime,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error here, e.g., set an error state
    }
  };

  const tableAssign =  (event) => {
    setProject(event.project);
    setStartTime(event.start);
    setEndTime(event.end);
    setTableModalIsOpen(true);
  };

  useEffect(() => {
    // Call fetchEmployeeData here or perform other actions
    fetchEmployeeData();
  }, [project, startTime, endTime, tableModalIsOpen]);

  //Add data
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

  //Add data
  async function createAssignment(e) {
    if (!newEvent.name || !newEvent.department || !newEvent.project) {
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

  const next = () => {
    createProject();
    setProjectModalIsOpen(false);
    setModalIsOpen(true);
  }

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

  //set option in selectfield
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Fetch data from the database or API endpoint
    fetch("http://localhost:8000/get/people")
      .then((response) => response.json())
      .then((data) => setOptions(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
                    events={events}
                    components={{
                      event: CustomEvent, // Use the custom Event component
                    }}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={tableAssign}
                    style={{
                      position: "relative",
                      height: 300,
                      width: 800,
                      color: "white",
                      zIndex: 200,
                    }}
                    selectable={true}
                    //  onSelectEvent={(event) =>
                    //  navigateToDate(moment(event.start).toDate())
                    // }
                    onSelectSlot={openProjectModal}
                    dayPropGetter={(date) => {
                      if (moment(date).isSame(currentDate, "day")) {
                        return {
                          style: {
                            backgroundColor: "#00BA9D", // Change this to your desired color
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
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
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
                  {/* modal for add employee */}
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
                            value={moment(newEvent.start).format("LL")}
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
                        {data.map((row) => (
                          <tr key={row._id}>
                            <td>{row.name}</td>
                            <td>{row.project}</td>
                            <td>{row.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button onClick={closeModal}>Close Modal</button>
                  </Modal>
                  {/* modal for edit employee */}
                  {/* <Modal
                    isOpen={editModalIsOpen}
                    onRequestClose={closeEditModal}
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
                            value={moment(newEvent.start).format("LL")}
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
                        onClick={closeEditModal}
                        style={{ marginBottom: 15 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Modal> */}
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
