import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../services/AuthService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", email: "", role: "" });

  const token = authService.getToken();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://blood-donor-backend-cibk.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`https://blood-donor-backend-cibk.onrender.com/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert("Failed to delete user.");
    }
  };

  const startEdit = (user) => {
    setEditingUser(user.id);
    setFormData({ fullName: user.fullName, email: user.email, role: user.role });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ fullName: "", email: "", role: "" });
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`https://blood-donor-backend-cibk.onrender.com/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.map(u => u.id === id ? response.data : u));
      cancelEdit();
    } catch {
      alert("Failed to update user.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading users...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  // Inline styles
  const containerStyle = {
    maxWidth: "900px",
    margin: "30px auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };
  const headerStyle = { textAlign: "center", color: "#dc3545", marginBottom: "25px" };
  const tableStyle = { width: "100%", borderCollapse: "separate", borderSpacing: 0 };
  const thStyle = { padding: "12px 15px", backgroundColor: "#f8f9fa", color: "#495057", textAlign: "left" };
  const tdStyle = { padding: "12px 15px", borderBottom: "1px solid #dee2e6", textAlign: "left" };
  const inputStyle = { padding: "6px 10px", borderRadius: "8px", border: "1px solid #ced4da", outline: "none", width: "100%" };
  const selectStyle = { ...inputStyle };
  const btnStyle = { padding: "5px 12px", border: "none", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer", marginRight: "5px" };

  const getBtnStyle = (type) => {
    switch (type) {
      case "edit": return { ...btnStyle, backgroundColor: "#6c757d", color: "#fff" };
      case "save": return { ...btnStyle, backgroundColor: "#28a745", color: "#fff" };
      case "cancel": return { ...btnStyle, backgroundColor: "#adb5bd", color: "#fff" };
      case "delete": return { ...btnStyle, backgroundColor: "#dc3545", color: "#fff" };
      default: return btnStyle;
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>Manage Users</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ backgroundColor: editingUser === user.id ? "#f1f3f5" : "transparent" }}>
              <td style={tdStyle}>{user.id}</td>
              <td style={tdStyle}>
                {editingUser === user.id ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={inputStyle}
                  />
                ) : (
                  user.fullName
                )}
              </td>
              <td style={tdStyle}>
                {editingUser === user.id ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td style={tdStyle}>
                {editingUser === user.id ? (
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={selectStyle}
                  >
                    <option value="DONOR">DONOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td style={tdStyle}>
                {editingUser === user.id ? (
                  <>
                    <button style={getBtnStyle("save")} onClick={() => saveEdit(user.id)}>Save</button>
                    <button style={getBtnStyle("cancel")} onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button style={getBtnStyle("edit")} onClick={() => startEdit(user)}>Edit</button>
                    <button style={getBtnStyle("delete")} onClick={() => deleteUser(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
