import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaCommentDots,
  FaTint,
  FaUtensils,
  FaWineGlassAlt,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import authService from "../services/AuthService";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleData, setRescheduleData] = useState({ id: null, date: "", time: "" });
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "https://blood-donor-backend-cibk.onrender.com/api/appointments";
  const user = authService.getUserData();
  const userId = user?.id;
  const headers = authService.getAuthHeaders();

  useEffect(() => {
    if (userId) {
      fetchAppointments(userId);
      fetchHistory(userId);
    }
  }, [userId]);

  const fetchAppointments = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/upcoming/${id}`, { headers });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
      if (err.response?.status === 401) {
        authService.removeToken();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/history/${id}`, { headers });
      setHistory(res.data);
      const givenFeedbacks = res.data
        .filter((appt) => appt.feedbackGiven)
        .map((appt) => appt.id);
      setSubmittedFeedbacks(givenFeedbacks);
    } catch (err) {
      console.error("Error fetching appointment history", err);
      if (err.response?.status === 401) {
        authService.removeToken();
        navigate("/login");
      }
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.delete(`${BASE_URL}/cancel/${id}`, { headers });
      fetchAppointments(userId);
      fetchHistory(userId);
    } catch (err) {
      console.error("Error cancelling appointment", err);
      if (err.response?.status === 401) {
        authService.removeToken();
        navigate("/login");
      }
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      alert("Please select a new date and time");
      return;
    }
    try {
      await axios.put(
        `${BASE_URL}/reschedule?appointmentId=${rescheduleData.id}&newDate=${rescheduleData.date}&newTime=${rescheduleData.time}`,
        null,
        { headers }
      );
      setRescheduleData({ id: null, date: "", time: "" });
      fetchAppointments(userId);
      fetchHistory(userId);
    } catch (err) {
      console.error("Error rescheduling appointment", err);
      if (err.response?.status === 401) {
        authService.removeToken();
        navigate("/login");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <span className="status-badge confirmed">{status}</span>;
      case "pending":
        return <span className="status-badge pending">{status}</span>;
      case "cancelled":
        return <span className="status-badge cancelled">{status}</span>;
      case "completed":
        return <span className="status-badge completed">{status}</span>;
      default:
        return <span className="status-badge other">{status}</span>;
    }
  };

  if (!userId) return <p>Please login to view appointments.</p>;
  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="manage-container container-fluid">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-2 sidebar-col">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-10 main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="page-title">Manage Your Appointments</h2>
            <button
              className="btn btn-primary rounded-pill shadow-sm"
              onClick={() => navigate("/eligibility")}
            >
              + Book Appointment
            </button>
          </div>

          {/* Next Appointment Card */}
          {appointments.length > 0 && (
            <div className="next-appointment-card shadow-sm mb-4">
              <FaCalendarAlt className="me-2 text-danger fs-5" />
              <strong>Next Appointment:</strong> {appointments[0].appointmentDate} at{" "}
              {appointments[0].appointmentTime} ({appointments[0].donationType})
            </div>
          )}

          {/* Upcoming Appointments */}
          <div className="section-card upcoming mb-5 shadow-sm p-4 rounded-3">
            <h3 className="section-title">Upcoming Appointments</h3>
            {appointments.length === 0 ? (
              <p className="text-muted">No upcoming appointments.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Donation Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td>{appt.appointmentDate}</td>
                        <td>{appt.appointmentTime}</td>
                        <td>{appt.donationType}</td>
                        <td>{getStatusBadge(appt.status)}</td>
                        <td>
                          {rescheduleData.id === appt.id ? (
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="date"
                                value={rescheduleData.date}
                                onChange={(e) =>
                                  setRescheduleData({ ...rescheduleData, date: e.target.value })
                                }
                                className="form-control form-control-sm"
                              />
                              <input
                                type="time"
                                value={rescheduleData.time}
                                onChange={(e) =>
                                  setRescheduleData({ ...rescheduleData, time: e.target.value })
                                }
                                className="form-control form-control-sm"
                              />
                              <button className="btn btn-success btn-sm" onClick={handleReschedule}>
                                Submit
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setRescheduleData({ id: null, date: "", time: "" })}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                className="btn btn-gradient-warning me-2"
                                onClick={() =>
                                  setRescheduleData({ id: appt.id, date: "", time: "" })
                                }
                              >
                                <FaEdit /> Reschedule
                              </button>
                              <button
                                className="btn btn-gradient-danger"
                                onClick={() => handleCancel(appt.id)}
                              >
                                <FaTrash /> Cancel
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* History Section */}
          <div className="section-card history mb-5 shadow-sm p-4 rounded-3">
            <h3 className="section-title">Appointment History</h3>
            {history.length === 0 ? (
              <p className="text-muted">No past appointments found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Donation Type</th>
                      <th>Status</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((appt) => (
                      <tr key={appt.id}>
                        <td>{appt.appointmentDate}</td>
                        <td>{appt.appointmentTime}</td>
                        <td>{appt.donationType}</td>
                        <td>{getStatusBadge(appt.status)}</td>
                        <td>
                          {appt.status.toLowerCase() === "completed" ? (
                            submittedFeedbacks.includes(appt.id) ? (
                              <span className="text-success fw-bold">✔ Feedback Submitted</span>
                            ) : (
                              <button
                                className="btn btn-gradient-primary"
                                onClick={() => navigate(`/feedback/${appt.id}`)}
                              >
                                <FaCommentDots /> Give Feedback
                              </button>
                            )
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Donation Tips */}
          <div className="tips-card shadow-sm p-4 rounded-3">
            <h4 className="mb-4 text-primary">Donation Tips</h4>
            <ul className="list-unstyled mb-0">
              <li className="tip-item">
                <FaTint className="me-3 text-info" />
                Drink plenty of water before donating.
              </li>
              <li className="tip-item">
                <FaUtensils className="me-3 text-success" />
                Eat a healthy meal within 2 hours before your appointment.
              </li>
              <li className="tip-item">
                <FaWineGlassAlt className="me-3 text-danger" />
                Avoid alcohol 24 hours before donation.
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Scoped CSS */}
      <style>{`
        /* General Layout */
 .manage-container {
          background-color: #f9fafc;
          min-height: 100vh;
        }
        .main-content {
          background: #fff;
          border-left: 1px solid #eee;
        }
        
         .next-appointment-card {
          background: #fdf6f6;
          padding: 1rem 1.5rem;
          border-left: 4px solid #e74c3c;
          border-radius: 8px;
          font-size: 1rem;
        }
        .section-title {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #34495e;
        }
.page-title {
  font-weight: 700;
  color: #2d3436;
}

.section-card {
  border-radius: 12px;
  padding: 1.5rem;
}

.section-card.upcoming {
  background: linear-gradient(135deg, #e0f7fa, #ffffff);
  border-left: 5px solid #00acc1;
}

.section-card.history {
  background: linear-gradient(135deg, #fff3e0, #ffffff);
  border-left: 5px solid #fb8c00;
}

.section-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

/* Gradient Buttons */
.btn-gradient-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
  transition: transform 0.2s ease;
}
.btn-gradient-warning {
  background: linear-gradient(135deg, #f7971e, #ffd200);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
}
.btn-gradient-danger {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
}
.btn-gradient-primary:hover,
.btn-gradient-warning:hover,
.btn-gradient-danger:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  color: #fff;
  text-transform: capitalize;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.status-badge.confirmed {
  background: linear-gradient(135deg, #43cea2, #185a9d);
}

.status-badge.pending {
  background: linear-gradient(135deg, #f7971e, #ffd200);
  color: #333;
}

.status-badge.cancelled {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
}

.status-badge.completed {
  background: linear-gradient(135deg, #56ab2f, #a8e063);
}

.status-badge.other {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}

/* Donation Tips */
.tips-card {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px solid #cfe2f3;
}

.tip-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-weight: 500;
  transition: transform 0.2s ease, background 0.2s ease;
}

.tip-item:hover {
  transform: translateX(5px);
  background: #f8fbff;
}
  .status-badge.confirmed {
  background: linear-gradient(135deg, #43cea2, #185a9d); /* teal-blue gradient */
}

.status-badge.pending {
  background: linear-gradient(135deg, #f7971e, #ffd200); /* orange-yellow gradient */
  color: #333;
}

.status-badge.cancelled {
  background: linear-gradient(135deg, #ff416c, #ff4b2b); /* red-pink gradient */
}

.status-badge.completed {
  background: linear-gradient(135deg, #56ab2f, #a8e063); /* green gradient */
}

.status-badge.other {
  background: linear-gradient(135deg, #6a11cb, #2575fc); /* purple-blue gradient */
}
.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 20px;
  color: #fff;
  text-transform: capitalize;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  letter-spacing: 0.3px;
}

      `}</style>
    </div>
  );
};

export default ManageAppointments;