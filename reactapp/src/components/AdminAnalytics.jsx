import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Container } from "react-bootstrap";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import authService from "../services/AuthService";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const AdminAnalytics = () => {
  const [summary, setSummary] = useState({
    donors: 0,
    appointments: 0,
    donations: 0,
    urgentRequests: 0,
  });

  const [monthlyData, setMonthlyData] = useState({
    donations: [],
    appointments: []
  });

useEffect(() => {
  const token = localStorage.getItem("token"); // ⬅️ get token from storage

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch summary data
  axios.get("http://localhost:8080/api/reports/summary", {
        headers: authService.getAuthHeaders(),
      })
    .then((res) => {
      setSummary(res.data);
    })
    .catch(() => {
      // Dummy data fallback
      setSummary({
        donors: 120,
        appointments: 340,
        donations: 280,
        urgentRequests: 15,
      });
    });

  // Fetch monthly data
  axios.get("http://localhost:8080/api/reports/monthly", config)
    .then((res) => {
      setMonthlyData(res.data);
    })
    .catch(() => {
      // Dummy data fallback
      setMonthlyData({
        donations: [65, 59, 80, 81, 56, 72, 65, 59, 80, 81, 56, 72],
        appointments: [28, 48, 40, 19, 86, 27, 28, 48, 40, 19, 86, 27]
      });
    });
}, []);

  // Doughnut Chart Data
  const doughnutData = {
    labels: ["Donors", "Appointments", "Donations", "Urgent Requests"],
    datasets: [
      {
        data: [
          summary.donors,
          summary.appointments,
          summary.donations,
          summary.urgentRequests,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Donations',
        data: monthlyData.donations,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Appointments',
        data: monthlyData.appointments,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  // Line Chart Data (Donor Growth)
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Donors',
        data: [12, 19, 15, 22, 18, 25, 12, 19, 15, 22, 18, 25],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  return (
    <Container fluid className="py-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="fas fa-chart-bar me-2 text-primary"></i>
          Analytics Dashboard
        </h2>
        <div>
          <button className="btn btn-outline-secondary btn-sm me-2">
            <i className="fas fa-download me-1"></i> Export
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="fas fa-cog me-1"></i> Settings
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4 g-4">
        <Col xl={3} lg={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Donors</h6>
                  <h3 className="mb-0 text-primary">{summary.donors}</h3>
                  <small className="text-success">
                    <i className="fas fa-arrow-up me-1"></i> 12% from last month
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="fas fa-users text-primary" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Appointments</h6>
                  <h3 className="mb-0 text-warning">{summary.appointments}</h3>
                  <small className="text-success">
                    <i className="fas fa-arrow-up me-1"></i> 8% from last month
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="fas fa-calendar-check text-warning" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Donations</h6>
                  <h3 className="mb-0 text-success">{summary.donations}</h3>
                  <small className="text-danger">
                    <i className="fas fa-arrow-down me-1"></i> 3% from last month
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="fas fa-hand-holding-medical text-success" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Urgent Requests</h6>
                  <h3 className="mb-0 text-danger">{summary.urgentRequests}</h3>
                  <small className="text-success">
                    <i className="fas fa-arrow-up me-1"></i> 22% from last month
                  </small>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded">
                  <i className="fas fa-exclamation-triangle text-danger" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Charts Section */}
      <Row className="g-4 mb-4">
        {/* Distribution Chart */}
        <Col xl={4} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Data Distribution</h5>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-secondary">Week</button>
                  <button className="btn btn-outline-secondary active">Month</button>
                  <button className="btn btn-outline-secondary">Year</button>
                </div>
              </div>
              <div style={{ height: '300px' }}>
                <Doughnut 
                  data={doughnutData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Monthly Activity */}
        <Col xl={8} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Monthly Activity</h5>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-secondary active">All</button>
                  <button className="btn btn-outline-secondary">Donations</button>
                  <button className="btn btn-outline-secondary">Appointments</button>
                </div>
              </div>
              <div style={{ height: '300px' }}>
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          drawBorder: false
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section */}
      <Row className="g-4">
        {/* Donor Growth */}
        <Col xl={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Donor Growth</h5>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-secondary active">2023</button>
                  <button className="btn btn-outline-secondary">2022</button>
                  <button className="btn btn-outline-secondary">2021</button>
                </div>
              </div>
              <div style={{ height: '250px' }}>
                <Line
                  data={lineData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          drawBorder: false
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Blood Type Distribution */}
        <Col xl={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3">Blood Type Distribution</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#e63946' }}></div>
                <div className="me-2">A+</div>
                <div className="ms-auto">32%</div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#f1c40f' }}></div>
                <div className="me-2">B+</div>
                <div className="ms-auto">25%</div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#2ecc71' }}></div>
                <div className="me-2">O+</div>
                <div className="ms-auto">28%</div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#3498db' }}></div>
                <div className="me-2">AB+</div>
                <div className="ms-auto">8%</div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#9b59b6' }}></div>
                <div className="me-2">A-</div>
                <div className="ms-auto">4%</div>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#1abc9c' }}></div>
                <div className="me-2">Others</div>
                <div className="ms-auto">3%</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAnalytics;