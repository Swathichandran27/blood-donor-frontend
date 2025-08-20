import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../services/AuthService";
import HealthStatsModal from "./HeathStatsModal";
import {
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  InputGroup,
  FormControl,
  Dropdown,
  Row,
  Col
} from "react-bootstrap";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaPlusCircle,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser
} from "react-icons/fa";
import moment from "moment";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalAppointment, setModalAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const token = authService.getToken();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);

      const userIds = [...new Set(response.data.map(a => a.userId))];
      const userPromises = userIds.map(id =>
        axios.get(`http://localhost:8080/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      );
      const userResponses = await Promise.all(userPromises);

      const userMap = {};
      userResponses.forEach(res => {
        userMap[res.data.id] = res.data;
      });
      setUsers(userMap);

    } catch (err) {
      setError("Failed to fetch appointments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const markCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/appointments/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "Completed" } : a));
    } catch {
      alert("Failed to mark as completed");
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.delete(`http://localhost:8080/api/appointments/cancel/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(prev => prev.filter(a => a.id !== id));
      } catch {
        alert("Failed to cancel appointment");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge bg="success">{status}</Badge>;
      case "Cancelled":
        return <Badge bg="danger">{status}</Badge>;
      case "Pending":
        return <Badge bg="warning" text="dark">{status}</Badge>;
      case "Confirmed":
        return <Badge bg="primary">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

const filteredAppointments = appointments.filter((appointment) => {
  const matchesSearch =
    appointment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.centerId?.toString().toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || appointment.status === statusFilter;

  const matchesDate =
    !dateFilter ||
    moment(appointment.appointmentDate).format("YYYY-MM-DD") ===
      moment(dateFilter).format("YYYY-MM-DD");

  return matchesSearch && matchesStatus && matchesDate;
});


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body style={{ padding: '1.5rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            Appointment Management
          </h4>
          
        </div>

        {/* Filters - Improved Alignment */}
        <div className="mb-4" style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '0.375rem' }}>
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text style={{ backgroundColor: '#fff' }}>
                  <FaSearch style={{ color: '#6c757d' }} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderLeft: 'none' }}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  id="status-filter"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span>{statusFilter}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: '100%' }}>
                  <Dropdown.Item onClick={() => setStatusFilter("All")}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("Pending")}>Pending</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("Confirmed")}>Confirmed</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("Completed")}>Completed</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("Cancelled")}>Cancelled</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={3}>
              <FormControl
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ height: '38px' }}
              />
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setDateFilter("");
                }}
                style={{ width: '100%' }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </div>

        {/* Appointments Table - Improved Styling */}
        <div className="table-responsive">
          <Table striped bordered hover className="mb-0">
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ color: '#212529', fontWeight: '600' }}>ID</th>
                <th style={{ color: '#212529', fontWeight: '600' }}>Donor</th>
                <th style={{ color: '#212529', fontWeight: '600' }}>Date & Time</th>
                <th style={{ color: '#212529', fontWeight: '600' }}>Center</th>
                <th style={{ color: '#212529', fontWeight: '600' }}>Status</th>
                <th style={{ color: '#212529', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(a => (
                  <tr key={a.id}>
                    <td className="fw-bold" style={{ color: '#212529' }}>#{a.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div style={{ 
                          backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                          padding: '0.5rem', 
                          borderRadius: '50%', 
                          marginRight: '0.75rem'
                        }}>
                          <FaUser style={{ color: '#dc3545' }} />
                        </div>
                        <div>
                          <div className="fw-bold" style={{ color: '#212529' }}>
                            {users[a.userId]?.fullName || "N/A"}
                          </div>
                          <small className="text-muted">{users[a.userId]?.email || ""}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold" style={{ color: '#212529' }}>
                        {moment(a.appointmentDate).format("MMM D, YYYY")}
                      </div>
                      <small className="text-muted">{a.appointmentTime}</small>
                    </td>
                    <td style={{ color: '#212529' }}>{a.centerId}</td>
                    <td>{getStatusBadge(a.status)}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        {a.status !== "Completed" && a.status !== "Cancelled" && (
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => markCompleted(a.id)}
                            className="d-flex align-items-center"
                            style={{ minWidth: '100px' }}
                          >
                            <FaCheckCircle className="me-1" /> Complete
                          </Button>
                        )}
                        {a.status === "Completed" && (
                          <Button 
                            variant="info" 
                            size="sm" 
                            onClick={() => setModalAppointment(a)}
                            className="d-flex align-items-center"
                            style={{ minWidth: '100px' }}
                          >
                            <FaPlusCircle className="me-1" /> Health Stats
                          </Button>
                        )}
                        {a.status !== "Cancelled" && (
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => cancelAppointment(a.id)}
                            className="d-flex align-items-center"
                            style={{ minWidth: '100px' }}
                          >
                            <FaTimesCircle className="me-1" /> Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4" style={{ color: '#6c757d' }}>
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
          <div>
            <Button variant="outline-secondary" size="sm" className="me-2">
              Previous
            </Button>
            <Button variant="outline-secondary" size="sm">
              Next
            </Button>
          </div>
        </div>

        {modalAppointment && (
          <HealthStatsModal
            appointment={modalAppointment}
            onClose={() => setModalAppointment(null)}
            onSave={fetchAppointments}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default AdminAppointments;