import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUrgentRequest = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    quantityRequired: "",
    facilityName: "",
    location: "",
    contactInfo: "",
    requestDate: "",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/urgent-requests/all");
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching urgent requests:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/urgent-requests/add", formData);
      setFormData({
        bloodGroup: "",
        quantityRequired: "",
        facilityName: "",
        location: "",
        contactInfo: "",
        requestDate: "",
      });
      fetchRequests();
    } catch (error) {
      console.error("Error adding urgent request:", error);
    }
  };

  const markFulfilled = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/urgent-requests/fulfill/${id}`);
      fetchRequests();
    } catch (error) {
      console.error("Error marking fulfilled:", error);
    }
  };

  // Inline styles
  const containerStyle = { maxWidth: "1000px", margin: "30px auto", fontFamily: "'Segoe UI', sans-serif" };
  const cardStyle = { borderRadius: "12px", border: "1px solid #dee2e6", padding: "20px", marginBottom: "20px", background: "#fefefe", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
  const inputStyle = { width: "100%", padding: "6px 10px", borderRadius: "8px", border: "1px solid #ced4da", marginBottom: "10px" };
  const buttonStyle = { padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "500", backgroundColor: "#fa394d", color: "#fff" };
  const tableHeaderStyle = { backgroundColor: "#495057", color: "#fff" };
  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const thTdStyle = { border: "1px solid #dee2e6", padding: "8px", textAlign: "left" };

  return (
    <div style={containerStyle}>
      <h3 style={{ textAlign: "center", marginBottom: "25px" }}>Urgent Blood Requests</h3>

      {/* Add Request Form */}
      <div style={cardStyle}>
        <h5 style={{ marginBottom: "15px" }}>Add Urgent Request</h5>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <input type="text" name="bloodGroup" placeholder="Blood Group (e.g., A+)" value={formData.bloodGroup} onChange={handleInputChange} style={{ ...inputStyle, flex: "1 1 120px" }} required />
          <input type="number" name="quantityRequired" placeholder="Units" value={formData.quantityRequired} onChange={handleInputChange} style={{ ...inputStyle, flex: "1 1 80px" }} required />
          <input type="text" name="facilityName" placeholder="Facility Name" value={formData.facilityName} onChange={handleInputChange} style={{ ...inputStyle, flex: "1 1 200px" }} required />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} style={{ ...inputStyle, flex: "1 1 150px" }} required />
          <input type="text" name="contactInfo" placeholder="Contact Info" value={formData.contactInfo} onChange={handleInputChange} style={{ ...inputStyle, flex: "1 1 150px" }} required />
          <input type="date" name="requestDate" value={formData.requestDate} onChange={handleInputChange} style={{ ...inputStyle, flex: "1 1 150px" }} required />
          <button type="submit" style={{ ...buttonStyle, flex: "1 1 100px" }}>Add</button>
        </form>
      </div>

      {/* Requests List */}
      <div style={cardStyle}>
        <h5 style={{ marginBottom: "15px" }}>Active Requests</h5>
        <table style={tableStyle}>
          <thead style={tableHeaderStyle}>
            <tr>
              <th style={thTdStyle}>Blood Group</th>
              <th style={thTdStyle}>Units</th>
              <th style={thTdStyle}>Facility</th>
              <th style={thTdStyle}>Location</th>
              <th style={thTdStyle}>Contact</th>
              <th style={thTdStyle}>Request Date</th>
              <th style={thTdStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req.id}>
                  <td style={thTdStyle}>{req.bloodGroup}</td>
                  <td style={thTdStyle}>{req.quantityRequired}</td>
                  <td style={thTdStyle}>{req.facilityName}</td>
                  <td style={thTdStyle}>{req.location}</td>
                  <td style={thTdStyle}>{req.contactInfo}</td>
                  <td style={thTdStyle}>{req.requestDate}</td>
                  <td style={thTdStyle}>
                    <button style={{ ...buttonStyle, backgroundColor: "#28a745", padding: "4px 8px", fontSize: "0.9rem" }} onClick={() => markFulfilled(req.id)}>Mark Fulfilled</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "15px" }}>No active urgent requests</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUrgentRequest;
