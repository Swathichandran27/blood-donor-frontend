import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTint,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserFriends,
  FaHeart,
  FaHospital,
  FaCalendarAlt,
  FaBell,
  FaMedal,
  FaUser
} from "react-icons/fa";
import { motion } from "framer-motion";
import UrgentRequests from "./UrgentRequest";

import "./Home.css";

const features = [
  {
    icon: <FaTint className="fs-1 text-danger mb-2" />,
    title: "Find Blood Donation Centers",
    description: "Search for donoration Centers by blood group and location instantly.",
  },
  {
    icon: <FaCalendarAlt className="fs-1 text-danger mb-2" />,
    title: "Book Appointments",
    description: "Easily schedule your blood donation at nearby centers.",
  },
  {
    icon: <FaBell className="fs-1 text-danger mb-2" />,
    title: "Urgent Blood Requests",
    description: "Stay updated on urgent blood needs in your city.",
  },
  {
    icon: <FaMedal className="fs-1 text-danger mb-2" />,
    title: "Recognition & Badges",
    description: "Earn rewards and badges for your valuable contributions.",
  },
  {
    icon: <FaUser className="fs-1 text-danger mb-2" />,
    title: "Profile & History",
    description: "View your donation history and track your impact.",
  },
];

const featureCardGradients = [
  "linear-gradient(135deg, #f8d7da 0%, #fff 100%)",
  "linear-gradient(135deg, #ffe5b4 0%, #fff 100%)",
  "linear-gradient(135deg, #d1e7dd 0%, #fff 100%)",
  "linear-gradient(135deg, #cff4fc 0%, #fff 100%)",
  "linear-gradient(135deg, #f3e8ff 0%, #fff 100%)",
];

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ donors: 0, livesSaved: 0, hospitals: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="homepage">
      {/* ✅ Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
  <div className="container">
    <a className="navbar-brand" href="#hero">BloodConnect</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#hero">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#stats">Stats</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#features">Features</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#testimonials">Testimonials</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#about">About</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#contact">Contact</a>
        </li>
      </ul>
    </div>
  </div>
</nav>


      {/* Hero Section */}
      <section id="hero" className="hero d-flex align-items-center text-center text-white">
        <div className="container">
          <h1 className="fw-bold display-4 mb-3">
            Donate Blood, <span className="text-warning">Save Lives</span>
          </h1>
          <p className="lead mb-4">
            A single pint can save three lives. Join our mission today.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-light btn-lg fw-bold"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn btn-warning btn-lg fw-bold"
            >
              Register as Donor
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card shadow border-0 h-100 text-center p-4" style={{ background: "linear-gradient(135deg, #f8d7da 0%, #fff 100%)" }}>
                <div className="mb-3">
                  <FaUserFriends className="fs-1 text-danger" />
                </div>
                <h3 className="fw-bold text-danger">{stats.donors || 20}</h3>
                <p className="mb-0 text-muted">Total Donors</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card shadow border-0 h-100 text-center p-4" style={{ background: "linear-gradient(135deg, #d1e7dd 0%, #fff 100%)" }}>
                <div className="mb-3">
                  <FaHeart className="fs-1 text-success" />
                </div>
                <h3 className="fw-bold text-success">{stats.livesSaved || 1679}</h3>
                <p className="mb-0 text-muted">Lives Saved</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card shadow border-0 h-100 text-center p-4" style={{ background: "linear-gradient(135deg, #cff4fc 0%, #fff 100%)" }}>
                <div className="mb-3">
                  <FaHospital className="fs-1 text-info" />
                </div>
                <h3 className="fw-bold text-info">{stats.hospitals || 589}</h3>
                <p className="mb-0 text-muted">Hospitals Connected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate With Us Section */}
      <section id="features" className="py-5 bg-white">
        <div className="container">
          <h2 className="fw-bold mb-4 text-center text-danger">Why Donate With Us?</h2>
          <div className="row g-4 justify-content-center">
            {features.map((feature, idx) => (
              <motion.div
                className="col-md-4"
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.6, type: "spring" }}
              >
                <div
                  className="card h-100 border-0 shadow text-center p-4"
                  style={{
                    background: featureCardGradients[idx % featureCardGradients.length],
                    transition: "transform 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-10px) scale(1.03)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
                >
                  <div>{feature.icon}</div>
                  <h5 className="fw-bold mt-2">{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">What Our Donors Say</h2>
          <div className="row justify-content-center">
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow p-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Ravi Kumar"
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid #dc3545" }}
                />
                <blockquote className="blockquote mb-2">
                  "An amazing platform. Found an urgent request and helped save a life the same day! The process was smooth and the staff was very supportive."
                </blockquote>
                <footer className="blockquote-footer mt-2">Ravi Kumar</footer>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow p-4">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Priya Sharma"
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid #dc3545" }}
                />
                <blockquote className="blockquote mb-2">
                  "Easy to use and reliable. Every donor should be here. I love tracking my donation history and earning badges!"
                </blockquote>
                <footer className="blockquote-footer mt-2">Priya Sharma</footer>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow p-4">
                <img
                  src="https://randomuser.me/api/portraits/men/65.jpg"
                  alt="Ankit Verma"
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid #dc3545" }}
                />
                <blockquote className="blockquote mb-2">
                  "Makes me feel proud to be a regular donor. The recognition and support from the team keeps me motivated to donate again and again."
                </blockquote>
                <footer className="blockquote-footer mt-2">Ankit Verma</footer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-5 bg-light">
        <div className="container">
          <h2 className="mb-4 text-center fw-bold text-danger">
            About Us
            <div
              style={{
                width: "80px",
                height: "4px",
                backgroundColor: "#dc3545",
                margin: "8px auto",
                borderRadius: "2px"
              }}
            ></div>
          </h2>
          <p className="lead text-center mx-auto" style={{ maxWidth: "800px" }}>
            <span className="fw-bold text-danger">BloodConnect</span> bridges the gap between donors and those in need.
            Whether you're a regular donor or giving for the first time, we make it simple to find urgent requests,
            schedule appointments, and be recognized for your life-saving contributions.
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-5 bg-danger text-white">
        <div className="container">
          <h2 className="mb-4 text-center fw-bold">Contact Us</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <FaPhoneAlt className="fs-3 mb-2" />
              <p>+91 98765 43210</p>
            </div>
            <div className="col-md-4 mb-3">
              <FaEnvelope className="fs-3 mb-2" />
              <p>support@bloodconnect.com</p>
            </div>
            <div className="col-md-4 mb-3">
              <FaMapMarkerAlt className="fs-3 mb-2" />
              <p>Bangalore, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-3 bg-dark text-white text-center">
        <small>
          © {new Date().getFullYear()} BloodConnect. All rights reserved.
        </small>
      </footer>
    </div>
  );
};

export default HomePage;
