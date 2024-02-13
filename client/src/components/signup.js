import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/css/signup.css";
import bg1 from "../assets/images/bg1.jpg";
import logo from "../assets/images/logo.png";
import axios from "axios";

function Signup() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();

  const register = () => {
    setFormSubmitted(true);

    // Form validation logic
    if (id && name && department && position && email && contact && password) {
      axios
        .post("http://localhost:8000/signup", {
          id,
          name,
          department,
          position,
          email,
          contact,
          password,
        })
        .then((res) => {
          if (res.data === "Error saving data to MongoDB and Cloudinary") {
            alert("User Already Exists!");
          } else if (
            res.data === "File and text data saved to MongoDB and Cloudinary"
          ) {
            // After successful upload to MongoDB, reset the form
            alert("Registered Successfully");
            navigate("/login");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className="maincontainer">
        <div className="row h-100">
          <div className="col-6 vh-100">
            <div className="left h-100">
              <div className="containerleft border h-75 ">
                <div className="text-center mt-1">
                  <h1 className="text-success">SIGN UP</h1>
                  <p>Create an account</p>
                </div>
                <div className="d-flex flex-column justify-content-between align-content-between h-75">
                  <div className="col-12 signup-fields">
                    <form class="row g-3">
                      <div class="col-6">
                        <input
                          type="text"
                          class={`form-control mb-2 ${
                            formSubmitted && !id ? "is-invalid" : ""
                          }`}
                          id="id"
                          name="id"
                          placeholder="Employee Id"
                          onChange={(e) => setId(e.target.value)}
                          required
                        />
                        {formSubmitted && !id && (
                          <div className="invalid-feedback">
                            Employee Id is required
                          </div>
                        )}
                      </div>
                      <div class="col-6">
                        <input
                          type="text"
                          class={`form-control mb-2 ${
                            formSubmitted && !name ? "is-invalid" : ""
                          }`}
                          id="name"
                          name="name"
                          placeholder="Name"
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        {formSubmitted && !name && (
                          <div className="invalid-feedback">
                            Name is required
                          </div>
                        )}
                      </div>
                      <div class="col-6">
                        <input
                          type="text"
                          class={`form-control mb-2 ${
                            formSubmitted && !department ? "is-invalid" : ""
                          }`}
                          id="department"
                          name="department"
                          placeholder="Department"
                          onChange={(e) => setDepartment(e.target.value)}
                          required
                        />
                        {formSubmitted && !department && (
                          <div className="invalid-feedback">
                            Department is required
                          </div>
                        )}
                      </div>
                      <div class="col-6">
                        <input
                          type="text"
                          class={`form-control mb-2 ${
                            formSubmitted && !position ? "is-invalid" : ""
                          }`}
                          id="position"
                          name="position"
                          placeholder="Position"
                          onChange={(e) => setPosition(e.target.value)}
                          required
                        />
                        {formSubmitted && !position && (
                          <div className="invalid-feedback">
                            Position is required
                          </div>
                        )}
                      </div>
                      <div class="col-6">
                        <input
                          type="text"
                          class={`form-control mb-2 ${
                            formSubmitted && !contact ? "is-invalid" : ""
                          }`}
                          id="contact"
                          name="contact"
                          placeholder="Contact"
                          onChange={(e) => setContact(e.target.value)}
                          required
                        />
                        {formSubmitted && !contact && (
                          <div className="invalid-feedback">
                            Contact is required
                          </div>
                        )}
                      </div>
                      <div class="col-6">
                        <input
                          type="text"
                          class={`form-control mb-2 ${
                            formSubmitted && !email ? "is-invalid" : ""
                          }`}
                          id="email"
                          name="email"
                          placeholder="Email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        {formSubmitted && !email && (
                          <div className="invalid-feedback">
                            Email is required
                          </div>
                        )}
                      </div>
                      <div class="col-6">
                        <input
                          type="password"
                          class={`form-control ${
                            formSubmitted && !password ? "is-invalid" : ""
                          }`}
                          id="password"
                          name="password"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        {formSubmitted && !password && (
                          <div className="invalid-feedback">
                            Password is required
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="col-12">
                    <div className="row d-flex justify-content-center flex-end">
                      <button
                        type="button"
                        class="btn btn-dark loginbutton mt-4 "
                        onClick={register}
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 vh-100">
            <div className="right h-100">
              <div className="containerright border h-75">
                {/* <img src={bg1} alt="sampleimg" /> */}

                <div className="signup-button d-flex flex-column align-items-center">
                  <img
                    src={logo}
                    alt="logoimg"
                    style={{ width: "100px", height: "auto" }}
                  />
                  <h1 className="text-white">WELCOME</h1>
                  <p className="text-white">
                    Log in now to your existing account
                  </p>
                  <NavLink
                    className="link"
                    to="/login"
                    activeClassName="active"
                  >
                    <button type="button" className="btn btn-dark loginbutton">
                      Login
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
