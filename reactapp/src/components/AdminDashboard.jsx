import React, { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import {
  FaChartBar,
  FaCalendarAlt,
  FaBell,
  FaUserFriends,
  FaHospitalAlt,
  FaTint,
  FaFolderOpen
} from "react-icons/fa";

import AdminAnalytics from "./AdminAnalytics";
import AdminAppointments from "./AdminAppointments";
import AdminUrgentRequest from "./AdminUrgrenRequest";
import AdminUsers from "./AdminUsers";
import AdminResources from "./AdminResources";
import AdminDonationcenters from "./AdminDonationcenters";
import AdminDonationcamp from "./AdminDonationcamp";
import AdminChat from "./AdminChat";
import { BsChatDotsFill } from "react-icons/bs";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("analytics");

  const renderPage = () => {
    switch (activePage) {
      case "analytics":
        return <AdminAnalytics />;
      case "appointments":
        return <AdminAppointments />;
      case "urgent":
        return <AdminUrgentRequest />;
      case "donors":
        return <AdminUsers />;
      case "resources":
        return <AdminResources />;
      case "donationCenters":
        return <AdminDonationcenters />;
      case "donationCamp":
        return <AdminDonationcamp />;
      case "chat":
        return <AdminChat/>
      default:
        return <AdminAnalytics />;
    }
  };

  const navItemStyle = (page) => ({
    color: "#fff",
    backgroundColor: activePage === page ? "#dc3545" : "transparent",
    padding: "10px 15px",
    borderRadius: "6px",
    marginBottom: "10px",
    fontWeight: activePage === page ? "bold" : "normal",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  });

  const iconStyle = { marginRight: "10px" };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          xs={12}
          md={2}
          className="bg-dark text-white p-3"
          style={{ minHeight: "100vh" }}
        >
          <h5 className="text-center mb-4 fw-bold">Admin Panel</h5>
          <Nav className="flex-column">
            <div style={navItemStyle("analytics")} onClick={() => setActivePage("analytics")}>
              <FaChartBar style={iconStyle} /> Analytics
            </div>
            <div style={navItemStyle("appointments")} onClick={() => setActivePage("appointments")}>
              <FaCalendarAlt style={iconStyle} /> Appointments
            </div>
            <div style={navItemStyle("urgent")} onClick={() => setActivePage("urgent")}>
              <FaBell style={iconStyle} /> Urgent Requests
            </div>
            <div style={navItemStyle("donors")} onClick={() => setActivePage("donors")}>
              <FaUserFriends style={iconStyle} /> Donors
            </div>
            <div style={navItemStyle("donationCenters")} onClick={() => setActivePage("donationCenters")}>
              <FaHospitalAlt style={iconStyle} /> Donation Centers
            </div>
            <div style={navItemStyle("donationCamp")} onClick={() => setActivePage("donationCamp")}>
              <FaTint style={iconStyle} /> Donation Camps
            </div>
            <div style={navItemStyle("resources")} onClick={() => setActivePage("resources")}>
              <FaFolderOpen style={iconStyle} /> Resources
            </div>
            <div style={navItemStyle("chat")} onClick={() => setActivePage("chat")}>
             <BsChatDotsFill style={iconStyle}/> 
             Chat
            </div>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col xs={12} md={10} className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          {renderPage()}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
