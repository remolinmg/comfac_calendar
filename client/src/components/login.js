import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/css/login.css";
import bg1 from "../assets/images/bg1.jpg";
import cornersteel_fullpng from "../assets/images/cornersteel_fullpng.png";
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();

  async function log(e) {
    e.preventDefault();
    setFormSubmitted(true);

    // Form validation logic
    if (email && password) {
      try {
        const response = await axios.post("http://localhost:8000/login", {
          email,
          password
        });

        if (response.status === 201) {
          window.localStorage.setItem('email', response.data.email);
          window.localStorage.setItem('id', response.data.id);
          alert("Welcome")
          navigate("/");
        } else {
          alert("Login Failed")
        }
      } catch (error) {
        alert("Login Failed")
      }
    }
  }


  return (
    <>
      <div className="maincontainer">
        <div className="row">
          <div className="col-6">
            <div className="left">
              <div className="containerleft border">
                <div className="leftimg  d-flex justify-content-center">
                  <img src={cornersteel_fullpng} alt="sampleimg" />
                </div>
                <form>
                  <div className={`mb-3 ${formSubmitted && !email ? 'has-error' : ''}`}>
                    <input
                      type="email"
                      className={`form-control ${formSubmitted && !email ? 'is-invalid' : ''}`}
                      placeholder="Email"
                      id="email"
                      name="email"
                      aria-describedby="emailHelp"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {formSubmitted && !email && <div className="invalid-feedback">Email is required</div>}
                  </div>
                  <div className={`mb-3 ${formSubmitted && !password ? 'has-error' : ''}`}>
                    <input
                      type="password"
                      className={`form-control ${formSubmitted && !password ? 'is-invalid' : ''}`}
                      placeholder="Password"
                      id="password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {formSubmitted && !password && <div className="invalid-feedback">Password is required</div>}
                  </div>
                  <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-dark loginbutton mt-4" onClick={log}>
                      Login
                    </button>
                  </div>
                </form>
              </div >
            </div>
          </div>
          <div className="col-6">
            <div className="right">
              <div className="containerright border">
                <img src={bg1} alt="sampleimg" />

                <div className="signup-button d-flex flex-column align-items-center">
                  <h1 className="text-white">WELCOME</h1>
                  <p className="text-white">Sign up now and enter your details</p>
                  <NavLink className="link" to="/signup" activeClassName="active">
                    <button type="button" className="btn btn-dark loginbutton">
                      Sign up
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

export default Login;
