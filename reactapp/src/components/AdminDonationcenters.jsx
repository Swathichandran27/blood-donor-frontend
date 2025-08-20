import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../services/AuthService";
import { FiEdit2, FiMapPin, FiPhone, FiClock, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminDonationcenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    city: "",
    pincode: "",
    address: "",
    contactNumber: "",
    operatingHours: "",
    latitude: "",
    longitude: "",
    acceptedBloodGroups: [],
  });
  const [editing, setEditing] = useState(false);
  const [expandedCenter, setExpandedCenter] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = authService.getToken();

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://blood-donor-backend-cibk.onrender.com/api/donationCenters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCenters(res.data);
      toast.success("Donation centers loaded successfully");
    } catch (err) {
      setError("Failed to fetch donation centers");
      toast.error("Failed to load donation centers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "acceptedBloodGroups") {
      setForm({ ...form, [name]: value.split(",").map(bg => bg.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`https://blood-donor-backend-cibk.onrender.com/api/donationCenters/${form.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Donation center updated successfully");
      } else {
        await axios.post(`https://blood-donor-backend-cibk.onrender.com/api/donationCenters`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Donation center added successfully");
      }
      resetForm();
      fetchCenters();
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save donation center");
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      city: "",
      pincode: "",
      address: "",
      contactNumber: "",
      operatingHours: "",
      latitude: "",
      longitude: "",
      acceptedBloodGroups: [],
    });
    setEditing(false);
  };

  const handleEdit = (center) => {
    setForm({
      id: center.id,
      name: center.name,
      city: center.city,
      pincode: center.pincode,
      address: center.address,
      contactNumber: center.contactNumber,
      operatingHours: center.operatingHours,
      latitude: center.latitude,
      longitude: center.longitude,
      acceptedBloodGroups: center.acceptedBloodGroups,
    });
    setEditing(true);
    setShowForm(true);
  };

  const toggleExpandCenter = (id) => {
    setExpandedCenter(expandedCenter === id ? null : id);
  };

  const filteredCenters = centers.filter(center => 
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.pincode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Inline styles
  const containerStyle = { maxWidth: "900px", margin: "30px auto", fontFamily: "'Segoe UI', sans-serif" };
  const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
  const cardStyle = { borderRadius: "12px", border: "1px solid #dee2e6", marginBottom: "20px", padding: "15px", background: "#fefefe" };
  const cardHeaderStyle = { fontWeight: "600", fontSize: "1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" };
  const formInputStyle = { width: "100%", padding: "6px 10px", borderRadius: "8px", border: "1px solid #ced4da", marginBottom: "10px" };
  const buttonStyle = { padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", marginRight: "8px", fontWeight: "500" };
  const primaryBtn = { ...buttonStyle, background: "#495057", color: "#fff" };
  const secondaryBtn = { ...buttonStyle, background: "#ced4da", color: "#212529" };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ fontSize: '1.2rem' }}>Loading...</div>
    </div>
  );

  if (error) return (
    <div style={{ padding: "10px", color: "red", textAlign: "center" }}>{error}</div>
  );

  return (
    <div style={containerStyle}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={headerStyle}>
        <h2 style={{ display: "flex", alignItems: "center" }}>
          <FiMapPin style={{ marginRight: "8px" }} /> Donation Centers Management
        </h2>
        <button style={primaryBtn} onClick={() => setShowForm(!showForm)}>
          <FiPlus style={{ marginRight: "5px" }} /> {showForm ? "Close Form" : "Add Center"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ ...cardStyle, border: editing ? "2px solid #495057" : "1px solid #dee2e6" }}>
          <h4 style={{ marginBottom: "15px" }}>
            {editing ? <><FiEdit2 style={{ marginRight: "5px" }} /> Editing Center: {form.name}</> : "Add New Donation Center"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <input type="text" name="name" placeholder="Center Name*" value={form.name} onChange={handleChange} style={formInputStyle} required />
              <input type="text" name="city" placeholder="City*" value={form.city} onChange={handleChange} style={formInputStyle} required />
              <input type="text" name="pincode" placeholder="Pincode*" value={form.pincode} onChange={handleChange} style={formInputStyle} required />
              <input type="text" name="address" placeholder="Full Address" value={form.address} onChange={handleChange} style={formInputStyle} />
              <input type="text" name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} style={formInputStyle} />
              <input type="text" name="operatingHours" placeholder="Operating Hours" value={form.operatingHours} onChange={handleChange} style={formInputStyle} />
              <input type="text" name="acceptedBloodGroups" placeholder="Accepted Blood Groups (A+, B-, ...)" value={form.acceptedBloodGroups.join(", ")} onChange={handleChange} style={formInputStyle} />
              <input type="number" step="0.000001" name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} style={formInputStyle} />
              <input type="number" step="0.000001" name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} style={formInputStyle} />
            </div>
            <div style={{ marginTop: "15px" }}>
              <button type="submit" style={primaryBtn}>{editing ? "Update Center" : "Add Center"}</button>
              {editing && <button type="button" style={secondaryBtn} onClick={() => { resetForm(); setShowForm(false); }}><FiX style={{ marginRight: "5px" }} /> Cancel</button>}
            </div>
          </form>
        </div>
      )}

      {/* Centers List */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <h5 style={{ display: "flex", alignItems: "center" }}><FiMapPin style={{ marginRight: "5px" }} /> Existing Donation Centers ({centers.length})</h5>
          <input type="text" placeholder="Search centers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...formInputStyle, width: "200px" }} />
        </div>
        <div>
          {filteredCenters.length > 0 ? filteredCenters.map(center => (
            <div key={center.id} style={{ ...cardStyle, marginBottom: "10px", cursor: "pointer", background: expandedCenter === center.id ? "#f1f3f5" : "#fefefe" }}>
              <div style={cardHeaderStyle} onClick={() => toggleExpandCenter(center.id)}>
                <div>
                  <h6>{center.name}</h6>
                  <small style={{ color: "#6c757d" }}>{center.city}, {center.pincode}</small>
                </div>
                <button style={{ ...secondaryBtn, padding: "4px 8px" }} onClick={(e) => { e.stopPropagation(); handleEdit(center); }}><FiEdit2 size={14} /></button>
              </div>
              {expandedCenter === center.id && (
                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #dee2e6" }}>
                  <p><strong>Address:</strong> {center.address || "Not specified"}</p>
                  <p><strong><FiPhone style={{ marginRight: "5px" }} /> Contact:</strong> {center.contactNumber || "Not specified"}</p>
                  <p><strong><FiClock style={{ marginRight: "5px" }} /> Hours:</strong> {center.operatingHours || "Not specified"}</p>
                  <p><strong>Coordinates:</strong> {center.latitude && center.longitude ? <a href={`https://www.google.com/maps?q=${center.latitude},${center.longitude}`} target="_blank" rel="noopener noreferrer">View on Map</a> : " Not specified"}</p>
                  <p><strong>Blood Groups Accepted:</strong> {center.acceptedBloodGroups?.length > 0 ? center.acceptedBloodGroups.join(", ") : " All groups accepted"}</p>
                </div>
              )}
            </div>
          )) : <p style={{ textAlign: "center", padding: "20px" }}>No donation centers found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDonationcenters;
