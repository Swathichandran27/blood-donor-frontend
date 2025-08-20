import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaClock,
  FaInfoCircle,
  FaSearch,
  FaTimes
} from "react-icons/fa";
import { motion } from "framer-motion";

const AdminDonationcamp = () => {
  const [camps, setCamps] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    location: "",
    contactInfo: "",
    date: "",
    time: "",
    latitude: "",
    longitude: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://blood-donor-backend-cibk.onrender.com/api/donationCamps");
      setCamps(response.data);
    } catch (err) {
      setError("Failed to fetch camps. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(`https://blood-donor-backend-cibk.onrender.com/api/donationCamps/${formData.id}`, formData);
      } else {
        await axios.post("https://blood-donor-backend-cibk.onrender.com/api/donationCamps", formData);
      }
      resetForm();
      fetchCamps();
    } catch (err) {
      setError("Failed to save camp. Please check your data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      description: "",
      location: "",
      contactInfo: "",
      date: "",
      time: "",
      latitude: "",
      longitude: ""
    });
    setIsEditing(false);
    setIsFormVisible(false);
  };

  const handleEdit = (camp) => {
    setFormData(camp);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camp?")) return;
    try {
      setLoading(true);
      await axios.delete(`https://blood-donor-backend-cibk.onrender.com/api/donationCamps/${id}`);
      fetchCamps();
    } catch (err) {
      setError("Failed to delete camp. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCamps = camps.filter(camp => 
    camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid g-0" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="row g-0">
        {/* Sidebar would go here */}
        <div className="col-md-12 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: '#dc3545' }}>
              <FaMapMarkerAlt className="me-2" /> Donation Camp Management
            </h2>
            <button 
              className="btn btn-danger d-flex align-items-center"
              onClick={() => {
                resetForm();
                setIsFormVisible(!isFormVisible);
              }}
            >
              {isFormVisible ? <FaTimes className="me-2" /> : <FaPlus className="me-2" />}
              {isFormVisible ? 'Close Form' : 'Add New Camp'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <FaInfoCircle className="me-2" />
              {error}
            </div>
          )}

          {/* Form Section */}
          {isFormVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card mb-4 shadow-sm border-0"
              style={{ borderRadius: '10px' }}
            >
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">
                  {isEditing ? 'Edit Camp Details' : 'Create New Camp'}
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Camp Title</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <FaInfoCircle />
                          </span>
                          <input 
                            type="text" 
                            name="title" 
                            className="form-control"
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Location</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <FaMapMarkerAlt />
                          </span>
                          <input 
                            type="text" 
                            name="location" 
                            className="form-control"
                            value={formData.location} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Contact Info</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <FaPhone />
                          </span>
                          <input 
                            type="text" 
                            name="contactInfo" 
                            className="form-control"
                            value={formData.contactInfo} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Date</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <FaCalendarAlt />
                          </span>
                          <input 
                            type="date" 
                            name="date" 
                            className="form-control"
                            value={formData.date} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Time</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <FaClock />
                          </span>
                          <input 
                            type="text" 
                            name="time" 
                            placeholder="e.g. 10:00 AM - 2:00 PM"
                            className="form-control" 
                            value={formData.time}
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Latitude</label>
                        <input 
                          type="number" 
                          step="any" 
                          name="latitude" 
                          className="form-control"
                          value={formData.latitude} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Longitude</label>
                        <input 
                          type="number" 
                          step="any" 
                          name="longitude" 
                          className="form-control"
                          value={formData.longitude} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea 
                          name="description" 
                          className="form-control"
                          rows="3"
                          value={formData.description} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-danger px-4 py-2 me-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : isEditing ? (
                        <FaEdit className="me-2" />
                      ) : (
                        <FaPlus className="me-2" />
                      )}
                      {isEditing ? 'Update Camp' : 'Add Camp'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary px-4 py-2"
                      onClick={resetForm}
                    >
                      <FaTimes className="me-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Search and Camp List */}
          <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title fw-bold mb-0">Donation Camps</h5>
                <div className="input-group" style={{ width: '300px' }}>
                  <span className="input-group-text bg-light">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search camps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading && camps.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading camps...</p>
                </div>
              ) : filteredCamps.length === 0 ? (
                <div className="text-center py-5">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
                    alt="No camps" 
                    style={{ width: '100px', opacity: 0.5, marginBottom: '20px' }}
                  />
                  <h5 className="text-muted">No camps found</h5>
                  <p className="text-muted">Try adding a new camp or adjusting your search</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead style={{ backgroundColor: '#dc3545', color: 'white' }}>
                      <tr>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Contact</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCamps.map((camp) => (
                        <motion.tr 
                          key={camp.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: 'rgba(220, 53, 69, 0.05)' }}
                        >
                          <td className="fw-bold">{camp.title}</td>
                          <td>
                            <FaMapMarkerAlt className="me-2 text-danger" />
                            {camp.location}
                          </td>
                          <td>{camp.date}</td>
                          <td>
                            <FaClock className="me-2 text-secondary" />
                            {camp.time}
                          </td>
                          <td>
                            <FaPhone className="me-2 text-primary" />
                            {camp.contactInfo}
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-warning me-2"
                              onClick={() => handleEdit(camp)}
                            >
                              <FaEdit className="me-1" /> Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(camp.id)}
                            >
                              <FaTrash className="me-1" /> Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDonationcamp;