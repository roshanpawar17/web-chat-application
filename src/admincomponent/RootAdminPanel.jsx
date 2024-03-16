import React from 'react'
import { useLocation, Outlet} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import '../css/RootAdminPanel.css'

import RootAdminPanelNavbar from './RootAdminPanelNavbar';

function RootAdminPanel() {
  // const location = useLocation()
  // console.log(location.state.rid)
  // console.log(location.state.remail)
  // console.log(location.state.rpassword)
  // console.log(location.state.rname)
  // console.log(location.state.role)

  const navigate = useNavigate()
  document.title = "TechCorp - Admin"

  function userLogout(){
    alert("Logout successfully!")
    navigate('/login')
    localStorage.removeItem('loginuser');
  }

  return (
    <>
      {/* <h1>I am <i>{location.state.rname}</i> and I am a root admin with my Id <i>{location.state.rid}</i> and email <i>{location.state.remail}</i></h1> */}
      <div className="admin-panel">
        <header>
          <div>
          <span id='sp1'>Tech</span>
          <span id='sp2'>Corp</span>
          </div>
          <button class="btn btn-secondary" onClick={userLogout}>Logout</button>
        </header>
        <div className="main-container">
          <div className="root-navbar">
            <RootAdminPanelNavbar/>
          </div>
          <div className="show-component">
            <Outlet />
          </div>  
        </div>
      </div>
    </>
  )
}

export default RootAdminPanel
