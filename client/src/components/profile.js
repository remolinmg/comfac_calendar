import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/profile.css";
import logo from "../assets/images/logo.png";
import axios from "axios";
import NavBar from "../components/navbar";
import { BsPersonCircle } from "react-icons/bs";

function Profile() {
  const navigate = useNavigate();
  const [newId, setNewId] = useState("");
  const [data, setData] = useState([]);
  const [name, setNewName] = useState("");
  const [department, setNewDepartment] = useState("");
  const [position, setNewPosition] = useState("");
  const [email, setNewEmail] = useState("");
  const [contact, setNewContact] = useState("");

  // DATA FETCHING
  useEffect(() => {
    fetchData(); // Fetch initial data when the component mounts
  }, []);

  const fetchData = async () => {
    try {
      const _id = localStorage.getItem("id");
      const response = await axios.get(
        `http://localhost:8000/get/userprofile/${_id}`
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFocus = (event) => {
    // Select all text in the input field
    event.target.select();
  };

  const updateProfile = async () => {
    const _id = localStorage.getItem("id");
    try {
      const response = await axios.put(
        `http://localhost:8000/update/user/${_id}`,
        { name, department, position, email, contact }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const showEditFormHandler = (rowData) => {
    // setEditFirstName(rowData.firstName)
    setNewName(rowData.name);
    setNewDepartment(rowData.department);
    setNewPosition(rowData.position);
    setNewEmail(rowData.email);
    setNewContact(rowData.contact);
  };
  useEffect(() => {
    // Check if data is available and not an empty array
    if (Array.isArray(data) && data.length > 0) {
      // Call showEditFormHandler with the first item in the data array
      showEditFormHandler(data[0]);
    }
  }, [data]); // Run when data prop changes

  return (
    <>
      {Array.isArray(data) ? (
        data.map((item, index) => (
          <div key={index}>
            <NavBar />
            <div class="profilemaincontainer">
              <div className="toptext">
                <h1> Welcome back, You!</h1>
              </div>
              <div class="profilepic">
                <BsPersonCircle />
              </div>
              <div className="profilecontainer">
                <div class="line-container">
                  <div class="profile-text">Profile</div>
                  <div class="line"></div>
                </div>
                <form class="row g-3">
                  <div class="col-md-6">
                    <label for="inputEmail4" class="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      onChange={(e) => setNewName(e.target.value)}
                      onFocus={handleFocus}
                      value={name}
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="inputPassword4" class="form-label">
                      Department
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="department"
                      onChange={(e) => setNewDepartment(e.target.value)}
                      onFocus={handleFocus}
                      value={department}
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="inputEmail4" class="form-label">
                      Position
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="position"
                      onChange={(e) => setNewPosition(e.target.value)}
                      onFocus={handleFocus}
                      value={position}
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="inputPassword4" class="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      onChange={(e) => setNewEmail(e.target.value)}
                      onFocus={handleFocus}
                      value={email}
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="inputEmail4" class="form-label">
                      Contact
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="contact"
                      onChange={(e) => setNewContact(e.target.value)}
                      onFocus={handleFocus}
                      value={contact}
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <button
                      type="button"
                      className="btn btn-outline-success profilesavebtn"
                      onClick={updateProfile}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No data to display.</p>
      )}
    </>
  );
}

export default Profile;
