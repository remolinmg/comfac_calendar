import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import logo from "../assets/images/logo.png";
import { BsPersonCircle } from "react-icons/bs";
import "../assets/css/nav.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    window.localStorage.clear();
    navigate("/login");
  };
  const profile = () => {
    navigate("/profile");
  };
  return (
    <div className="navbar-section">
      <Navbar
        className="d-flex justify-content-between"
        expand="lg"
        bg="light"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <Navbar.Brand href="/" className="mr-auto">
          <img className="nav_logo" src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 d-flex justify-content-between align-items-between">
            <Nav.Link href="/">Calendar</Nav.Link>
            <NavDropdown
              title={
                <>
                  <i className="fas fa-user mx-1"></i> Profile
                </>
              }
              id="basic-nav-dropdown"
              className="dropdown-menu-right"
            >
              <NavDropdown.Item className="me-5" onClick={profile}>
                My account
              </NavDropdown.Item>
              <NavDropdown.Item className="me-5" onClick={handleSignOut}>
                Log out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;
