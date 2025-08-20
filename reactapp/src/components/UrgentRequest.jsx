import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import { 
  Table,
  Card, 
  Button, 
  Form, 
  Row, 
  Col, 
  Spinner, 
  Alert, 
  Badge,
  Container,
  ProgressBar 
} from "react-bootstrap";
import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTint, 
  FaHospital, 
  FaCalendarAlt,
  FaFilter,
  FaExclamationTriangle,
  FaHeartbeat
} from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';


const UrgentRequests = ({ showSidebar = true }) => {
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'

  // Fetch all urgent requests
  const fetchUrgentRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await ApiService.authenticatedRequest("/urgent-requests/all");
      const data = await res.json();
      setUrgentRequests(data || []);
    } catch (err) {
      setError("Failed to load urgent requests. Please try again later.");
      console.error("Error fetching urgent requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter urgent requests
  const filterRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (bloodGroup) params.append("bloodGroup", bloodGroup);
      if (location) params.append("location", location);

      const res = await ApiService.authenticatedRequest(
        `/urgent-requests/filter?${params.toString()}`
      );
      const data = await res.json();
      setUrgentRequests(data || []);
    } catch (err) {
      setError("Failed to filter urgent requests. Please check your connection.");
      console.error("Error filtering urgent requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setBloodGroup("");
    setLocation("");
    fetchUrgentRequests();
  };

  useEffect(() => {
    fetchUrgentRequests();
  }, []);

  // Get urgency level (mock implementation)
  const getUrgencyLevel = (requestDate) => {
    // In a real app, you would calculate based on actual dates
    const levels = ["Low", "Medium", "High", "Critical"];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  // Get urgency color
  const getUrgencyColor = (level) => {
    switch(level) {
      case "Low": return "success";
      case "Medium": return "warning";
      case "High": return "danger";
      case "Critical": return "dark";
      default: return "secondary";
    }
  };

  return (
    <div className="container-fluid g-0 donor-dashboard">
      <div className="row g-0">
        {/* Sidebar */}
        {showSidebar && (
          <div className="col-md-2">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className={`p-4 ${showSidebar ? "col-md-10" : "col-12"}`}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-danger">
              <FaExclamationTriangle className="me-2" /> Urgent Blood Requests
            </h2>
            <div>
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="me-2"
                onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
              >
                {viewMode === "cards" ? "Table View" : "Card View"}
              </Button>
              <Button variant="danger" size="sm" onClick={fetchUrgentRequests}>
                Refresh
              </Button>
            </div>
          </div>

          {/* Filter Section */}
          <Card className="mb-4 shadow-sm border-0">
            <Card.Body className="p-3">
              <Row className="g-3 align-items-center">
                <Col md={4}>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaTint className="text-danger" />
                    </span>
                    <Form.Select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="form-select-lg"
                    >
                      <option value="">All Blood Types</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaMapMarkerAlt className="text-danger" />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Search by location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="form-control-lg"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="danger" 
                    onClick={filterRequests} 
                    className="w-100 py-2"
                  >
                    <FaFilter className="me-2" /> Filter
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearFilters} 
                    className="w-100 py-2"
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Error */}
          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}

          {/* Loader */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-2 text-muted">Loading urgent requests...</p>
            </div>
          ) : urgentRequests.length === 0 ? (
            <div className="text-center py-5">
              <img 
                src="/images/no-requests.svg" 
                alt="No urgent requests" 
                style={{ maxWidth: '300px', opacity: 0.7 }}
                className="mb-4"
              />
              <h5 className="text-muted">No urgent requests found</h5>
              <p className="text-muted">Try adjusting your filters or check back later</p>
              <Button variant="danger" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "cards" ? (
            <div className="row g-4">
              {urgentRequests.map((req) => {
                const urgencyLevel = getUrgencyLevel(req.requestDate);
                const urgencyColor = getUrgencyColor(urgencyLevel);
                
                return (
                  <Col key={req.id} xs={12} md={6} lg={4}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-100 shadow-sm border-0 urgent-card">
                        <Card.Header className={`bg-${urgencyColor}-light text-${urgencyColor} d-flex justify-content-between align-items-center`}>
                          <div className="d-flex align-items-center">
                            <FaTint className="me-2" />
                            <span className="fw-bold">{req.bloodGroup}</span>
                          </div>
                          <Badge pill bg={urgencyColor}>
                            {urgencyLevel} Urgency
                          </Badge>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex align-items-center mb-3">
                            <div className="urgent-icon bg-danger-light">
                              <FaHospital className="text-danger" />
                            </div>
                            <div className="ms-3">
                              <h6 className="mb-0 fw-bold">{req.facilityName || "Medical Facility"}</h6>
                              <small className="text-muted">
                                <FaMapMarkerAlt className="me-1" /> {req.location}
                              </small>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted">Units Needed</span>
                              <span className="fw-bold">{req.quantityRequired|| "N/A"}</span>
                            </div>
                            <ProgressBar 
                              now={Math.min((req.units || 1) * 20, 100)} 
                              variant="danger" 
                              className="urgent-progress"
                            />
                          </div>
                          
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <FaCalendarAlt className="me-2 text-muted" />
                              <small className="text-muted">{req.requestDate || "N/A"}</small>
                            </div>
                            {req.contactInfo && (
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                href={`tel:${req.contactInfo}`}
                                className="d-flex align-items-center"
                              >
                                <FaPhone className="me-1" /> Call Now
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-light">
                          <Button variant="danger" className="w-100">
                            <FaHeartbeat className="me-2" /> Respond to Request
                          </Button>
                        </Card.Footer>
                      </Card>
                    </motion.div>
                  </Col>
                );
              })}
            </div>
          ) : (
            <Card className="shadow-sm border-0">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0 urgent-table">
                    <thead>
                      <tr>
                        <th><FaTint /> Blood</th>
                        <th>Units</th>
                        <th><FaHospital /> Facility</th>
                        <th><FaMapMarkerAlt /> Location</th>
                        <th>Urgency</th>
                        <th><FaCalendarAlt /> Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {urgentRequests.map((req) => {
                        const urgencyLevel = getUrgencyLevel(req.requestDate);
                        const urgencyColor = getUrgencyColor(urgencyLevel);
                        
                        return (
                          <tr key={req.id}>
                            <td className="fw-bold text-danger">{req.bloodGroup}</td>
                            <td>{req.units || "-"}</td>
                            <td>{req.facilityName || "N/A"}</td>
                            <td>{req.location}</td>
                            <td>
                              <Badge pill bg={urgencyColor}>
                                {urgencyLevel}
                              </Badge>
                            </td>
                            <td>{req.requestDate || "N/A"}</td>
                            <td>
                              {req.contactInfo ? (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  href={`tel:${req.contactInfo}`}
                                  className="d-flex align-items-center"
                                >
                                  <FaPhone className="me-1" /> Call
                                </Button>
                              ) : (
                                <span className="text-muted">No Contact</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
       <style jsx>{`
        /* Card styling */
.urgent-card {
  transition: all 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
}

.urgent-card:hover {
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

.urgent-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

/* Progress bar styling */
.urgent-progress {
  height: 8px;
  border-radius: 4px;
}

/* Table styling */
.urgent-table thead th {
  border-bottom: 2px solid #dc3545;
  white-space: nowrap;
}

.urgent-table tbody tr {
  transition: background-color 0.2s;
}

.urgent-table tbody tr:hover {
  background-color: rgba(220, 53, 69, 0.05);
}

/* Color variants */
.bg-success-light {
  background-color: rgba(25, 135, 84, 0.1);
}

.bg-warning-light {
  background-color: rgba(255, 193, 7, 0.1);
}

.bg-danger-light {
  background-color: rgba(220, 53, 69, 0.1);
}

.bg-dark-light {
  background-color: rgba(33, 37, 41, 0.1);
}

.text-success-light {
  color: rgba(25, 135, 84, 0.8);
}

.text-warning-light {
  color: rgba(255, 193, 7, 0.8);
}

.text-danger-light {
  color: rgba(220, 53, 69, 0.8);
}

.text-dark-light {
  color: rgba(33, 37, 41, 0.8);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .urgent-table thead {
    display: none;
  }
  
  .urgent-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 8px;
  }
  
  .urgent-table td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border: none;
  }
  
  .urgent-table td::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 1rem;
  }
}
      `}</style>
    </div>
  );
};

export default UrgentRequests;