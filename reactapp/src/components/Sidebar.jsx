import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BsHouseFill, 
  BsBuilding, 
  BsCalendarCheck, 
  BsExclamationTriangleFill, 
  BsAwardFill, 
  BsBookFill, 
  BsPersonFill, 
  BsChatDotsFill,
  BsDropletFill,
  BsBoxArrowRight
} from "react-icons/bs";
import AuthService from "../services/AuthService";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userData = AuthService.getUserData();
  const username = userData?.fullName || "Guest"; 
  const donorStatus = userData?.role || "Donor"; 

  const menuItems = [
    { path: "/donor/dashboard", icon: <BsHouseFill />, label: "Dashboard" },
    { path: "/donationcenter", icon: <BsBuilding />, label: "Donation Centers" }, 
    { path: "/manage-appointments", icon: <BsCalendarCheck />, label: "Appointments" },
    { path: "/UrgentRequest", icon: <BsExclamationTriangleFill />, label: "Urgent Requests" },
    { path: "/badges", icon: <BsAwardFill />, label: "My Badges" },
    { path: "/resources", icon: <BsBookFill />, label: "Resources" },
    { path: "/profile", icon: <BsPersonFill />, label: "Profile" },
    { path: "/chatwithcenter", icon: <BsChatDotsFill />, label: "Help" }
  ];

  const handleLogout = async () => {
    await AuthService.logout();
    navigate("/");
  };

  return (
    <div className="sidebar expanded">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon"><BsDropletFill /></span>
          <span className="brand-text">BloodConnect</span>
        </div>
      </div>
      
      {/* Menu */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="user-status">{donorStatus}</div>
          </div>
        </div>

        <button 
          className="logout-btn"
          onClick={handleLogout}
        >
          <span className="logout-icon"><BsBoxArrowRight /></span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
