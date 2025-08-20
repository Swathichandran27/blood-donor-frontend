import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import ApiService from "../services/ApiService";
import AuthService from "../services/AuthService";

import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


const DonorDashboard = () => {
  const [nextAppointment, setNextAppointment] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [badgeData, setBadgeData] = useState(null);
  const [upcomingCampaigns, setUpcomingCampaigns] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [healthStats, setHealthStats] = useState(null);
  const [bloodStock, setBloodStock] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
  const fetchBloodStock = async () => {
    try {
      const response = await ApiService.authenticatedRequest('/bloodstock/status/by-city?city=Chennai');
      const stockData = await response.json();
      setBloodStock(stockData);
    } catch (error) {
      console.error("Error fetching blood stock:", error);
    }
  };

  fetchBloodStock();
}, []);


  useEffect(() => {
  const fetchData = async () => {
    try {
      const storedUser = AuthService.getUserData();
      if (!storedUser?.id) {
        window.location.href = "/login";
        return;
      }

      // Next appointment
      try {
        const appointmentRes = await ApiService.authenticatedRequest(`/appointments/upcoming/${storedUser.id}`);
        const appointmentData = await appointmentRes.json();
        setNextAppointment(appointmentData[0] || null);
      } catch (err) {
        console.warn("No upcoming appointment:", err);
        setNextAppointment(null);
      }

      // Fetch past appointments for health stats
      try {
        const pastRes = await ApiService.authenticatedRequest(`/appointments/history/${storedUser.id}`);
        const pastData = await pastRes.json();
        const completedAppointments = pastData.filter(app => app.status === "Completed");
        if (completedAppointments.length > 0) {
          // Take the latest completed appointment
          const latestCompleted = completedAppointments[completedAppointments.length - 1];
          const healthRes = await ApiService.authenticatedRequest(`/healthstats/${latestCompleted.id}`);
          const healthData = await healthRes.json();
          setHealthStats(healthData || null);
        }
      } catch (err) {
        console.warn("No health stats available from completed appointments:", err);
        setHealthStats(null);
      }

      // Badges
      try {
        const badgeRes = await ApiService.authenticatedRequest(`/gamification/${storedUser.id}`);
        const badgeData = await badgeRes.json();
        setBadgeData(badgeData);
      } catch (err) {
        console.warn("No badges available:", err);
        setBadgeData(null);
      }

      // Upcoming campaigns
      try {
        const campaignRes = await ApiService.authenticatedRequest('/donationCamps/upcoming');
        const campaignData = await campaignRes.json();
        setUpcomingCampaigns(campaignData);
      } catch (err) {
        console.warn("No upcoming campaigns:", err);
        setUpcomingCampaigns([]);
      }

      // Urgent requests
      try {
        const urgentRes = await ApiService.authenticatedRequest('/urgent-requests/all');
        const urgentData = await urgentRes.json();
        setUrgentRequests(urgentData);
      } catch (err) {
        console.warn("No urgent requests:", err);
        setUrgentRequests([]);
      }

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  fetchData();
}, []);



  useEffect(() => {
    if (!nextAppointment) return;

    const calculateCountdown = () => {
      console.log("next appointment",nextAppointment);
      const target = new Date(`${nextAppointment.appointmentDate} ${nextAppointment.appointmentTime}`);
      const now = new Date();
      const diff = target - now;
      console.log(nextAppointment.appointmentDate,nextAppointment.appointmentTime);
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        setCountdown(`${days}d ${hours}h ${mins}m`);
      } else {
        setCountdown("Today’s the day!");
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 60000);
    return () => clearInterval(timer);
  }, [nextAppointment]);

  return (
    <div className="container-fluid g-0 donor-dashboard">
  <div className="row g-0">
    {/* Sidebar */}
    <div className="col-md-2">
      <Sidebar />
    </div>

    {/* Main Content */}
    <div className="col-md-10 p-4">
      {/* Top Row - Three Main Cards */}
      <div className="row g-4 mb-4">
        
        {/* Next Appointment Card */}
        <div className="col-lg-4">
          <motion.div 
            className="card h-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body text-center">
              <h5 className="card-title appointment">
                Next Appointment
              </h5>
              {nextAppointment ? (
                <>
                  <div className="fw-bold text-primary mb-3">{countdown || 'No Upcoming'}</div>
                  {nextAppointment ? (
                    <>
                      <p className="mb-2"><strong>{nextAppointment.appointmentDate}</strong> at <strong>{nextAppointment.appointmentTime}</strong></p>
                      <p className="text-muted mb-3">{nextAppointment.location}</p>
                      <span className="badge bg-success">Confirmed</span>
                    </>
                  ) : (
                    <>
                      <p className="text-muted">Schedule your next donation</p>
                       
                    <button 
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate("/eligibility")}>
                    Book Now
                  </button>
                    </>
                  )}
                  
                  {healthStats && (
                    <div className="mt-3 p-3 border rounded bg-light">
                      <h6 className="text-primary mb-2">
                        <i className="bi bi-heart-pulse me-2"></i> Latest Health Stats
                      </h6>
                      <p className="mb-1 small"><strong>Pulse:</strong> {healthStats.pulse} bpm</p>
                      <p className="mb-1 small"><strong>Blood Pressure:</strong> {healthStats.systolicPressure}/{healthStats.diastolicPressure} mmHg</p>
                      <p className="mb-0 small"><strong>Notes:</strong> {healthStats.notes}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="fw-bold text-primary mb-3">NO UPCOMING</div>
                  <p className="text-muted">Schedule your next donation</p>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/eligibility")}>Book Now</button>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Blood Stock Status Card */}
        <div className="col-lg-4">
          <motion.div 
            className="card h-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card-body">
              <h5 className="card-title blood-stock">
                Blood Stock - Chennai
              </h5>
              {Object.keys(bloodStock).length > 0 ? (
                <table className="table table-sm table-borderless text-center">
                  <tbody>
                    {Object.entries(bloodStock).map(([group, status]) => (
                      <tr key={group}>
                        <td className="fw-bold">{group}</td>
                        <td>
                          <span className={`badge ${status.toLowerCase() === "critical" ? "bg-danger" : "bg-success"}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No blood stock data found.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Urgent Blood Requests Card */}
        <div className="col-lg-4">
          <motion.div 
            className="card h-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card-body">
              <h5 className="card-title urgent-requests">
                Urgent Blood Requests
              </h5>
              {urgentRequests.length > 0 ? (
                <div className="list-group list-group-flush">
                  {urgentRequests.slice(0, 3).map((req, index) => (
                    <div key={index} className="list-group-item border-0 px-0">
                      <h6 className="text-danger mb-1">Blood Group: {req.bloodGroup}</h6>
                      <p className="mb-1 small">� {req.facilityName}</p>
                      <p className="mb-1 small">Units Needed: {req.quantityRequired}</p>
                      <p className="mb-0 small">📞 Contact: {req.contactInfo}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No urgent requests at the moment.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Health Statistics Section */}
      <motion.div
        className="card mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="card-body">
          <h5 className="card-title health-stats">
            Health Statistics
          </h5>
          {healthStats ? (
            <div className="row g-4">
              <div className="col-md-4">
                <div className="health-metric-card text-center p-4 bg-white rounded-3 border shadow-sm">
                  <div className="health-icon-large mb-3">
                    <i className="bi bi-heart-pulse text-danger" style={{fontSize: '2.5rem'}}></i>
                  </div>
                  <div className="h1 fw-bold text-dark mb-1">{healthStats.pulse}</div>
                  <div className="text-uppercase text-muted fw-semibold" style={{fontSize: '0.85rem', letterSpacing: '0.5px'}}>Pulse (BPM)</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="health-metric-card text-center p-4 bg-white rounded-3 border shadow-sm">
                  <div className="health-icon-large mb-3">
                    <i className="bi bi-activity text-success" style={{fontSize: '2.5rem'}}></i>
                  </div>
                  <div className="h1 fw-bold text-dark mb-1">{healthStats.systolicPressure}</div>
                  <div className="text-uppercase text-muted fw-semibold" style={{fontSize: '0.85rem', letterSpacing: '0.5px'}}>Systolic BP (mmHg)</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="health-metric-card text-center p-4 bg-white rounded-3 border shadow-sm">
                  <div className="health-icon-large mb-3">
                    <i className="bi bi-speedometer2 text-info" style={{fontSize: '2.5rem'}}></i>
                  </div>
                  <div className="h1 fw-bold text-dark mb-1">{healthStats.diastolicPressure}</div>
                  <div className="text-uppercase text-muted fw-semibold" style={{fontSize: '0.85rem', letterSpacing: '0.5px'}}>Diastolic BP (mmHg)</div>
                </div>
              </div>
              {healthStats.notes && (
                <div className="col-12 mt-4">
                  <div className="health-notes-card p-4 bg-success rounded-3 border-0 shadow">
                    <div className="d-flex align-items-start">
                      <div className="health-notes-icon me-3">
                        <i className="bi bi-clipboard-check text-white" style={{fontSize: '1.8rem'}}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="text-white mb-3 fw-bold">
                          <i className="bi bi-shield-check me-2"></i>
                          Medical Assessment
                        </h5>
                        <p className="mb-0 text-white fs-6 fw-medium">{healthStats.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-muted mb-3">
                <i className="bi bi-clipboard-data" style={{fontSize: '3rem'}}></i>
              </div>
              <p className="text-muted">No health statistics available yet.</p>
              <p className="small text-muted">Health stats will be recorded after your first donation appointment.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom Row - Two Cards */}
      <div className="row g-4">
        
        {/* Your Achievements Card */}
        <div className="col-lg-6">
          <motion.div 
            className="card h-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="card-body">
              <h5 className="card-title achievements">
                Your Achievements
              </h5>
              {badgeData ? (
                <div className="text-center">
                  <div className="metric-value mb-2">{badgeData.totalPoints}</div>
                  <div className="metric-label mb-2">Points</div>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <span className="badge bg-warning">🏅 {badgeData.level}</span>
                    <span className="badge bg-info">⭐ {badgeData.badge}</span>
                  </div>
                  {badgeData.certificate && (
                    <div className="mt-3">
                      <a href={badgeData.certificate} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                        View Certificate
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="metric-value mb-2">0</div>
                  <div className="metric-label mb-2">Points</div>
                  <p className="text-muted small">Start donating to earn badges!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Upcoming Campaigns Card */}
        <div className="col-lg-6">
          <motion.div 
            className="card h-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="card-body">
              <h5 className="card-title campaigns">
                Upcoming Campaigns
              </h5>
              {upcomingCampaigns.length > 0 ? (
                <div className="list-group list-group-flush">
                  {upcomingCampaigns.slice(0, 3).map((camp, index) => (
                    <div key={index} className="list-group-item border-0 px-0 d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{camp.title}</h6>
                        <p className="mb-1 small text-muted">{camp.date} at {camp.time}</p>
                        <p className="mb-0 small">📍 {camp.location}</p>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">Join</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No upcoming campaigns found.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
  <style jsx>{`
        /* Professional Dashboard Styling - Clean Grey Design */
.donor-dashboard {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

.donor-dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(108, 117, 125, 0.05) 0%, rgba(73, 80, 87, 0.08) 100%);
  pointer-events: none;
}

/* Professional Card Design */
.card {
  border-radius: 20px !important;
  border: none !important;
  box-shadow: 
    0 8px 32px rgba(31, 38, 45, 0.12),
    0 4px 16px rgba(31, 38, 45, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  margin-bottom: 2rem !important;
  position: relative;
  backdrop-filter: blur(10px);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #495057, #6c757d, #adb5bd, #868e96);
}

.card:hover {
  transform: translateY(-8px) scale(1.02) !important;
  box-shadow: 
    0 20px 40px rgba(31, 38, 45, 0.16),
    0 8px 24px rgba(31, 38, 45, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
}

/* Professional Card Body */
.card-body {
  padding: 2.25rem !important;
  position: relative;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%);
}

/* Professional Card Titles with Icons */
.card-title {
  font-weight: 700 !important;
  font-size: 1.25rem !important;
  color: #343a40 !important;
  margin-bottom: 1.5rem !important;
  display: flex;
  align-items: center;
  gap: 16px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-size: 0.95rem !important;
}

.card-title::before {
  content: "";
  display: inline-block;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  box-shadow: 
    0 4px 12px rgba(73, 80, 87, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(173, 181, 189, 0.3);
  flex-shrink: 0;
  position: relative;
}

/* Specific Icons for Each Card */
.card-title.appointment::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23495057' viewBox='0 0 16 16'%3E%3Cpath d='M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z'/%3E%3Cpath d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
}

.card-title.actions::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23dc3545' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  background-color: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.2);
}

.card-title.achievements::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23ffc107' viewBox='0 0 16 16'%3E%3Cpath d='M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z'/%3E%3Cpath d='M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  background-color: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.2);
}

.card-title.slots::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%2317a2b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z'/%3E%3Cpath d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  background-color: rgba(23, 162, 184, 0.1);
  border-color: rgba(23, 162, 184, 0.2);
}

.card-title.streak::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%2328a745' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692l4.372 5.158A.5.5 0 0 1 14 14.5v-2a.5.5 0 0 1 .128-.334L18.5 7l-4.372-5.166A.5.5 0 0 1 14 1.5v2a.5.5 0 0 1-.128.334L9.5 8.692 5.128 3.834A.5.5 0 0 1 5 3.5v-2z'/%3E%3Cpath d='M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2L9 10v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  background-color: rgba(40, 167, 69, 0.1);
  border-color: rgba(40, 167, 69, 0.2);
}

.card-title.blood-stock::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23dc3545' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z'/%3E%3Cpath fill-rule='evenodd' d='M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  background-color: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.2);
}

.card-title.urgent-requests::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23ffc107' viewBox='0 0 16 16'%3E%3Cpath d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  background-color: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.2);
}

.card-title.campaigns::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%2317a2b8' viewBox='0 0 16 16'%3E%3Cpath d='M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599L1.84 10.81a6.5 6.5 0 0 1-.799-4.051C.998 4.998 2.448 4 4.01 4H5c.806 0 1.533.446 2.031 1.139.274.381.406.808.406 1.236v.077a.25.25 0 0 0 .426.177l.216-.216a1 1 0 0 1 1.414 0l1.002 1.002a.25.25 0 0 0 .177.073h.548c.576 0 1.059-.435 1.059-1.01V2.5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  background-color: rgba(23, 162, 184, 0.1);
  border-color: rgba(23, 162, 184, 0.2);
}

.card-title.health-stats::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23e91e63' viewBox='0 0 16 16'%3E%3Cpath d='m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  background-color: rgba(233, 30, 99, 0.1);
  border-color: rgba(233, 30, 99, 0.2);
}

/* Remove the old icon styling */
.card-title i {
  display: none;
}

/* Health Statistics Styling */
.health-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.health-metric {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(173, 181, 189, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(73, 80, 87, 0.08);
}

.health-metric:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(73, 80, 87, 0.12);
}

.health-metric .metric-value {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  display: block;
}

.health-metric .metric-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Enhanced Health Metric Cards */
.health-metric-card {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.health-metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: rgba(0,0,0,0.12);
}

.health-icon-large {
  margin-bottom: 1rem;
}

.health-icon-large i {
  font-size: 2.5rem !important;
  opacity: 1;
  display: inline-block;
  font-family: "bootstrap-icons" !important;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
}

/* Ensure Bootstrap Icons are loaded and visible */
.bi {
  font-family: "bootstrap-icons" !important;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  display: inline-block;
  vertical-align: -.125em;
}

/* Health notes styling */
.health-notes-card {
  background: linear-gradient(135deg, #198754 0%, #157347 100%) !important;
  transition: all 0.3s ease;
}

.health-notes-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 135, 84, 0.3) !important;
}

/* Enhanced metric values and labels */
.metric-value {
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  color: #212529 !important;
  line-height: 1.2;
  margin-bottom: 0.5rem !important;
}

.metric-label {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  color: #6c757d !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0 !important;
}

.health-notes-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(25, 135, 84, 0.25);
}

.health-notes-card:hover {
  box-shadow: 0 4px 15px rgba(25, 135, 84, 0.1);
  transform: translateY(-2px);
}

.health-notes-icon {
  flex-shrink: 0;
}

/* Health Notes Section */
.health-notes {
  background: linear-gradient(145deg, rgba(248, 249, 250, 0.9) 0%, rgba(233, 236, 239, 0.6) 100%);
  border: 1px solid rgba(173, 181, 189, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.health-notes h6 {
  color: #495057;
  font-weight: 700;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.health-notes p {
  color: #6c757d;
  margin-bottom: 0;
  line-height: 1.6;
}

/* Specialized Professional Card Colors */
.card:nth-child(1) .card-title i {
  color: #28a745;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%);
  border-color: rgba(40, 167, 69, 0.2);
}

.card:nth-child(2) .card-title i {
  color: #dc3545;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%);
  border-color: rgba(220, 53, 69, 0.2);
}

.card:nth-child(3) .card-title i {
  color: #17a2b8;
  background: linear-gradient(135deg, rgba(23, 162, 184, 0.1) 0%, rgba(23, 162, 184, 0.05) 100%);
  border-color: rgba(23, 162, 184, 0.2);
}

.card:nth-child(4) .card-title i {
  color: #ffc107;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
  border-color: rgba(255, 193, 7, 0.2);
}

/* Professional Stats Cards */
.stats-card {
  background: linear-gradient(135deg, #495057 0%, #343a40 100%);
  color: white;
  border: none;
}

.stats-card .card-title {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
}

.stats-card .card-title i {
  color: white;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Professional Typography */
.card p {
  font-size: 1.05rem;
  color: #495057;
  margin-bottom: 1rem;
  line-height: 1.7;
  font-weight: 400;
}

.card p strong {
  color: #212529;
  font-weight: 700;
}

/* Professional Metric Cards */
.metric-card {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
}

.metric-value {
  font-size: 3rem;
  font-weight: 800;
  color: #212529 !important;
  margin-bottom: 0.75rem;
  display: block;
  text-shadow: none;
  background: none !important;
  -webkit-background-clip: initial !important;
  -webkit-text-fill-color: #212529 !important;
  background-clip: initial !important;
}

.metric-label {
  font-size: 1rem;
  color: #6c757d !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.metric-change {
  font-size: 0.875rem;
  font-weight: 700;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
}

.metric-change.positive {
  color: #155724;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%);
  border: 1px solid rgba(40, 167, 69, 0.2);
}

.metric-change.negative {
  color: #721c24;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%);
  border: 1px solid rgba(220, 53, 69, 0.2);
}

/* Professional Badge System */
.badge {
  font-size: 0.8rem !important;
  padding: 0.6em 1.2em !important;
  border-radius: 25px !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.bg-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
  border-color: rgba(40, 167, 69, 0.3) !important;
}

.bg-danger {
  background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%) !important;
  border-color: rgba(220, 53, 69, 0.3) !important;
}

.bg-warning {
  background: linear-gradient(135deg, #ffc107 0%, #f39c12 100%) !important;
  color: #212529 !important;
  border-color: rgba(255, 193, 7, 0.3) !important;
}

.bg-info {
  background: linear-gradient(135deg, #17a2b8 0%, #3498db 100%) !important;
  border-color: rgba(23, 162, 184, 0.3) !important;
}

.bg-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%) !important;
  border-color: rgba(108, 117, 125, 0.3) !important;
}

/* Professional Table Design */
.table {
  border-radius: 16px !important;
  overflow: hidden !important;
  font-size: 1rem !important;
  margin-bottom: 0 !important;
  box-shadow: 0 4px 16px rgba(73, 80, 87, 0.08) !important;
  border: 1px solid rgba(173, 181, 189, 0.2);
}

.table thead {
  background: linear-gradient(135deg, #495057 0%, #343a40 100%) !important;
}

.table th {
  font-weight: 700 !important;
  color: white !important;
  border-bottom: none !important;
  padding: 1.25rem 1rem !important;
  font-size: 0.9rem !important;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.table td {
  padding: 1.125rem 1rem !important;
  vertical-align: middle !important;
  color: #495057;
  border-bottom: 1px solid rgba(222, 226, 230, 0.5) !important;
  background: rgba(255, 255, 255, 0.8);
}

.table-hover tbody tr:hover {
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(233, 236, 239, 0.6) 100%) !important;
  transform: scale(1.01);
  transition: all 0.3s ease;
}

/* List Group Styling */
.list-group-item {
  border: none !important;
  padding: 1.25rem !important;
  background: white !important;
  border-bottom: 1px solid #f7fafc !important;
  transition: all 0.2s ease !important;
}

.list-group-item:hover {
  background-color: #f7fafc !important;
  transform: translateX(4px);
}

.list-group-item:last-child {
  border-bottom: none !important;
}

.list-group-item h6 {
  font-weight: 600 !important;
  margin-bottom: 0.5rem !important;
  font-size: 1rem !important;
  color: #2d3748 !important;
}

.list-group-item p {
  margin-bottom: 0.25rem !important;
  font-size: 0.875rem !important;
  color: #718096 !important;
}

/* Campaign Cards */
.col-md-4 .bg-light {
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 1.5rem !important;
  transition: all 0.2s ease !important;
  height: 100% !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

.col-md-4 .bg-light:hover {
  border-color: #667eea !important;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1) !important;
  transform: translateY(-2px);
}

.col-md-4 .bg-light h6 {
  color: #2d3748 !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
  margin-bottom: 0.75rem !important;
}

.col-md-4 .bg-light p {
  color: #718096 !important;
  font-size: 0.875rem !important;
  margin-bottom: 0.5rem !important;
}

/* Professional Button System */
.btn {
  border-radius: 12px !important;
  font-weight: 600 !important;
  padding: 0.875rem 1.75rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 2px solid transparent !important;
  font-size: 0.9rem !important;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-sm {
  padding: 0.625rem 1.25rem !important;
  font-size: 0.825rem !important;
}

.btn-outline-primary {
  color: #495057 !important;
  border-color: #6c757d !important;
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(233, 236, 239, 0.6) 100%) !important;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #495057 0%, #343a40 100%) !important;
  color: white !important;
  border-color: #495057 !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(73, 80, 87, 0.3);
}

.btn-outline-danger {
  color: #dc3545 !important;
  border-color: #dc3545 !important;
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(233, 236, 239, 0.6) 100%) !important;
}

.btn-outline-danger:hover {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
  color: white !important;
  border-color: #dc3545 !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
  color: white !important;
  border-color: #dc3545 !important;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 53, 69, 0.4);
}

/* Professional Content Areas */
.bg-light {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%) !important;
  border: 1px solid rgba(173, 181, 189, 0.3) !important;
  border-radius: 16px !important;
  padding: 1.75rem !important;
  box-shadow: 0 4px 16px rgba(73, 80, 87, 0.08);
}

.bg-light h6 {
  color: #495057 !important;
  font-weight: 700 !important;
  margin-bottom: 1rem !important;
  font-size: 1.1rem !important;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bg-light p {
  margin-bottom: 0.75rem !important;
  font-size: 0.95rem !important;
  color: #6c757d !important;
  line-height: 1.6;
}

/* Professional Countdown Display */
.fw-bold.text-primary {
  font-size: 1.5rem !important;
  font-weight: 800 !important;
  color: #495057 !important;
  padding: 1rem 1.5rem !important;
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(233, 236, 239, 0.7) 100%) !important;
  border-radius: 12px !important;
  display: inline-block !important;
  border: 2px solid rgba(173, 181, 189, 0.3) !important;
  box-shadow: 0 4px 12px rgba(73, 80, 87, 0.1);
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Professional Welcome Section */
.welcome-card {
  background: linear-gradient(135deg, #495057 0%, #343a40 100%);
  color: white;
  margin-bottom: 2.5rem;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.welcome-card .card-body {
  padding: 2.5rem;
  position: relative;
  z-index: 1;
}

.welcome-card h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.welcome-card p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0;
  font-size: 1.1rem;
}

/* Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .donor-dashboard {
    padding: 15px;
  }
  
  .card-body {
    padding: 1.25rem !important;
  }
  
  .card-title {
    font-size: 1rem !important;
  }
  
  .table th, .table td {
    padding: 0.75rem 0.5rem !important;
    font-size: 0.875rem !important;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .card-body {
    padding: 1rem !important;
  }
  
  .btn {
    padding: 0.5rem 1rem !important;
    font-size: 0.8125rem !important;
  }
}
        }
      `}</style>
</div>

  );
};

export default DonorDashboard;