import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/css/sidebar.css";

function Sidebar() {
  return (
    <div className="d-flex sidebar-container" id="wrapper">
      <div className="border-right sidebar w-100">
        <ul className="list-unstyled">
          <li>
            <a href="#" className="sidebar-item text-light active">
              <h2>Comfac</h2>
              <div className="sidebar1">
                <ul className="custom-list">
                  <NavLink className="link" to="/" activeClassName="active">
                    <li>Scheduler</li>
                  </NavLink>
                  <NavLink className="link" to="/people" activeClassName="active">
                    <li>People</li>
                  </NavLink>
                  <NavLink className="link" to="/user" activeClassName="active">
                    <li>Users</li>
                  </NavLink>
                </ul>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
