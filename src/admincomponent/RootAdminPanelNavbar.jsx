import React from 'react'
import { NavLink} from 'react-router-dom'
import { AiFillHome } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

function RootAdminPanelNavbar() {
  return (
    // <div className='root-admin-panel-navbar'>
      <aside className='side-navbar-container'>
            <div id='chat-name'>TechConnect</div>
            <div className="nav-link-list">
              <ul>
                <li>
                  <NavLink to={"/rootadminpanel/dashboard"}>
                    <AiFillHome />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/rootadminpanel/users"}>
                    <FaUserAlt />
                    <span>Employee</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/rootadminpanel/groups"}>
                    <HiUserGroup />
                    <span>Groups</span>
                  </NavLink>
                </li>
              </ul>
            </div>
        </aside>
    // </div>
  )
}

export default RootAdminPanelNavbar
