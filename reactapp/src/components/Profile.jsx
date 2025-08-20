import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaHeart,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaTint, // Using FaTint instead of GiBloodDrop
  FaMapMarkerAlt,
  FaGift,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarCheck,
  FaHistory,
  FaAward
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import Sidebar from "./Sidebar";
import authService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Profile.module.css";
import axios from "axios";

import { useState,useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const storedUser = authService.getUserData();
  const userId = storedUser?.id;

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`https://blood-donor-backend-cibk.onrender.com/api/users/${userId}`, {
        headers: authService.getAuthHeaders(),
      })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        if (err.response?.status === 401) {
          authService.removeToken();
          navigate("/login");
        }
      });
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios
      .put(`https://blood-donor-backend-cibk.onrender.com/api/users/${userId}`, formData, {
        headers: authService.getAuthHeaders(),
      })
      .then((res) => {
        setUser(res.data);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        if (err.response?.status === 401) {
          authService.removeToken();
          navigate("/login");
        }
      });
  };

  if (!userId)
    return (
      <div className="container mt-4">
        <p>No user logged in.</p>
      </div>
    );
  if (!user)
    return (
      <div className="container mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`container-fluid g-0 ${styles.container}`}>
      <div className="row g-0">
        <div className="col-md-2">
          <Sidebar />
        </div>

        <div className="col-md-10 p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="card shadow-lg p-4"
            style={{ borderRadius: "15px", background: "#ffffff" }}
          >
            {/* Profile Header */}
            <motion.div variants={itemVariants} className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <div className={styles.profileAvatar}>
                  <FaHeart size={40} className="text-danger" />
                </div>
                <div className={styles.pulseEffect}></div>
              </div>
              <h2 className="fw-bold mt-3" style={{ color: '#d62d1a' }}>Donor Profile</h2>
              <p className="text-muted">Your contribution saves lives!</p>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div variants={itemVariants} className="mb-4">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                    style={activeTab === "profile" ? { 
                      backgroundColor: '#f8d7da', 
                      color: '#d62d1a',
                      borderColor: '#f1aeb5'
                    } : {}}
                    onClick={() => setActiveTab("profile")}
                  >
                    <FaUser className="me-1" /> Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "donations" ? "active" : ""}`}
                    style={activeTab === "donations" ? { 
                      backgroundColor: '#f8d7da', 
                      color: '#d62d1a',
                      borderColor: '#f1aeb5'
                    } : {}}
                    onClick={() => setActiveTab("donations")}
                  >
                    <FaTint className="me-1" /> Donations
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "achievements" ? "active" : ""}`}
                    style={activeTab === "achievements" ? { 
                      backgroundColor: '#f8d7da', 
                      color: '#d62d1a',
                      borderColor: '#f1aeb5'
                    } : {}}
                    onClick={() => setActiveTab("achievements")}
                  >
                    <FaAward className="me-1" / > Achievements
                  </button>
                </li>
              </ul>
            </motion.div>

            {/* Stats Panel - Updated Colors */}
            <motion.div variants={itemVariants} className="row g-3 mb-4">
              <div className="col-md-3">
                <div className={`${styles.statCard}`} style={{ 
                  borderLeft: '4px solid #6f42c1',
                  backgroundColor: '#f3e8ff'
                }}>
                  <div className="stat-icon-circle" style={{ backgroundColor: '#e9d8fd' }}>
                    <FaUser style={{ color: '#6f42c1' }} />
                  </div>
                  <h6 className="mt-2">Donor ID</h6>
                  <span className={styles.statValue} style={{ color: '#6f42c1' }}>
                    {user.donorId || user.id}
                  </span>
                </div>
              </div>

              <div className="col-md-3">
                <div className={`${styles.statCard}`} style={{ 
                  borderLeft: '4px solid #d62d1a',
                  backgroundColor: '#f8d7da'
                }}>
                  <div className="stat-icon-circle" style={{ backgroundColor: '#f5c2c7' }}>
                    <FaTint style={{ color: '#d62d1a' }} />
                  </div>
                  <h6 className="mt-2">Total Donations</h6>
                  <span className={styles.statValue} style={{ color: '#d62d1a' }}>
                    {user.totalDonations || 0}
                  </span>
                </div>
              </div>

              <div className="col-md-3">
                <div className={`${styles.statCard}`} style={{ 
                  borderLeft: '4px solid #fd7e14',
                  backgroundColor: '#fff3cd'
                }}>
                  <div className="stat-icon-circle" style={{ backgroundColor: '#ffecb5' }}>
                    <FaGift style={{ color: '#fd7e14' }} />
                  </div>
                  <h6 className="mt-2">Referral Points</h6>
                  <span className={styles.statValue} style={{ color: '#fd7e14' }}>
                    {user.referralPoints || 0}
                  </span>
                </div>
              </div>

              <div className="col-md-3">
                <div className={`${styles.statCard}`} style={{ 
                  borderLeft: '4px solid #20c997',
                  backgroundColor: '#d1fae5'
                }}>
                  <div className="stat-icon-circle" style={{ backgroundColor: '#b2f2bb' }}>
                    <MdHealthAndSafety style={{ color: '#20c997' }} />
                  </div>
                  <h6 className="mt-2">Blood Group</h6>
                  <span className={styles.statValue} style={{ color: '#20c997' }}>
                    {user.bloodGroup || "-"}
                  </span>
                </div>
              </div>
            </motion.div>
            {/* Profile Content */}
            {activeTab === "profile" && (
              <motion.div variants={itemVariants}>
                {isEditing ? (
                  <form className={styles.profileForm}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          <FaUser className="me-2 text-primary" /> Full Name
                        </label>
                        <input
                          className="form-control"
                          name="fullName"
                          value={formData.fullName || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          <FaEnvelope className="me-2 text-primary" /> Email
                        </label>
                        <input
                          className="form-control"
                          name="email"
                          value={formData.email || ""}
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          <FaBirthdayCake className="me-2 text-primary" /> Date of Birth
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfBirth"
                          value={formData.dateOfBirth || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          <FaTint className="me-2 text-danger" /> Blood Group
                        </label>
                        <select
                          className="form-select"
                          name="bloodGroup"
                          value={formData.bloodGroup || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          <FaMapMarkerAlt className="me-2 text-primary" /> Address
                        </label>
                        <input
                          className="form-control"
                          name="address"
                          value={formData.address || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          <FaPhone className="me-2 text-primary" /> Phone Number
                        </label>
                        <input
                          className="form-control"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className={`${styles.btnSuccess} btn me-2 px-4`}
                        onClick={handleSave}
                      >
                        <FaSave className="me-2" /> Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4"
                        onClick={() => setIsEditing(false)}
                      >
                        <FaTimes className="me-2" /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <div className={`${styles.infoCard} p-4`}>
                        <h5 className="fw-bold mb-4" style={{ color: '#d62d1a' }}>
                          <FaUser className="me-2" style={{ color: '#d36a5eff' }}/> Personal Information
                        </h5>
                        <div className="d-flex align-items-center mb-3">
                          <div className={styles.infoIcon}>
                            <FaUser />
                          </div>
                          <div>
                            <p className="mb-0 text-muted small">Full Name</p>
                            <p className="fw-bold">{user.fullName}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className={styles.infoIcon}>
                            <FaEnvelope />
                          </div>
                          <div>
                            <p className="mb-0 text-muted small">Email</p>
                            <p className="fw-bold">{user.email}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className={styles.infoIcon}>
                            <FaBirthdayCake />
                          </div>
                          <div>
                            <p className="mb-0 text-muted small">Date of Birth</p>
                            <p className="fw-bold">{user.dateOfBirth || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className={`${styles.infoCard} p-4`}>
                        <h5 className="fw-bold mb-4 " style={{ color: '#d36a5eff' }}>
                          <MdHealthAndSafety className="me-3" style={{ color: '#d36a5eff' }} /> Health Information
                        </h5>
                        <div className="d-flex align-items-center mb-3">
                          <div className={`${styles.infoIcon} ${styles.bloodIcon}`}>
                            <FaTint />
                          </div>
                          <div>
                            <p className="mb-0 text-muted small">Blood Group</p>
                            <p className="fw-bold">{user.bloodGroup || "-"}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className={styles.infoIcon}>
                            <FaMapMarkerAlt />
                          </div>
                          <div>
                            <p className="mb-0 text-muted small">Address</p>
                            <p className="fw-bold">{user.address || "-"}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className={styles.infoIcon}>
                            <FaPhone />
                          </div>
                          <div>
                            <p className="mb-0 text-muted small">Phone Number</p>
                            <p className="fw-bold">{user.phone || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <button
                        className={`${styles.btnPrimary} btn btn-lg px-5`}
                        onClick={() => setIsEditing(true)}
                        style={{ color: '#d36a5eff', backgroundColor:'#f8d7da' }}
                      >
                        <FaEdit className="me-2" /> Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "donations" && (
              <motion.div variants={itemVariants} className="text-center py-5">
                <div className="alert alert-info" >
                  <h4><FaHistory className="me-2" /> Donation History</h4>
                  <p>Your donation records will appear here</p>
                </div>
              </motion.div>
            )}

            {activeTab === "achievements" && (
              <motion.div variants={itemVariants} className="text-center py-5">
                <div className="alert alert-warning">
                  <h4><FaAward className="me-2" /> Achievements</h4>
                  <p>Your badges and achievements will appear here</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;