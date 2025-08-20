import React, { useEffect, useState } from "react";
import { Button, Card, Form, Row, Col, Spinner } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import Sidebar from "./Sidebar";
import styles from "./DonationCenters.module.css";

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DonationCenters = () => {
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState([20.5937, 78.9629]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async (query = "") => { 
    try {
      setLoading(true);
      let url = "http://localhost:8080/api/donationCenters";

      if (query) {
        if (/^\d+$/.test(query)) {
          url = `http://localhost:8080/api/donationCenters/search/pincode?pincode=${query}`;
        } else {
          url = `http://localhost:8080/api/donationCenters/search/city?city=${query}`;
        }
      }

      const res = await axios.get(url);
      setCenters(res.data);
    } catch (err) {
      console.error("Error fetching centers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCenters(search);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        fetchCenters(`${pos.coords.latitude},${pos.coords.longitude}`);
      });
    } else {
      alert("Geolocation not supported in this browser.");
    }
  };

  return (
    <div className={`container-fluid g-0 ${styles.donorDashboard}`}>
      <div className="row g-0">
        <div className="col-md-2">
          <Sidebar />
        </div>

        <div className="col-md-10 p-4">
         <h2 className={`mb-4 text-center ${styles.pageHeader}`}>
  <i className="bi bi-geo-alt-fill me-2"></i>
  Find Blood Donation Centers
</h2>


          <Form onSubmit={handleSearch} className={styles.searchContainer}>
            <Row className="g-3">
              <Col md={8}>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Enter City or Pincode to find nearby centers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                  />
                  <i className={`bi bi-search ${styles.searchIcon}`}></i>
                </div>
              </Col>
              <Col md={2}>
                <Button 
                  type="submit" 
                  className={`w-100 ${styles.searchButton}`}
                >
                  <i className="bi bi-search me-2"></i>
                  SEARCH
                </Button>
              </Col>
              <Col md={2}>
                <Button
                  className={`w-100 ${styles.locationButton}`}
                  onClick={handleUseLocation}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  USE MY LOCATION
                </Button>
              </Col>
            </Row>
          </Form>

          <div className={styles.mapContainer}>
            <Card className="border-0 overflow-hidden">
              <Card.Header className={styles.mapHeader}>
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-map me-2"></i>
                  Interactive Map View
                </h5>
              </Card.Header>
              <div className={styles.mapWrapper}>
                <MapContainer center={position} zoom={5} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {centers.map((center) => (
                    <Marker key={center.id} position={[center.latitude, center.longitude]}>
                      <Popup>
                        <strong>{center.name}</strong> <br />
                        {center.address} <br />
                       <i className="bi bi-telephone-fill me-2 text-success"></i> {center.contactNumber} <br />
                        <i className="bi bi-clock-fill me-2 text-warning"></i> {center.operatingHours}<br />
                        <i className="bi bi-droplet-fill me-2 text-danger"></i> {center.acceptedBloodGroups.join(", ")} <br />
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Get Directions
                        </a>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card>
          </div>

          <div className="mb-4">
            <h4 className={`text-center ${styles.sectionTitle}`}>
              <i className="bi bi-building me-2"></i>
              Available Donation Centers
            </h4>
          </div>
          
          <Row className="g-4">
            {loading && (
              <div className={styles.loadingContainer}>
                <Spinner animation="border" className={styles.spinner} />
                <p className="mt-3 text-muted">Finding nearby centers...</p>
              </div>
            )}
            
            {!loading && centers.length === 0 && (
              <div className={styles.noResults}>
                <i className="bi bi-exclamation-circle" style={{fontSize: '3rem', color: '#a0aec0'}}></i>
                <p className="mt-3">No centers found in this area. Try a different location.</p>
              </div>
            )}
            
            {centers.map((center) => (
              <Col lg={4} md={6} key={center.id}>
                <Card className={styles.centerCard}>
                  <Card.Header className={styles.cardHeader}>
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-building-fill me-2" style={{fontSize: '1.5rem'}}></i>
                      <h5 className="mb-0" style={{fontSize: '1.2rem'}}>
                        {center.name || 'Center Name'}
                      </h5>
                    </div>
                  </Card.Header>

                  <Card.Body className={styles.cardBody}>
                    <div className={styles.infoItem}>
                      <div className="d-flex align-items-start mb-2">
                        <i className={`bi bi-geo-alt-fill ${styles.infoIcon}`} style={{color: '#e53e3e'}}></i>
                        <div>
                          <small className="text-muted d-block">{center.address}</small>
                          <small className="text-primary fw-semibold">
                            {center.city} | {center.pincode}
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className="d-flex align-items-center mb-2">
                        <i className={`bi bi-telephone-fill ${styles.infoIcon}`} style={{color: '#38a169'}}></i>
                        <small className="text-dark fw-medium">{center.contactNumber}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className={`bi bi-clock-fill ${styles.infoIcon}`} style={{color: '#dd6b20'}}></i>
                        <small className="text-dark">{center.operatingHours}</small>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className="d-flex align-items-center mb-2">
                        <i className={`bi bi-droplet-fill ${styles.infoIcon}`} style={{color: '#e53e3e'}}></i>
                        <small className="text-muted">Accepted Blood Types:</small>
                      </div>
                      <div>
                        {center.acceptedBloodGroups.map((group, idx) => (
                          <span key={idx} className={styles.bloodBadge}>
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <Button
                        className={`${styles.actionButton} ${styles.bookButton}`}
                        onClick={() => navigate("/eligibility", { state: { centerId: center.id } })}
                      >
                        <i className="bi bi-calendar-plus me-2"></i>
                        BOOK APPOINTMENT
                      </Button>
                      <Button
                        className={`${styles.actionButton} ${styles.directionsButton}`}
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                        target="_blank"
                      >
                        <i className="bi bi-compass me-2"></i>
                        GET DIRECTIONS
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DonationCenters;