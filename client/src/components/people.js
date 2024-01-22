import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import "../assets/css/people.css";
import NavBar from "../components/navbar";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { TextField } from "@mui/material";
import { BsSearch } from "react-icons/bs";

const People = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  const [formErrors, setFormErrors] = useState({
    id: "",
    name: "",
    department: "",
    position: "",
    contact: "",
    email: "",
    password: "",
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get/people");
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // -----------table popup
  // Function to handle the click on a table row
  const handleTableRowClick = (rowData) => {
    setSelectedRow(rowData);
    openDetailsModal();
  };

  const openDetailsModal = () => {
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
  };

  const register = () => {
    const errors = {};
    let isValid = true;

    if (!id) {
      errors.id = "Employee Id is required";
      isValid = false;
    }

    if (!name) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!department) {
      errors.department = "Department is required";
      isValid = false;
    }

    if (!position) {
      errors.position = "Position is required";
      isValid = false;
    }

    if (!contact) {
      errors.contact = "Contact is required";
      isValid = false;
    }

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    }

    setFormErrors(errors);

    if (isValid) {
      axios
        .post("http://localhost:8000/signuppeople", {
          id,
          name,
          department,
          position,
          email,
          contact,
        })
        .then((res) => {
          if (res.data === "Error saving data to MongoDB and Cloudinary") {
            alert("User Already Exists!");
          } else if (
            res.data === "File and text data saved to MongoDB and Cloudinary"
          ) {
            alert("Added Successfully");
            fetchData();
            closeModal();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="peoplemain p-0 max-vh-100 max-vw-100">
      <NavBar />
      <div className="max-vh-100 max-vw-100">
        <div className="row p-0 m-0">
          <div className="col-2 p-0">
            <Sidebar />
          </div>
          <div className="peopletablehead col-10 vh-100">
            <div className="Tablelistpeople"> List of Employee</div>
            <div className="tabletoppeople d-flex justify-content-between mb-1">
              <div className="searchpeople input-group">
                <div className="search-icon">
                  <BsSearch />
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btnpeopleadd btn btn-success"
                onClick={openModal}
              >
                Add
              </button>
            </div>
            <div className="table-container-people h-75">
              <table className="tablepeople">
                <thead className="theadpeople">
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody className="tbodypeople">
                  {data
                    .filter((val) =>
                      Object.values(val).some(
                        (item) =>
                          item &&
                          item
                            .toString()
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      )
                    )
                    .map((val) => (
                      <tr
                        key={val._id}
                        onClick={() => handleTableRowClick(val)}
                      >
                        <td>{val.name}</td>
                        <td>{val.department}</td>
                        <td>{val.position}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
          },
          content: {
            width: "700px",
            height: "450px",
            margin: "auto",
            zIndex: 100,
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between">
            <h2>Add Employee</h2>
            <button
              type="submit"
              onClick={closeModal}
              className="btn btn-danger"
            >
              Close
            </button>
          </div>
          <form className="row g-3">
            <div className="col-12">
              <label htmlFor="id" className="form-label">
                Employee Id
              </label>
              <input
                type="text"
                className={`form-control ${formErrors.id ? "is-invalid" : ""}`}
                id="id"
                onChange={(e) => setId(e.target.value)}
              />
              {formErrors.id && (
                <div className="invalid-feedback">{formErrors.id}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.name ? "is-invalid" : ""
                }`}
                id="name"
                onChange={(e) => setName(e.target.value)}
              />
              {formErrors.name && (
                <div className="invalid-feedback">{formErrors.name}</div>
              )}
            </div>
            <div className="col-6">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.department ? "is-invalid" : ""
                }`}
                id="department"
                onChange={(e) => setDepartment(e.target.value)}
              />
              {formErrors.department && (
                <div className="invalid-feedback">{formErrors.department}</div>
              )}
            </div>
            <div className="col-6">
              <label htmlFor="position" className="form-label">
                Position
              </label>
              <input
                type="position"
                className={`form-control ${
                  formErrors.position ? "is-invalid" : ""
                }`}
                id="position"
                onChange={(e) => setPosition(e.target.value)}
              />
              {formErrors.position && (
                <div className="invalid-feedback">{formErrors.position}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="contact" className="form-label">
                Contact
              </label>
              <input
                type="contact"
                className={`form-control ${
                  formErrors.contact ? "is-invalid" : ""
                }`}
                id="contact"
                onChange={(e) => setContact(e.target.value)}
              />
              {formErrors.contact && (
                <div className="invalid-feedback">{formErrors.contact}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${
                  formErrors.email ? "is-invalid" : ""
                }`}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {formErrors.email && (
                <div className="invalid-feedback">{formErrors.email}</div>
              )}
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-success"
                onClick={register}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {/* New modal for displaying details */}
      <Modal
        isOpen={isDetailsModalOpen}
        onRequestClose={closeDetailsModal}
        // Adjust the styles as needed for the details modal
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
          },
          content: {
            width: "500px",
            height: "450px",
            margin: "auto",
            paddingTop: "20px",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-center">
            <h2>Employee Details</h2>
          </div>
          {/* Display details in this section based on the selectedRow */}
          {selectedRow && (
            <div>
              <TextField
                id="name"
                className="textfield"
                label="Name"
                variant="outlined"
                value={selectedRow.name}
                style={{ paddingBottom: 15, width: "100%" }}
                readonly
              />
              <TextField
                id="department"
                className="textfield"
                label="Department"
                variant="outlined"
                value={selectedRow.department}
                style={{ paddingBottom: 15, width: "100%" }}
                readonly
              />
              <TextField
                id="position"
                className="textfield"
                label="Position"
                variant="outlined"
                value={selectedRow.position}
                style={{ paddingBottom: 15, width: "100%" }}
                readonly
              />
              <TextField
                id="contact"
                className="textfield"
                label="Contact"
                variant="outlined"
                value={selectedRow.contact}
                style={{ paddingBottom: 15, width: "100%" }}
                readonly
              />
              <TextField
                id="email"
                className="textfield"
                label="Email"
                variant="outlined"
                value={selectedRow.email}
                style={{ paddingBottom: 15, width: "100%" }}
                readonly
              />
              <div className="btnPeopleContainer">
                <button
                  type="button"
                  onClick={closeDetailsModal}
                  className="btn btn-danger w-100"
                >
                  Close
                </button>
              </div>
              {/* <p>Name: {selectedRow.name}</p>
              <p>Department: {selectedRow.department}</p>
              <p>Position: {selectedRow.position}</p>
              <p>Contact: {selectedRow.contact}</p>
              <p>Email: {selectedRow.email}</p> */}
              {/* Add other details as needed */}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default People;
