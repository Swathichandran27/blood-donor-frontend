import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminResources = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "Article"
  });

  const [resources, setResources] = useState([]);

  // Fetch existing resources
  useEffect(() => {
    axios.get("https://blood-donor-backend-cibk.onrender.com/api/resources")
      .then((res) => setResources(res.data))
      .catch((err) => console.error("Error fetching resources", err));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new resource
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://blood-donor-backend-cibk.onrender.com/api/resources/add", formData)
      .then((res) => {
        setResources([...resources, res.data]);
        setFormData({ title: "", content: "", type: "Article" });
      })
      .catch((err) => console.error("Error adding resource", err));
  };

  // Inline styles
  const containerStyle = { maxWidth: "900px", margin: "30px auto", fontFamily: "'Segoe UI', sans-serif" };
  const cardStyle = { borderRadius: "12px", border: "1px solid #dee2e6", padding: "20px", marginBottom: "20px", background: "#fefefe", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
  const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ced4da", marginBottom: "12px", fontSize: "0.95rem" };
  const buttonStyle = { padding: "8px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "500", backgroundColor: "#fa394d", color: "#fff" };
  const badgeStyle = { backgroundColor: "#6c757d", color: "#fff", borderRadius: "6px", padding: "2px 8px", fontSize: "0.75rem", marginLeft: "8px" };
  const listItemStyle = { padding: "12px 15px", borderBottom: "1px solid #dee2e6", borderRadius: "8px", marginBottom: "10px", background: "#f9f9f9" };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>📚 Manage Resources</h2>

      {/* Add Resource Form */}
      <div style={cardStyle}>
        <h5 style={{ marginBottom: "15px" }}>Add New Resource</h5>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <textarea
            name="content"
            rows="4"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={inputStyle}
          >
            <option>Article</option>
            <option>Guide</option>
            <option>FAQ</option>
            <option>Video</option>
          </select>
          <button type="submit" style={buttonStyle}>➕ Add Resource</button>
        </form>
      </div>

      {/* List of Resources */}
      <div style={cardStyle}>
        <h5 style={{ marginBottom: "15px" }}>Existing Resources</h5>
        {resources.length === 0 ? (
          <p style={{ color: "#6c757d" }}>No resources available.</p>
        ) : (
          <div>
            {resources.map((res) => (
              <div key={res.id} style={listItemStyle}>
                <h6>{res.title} <span style={badgeStyle}>{res.type}</span></h6>
                <p>{res.content.length > 120 ? res.content.substring(0, 120) + "..." : res.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResources;
