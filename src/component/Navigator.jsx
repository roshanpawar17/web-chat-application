import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'

function Navigator() {
  // State to manage the visibility of the popup dialog
  const [showPopup, setShowPopup] = useState(false);

  // Event handler for showing the popup dialog
  const handleAdminLoginClick = () => {
    setShowPopup(true);
  };

  return (
    <div className='navigator'>
      <NavLink to={"/userlogin"} className="nav-link">User Login</NavLink>
      {/* <NavLink to={"/adminlogin"} className="nav-link" onClick={handleAdminLoginClick}>Root Admin Login</NavLink> */}
     
    </div>
  )
}

export default Navigator
