import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaTint, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import authService from '../services/AuthService';

const Appointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCenterId = location.state?.centerId || ''; // get from navigation

  const [centers, setCenters] = useState([]);
  const [formData, setFormData] = useState({
    centerId: passedCenterId, // prefill if available
    appointmentDate: '',
    appointmentTime: '',
    donationType: '',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get('https://blood-donor-backend-cibk.onrender.com/api/donationCenters');
        setCenters(res.data);
      } catch {
        setErrors(prev => ({ ...prev, centers: 'Failed to load centers' }));
      }
    };
    fetchCenters();
  }, []);

  // Fetch available slots when centerId & date are selected
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.centerId || !formData.appointmentDate) {
        setAvailableSlots([]);
        return;
      }
      try {
        const res = await axios.get("https://blood-donor-backend-cibk.onrender.com/api/appointments/available-slots", {
          params: {
            centerId: Number(formData.centerId),
            date: formData.appointmentDate
          },
          headers: {
            Authorization: `Bearer ${authService.getToken()}`
          }
        });
        setAvailableSlots(res.data);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setAvailableSlots([]);
      }
    };

    fetchSlots();
  }, [formData.centerId, formData.appointmentDate]); // run only when these change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.centerId) newErrors.centerId = 'Please select a donation center';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Please select a date';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Please select a time';
    if (!formData.donationType) newErrors.donationType = 'Please select donation type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);
  setSuccessMsg('');
  setErrors({});

  try {
    const user = authService.getUserData();
    const userId = user?.id;

    if (!userId) {
      setErrors(prev => ({
        ...prev,
        server: 'User not logged in or ID missing'
      }));
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      userId: Number(userId),
      appointmentDate: formData.appointmentDate, // yyyy-MM-dd
      appointmentTime: formData.appointmentTime  // HH:mm
    };

    // ✅ Use await instead of then/catch mixing
    const res = await axios.post(
      "https://blood-donor-backend-cibk.onrender.com/api/appointments/book",
      payload,
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`
        }
      }
    );

    if (res.status === 200) {
      setSuccessMsg('✅ Appointment booked successfully!');
      setFormData({
        centerId: '',
        appointmentDate: '',
        appointmentTime: '',
        donationType: ''
      });
      setAvailableSlots([]);
      setTimeout(() => navigate('/manage-appointments'), 2000);
    }

  } catch (err) {
    let message = 'Failed to book appointment';
    if (err.response?.data) {
      if (typeof err.response.data === 'string') message = err.response.data;
      else if (err.response.data.message) message = err.response.data.message;
      else message = JSON.stringify(err.response.data);
    }
    setErrors(prev => ({ ...prev, server: message }));
    console.error('Booking error:', err.response?.data || err);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center text-danger mb-3">
                <FaCalendarAlt className="me-2" />Book Blood Donation Appointment
              </h2>
              {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}
              {errors.server && <div className="alert alert-danger text-center">{errors.server}</div>}

              <form onSubmit={handleSubmit} noValidate>
                {/* Donation Center */}
                <div className="mb-3">
                  <label htmlFor="centerId" className="form-label">
                    <FaMapMarkerAlt className="me-2" />Donation Center
                  </label>
                  <select
                    className={`form-select ${errors.centerId ? 'is-invalid' : ''}`}
                    id="centerId"
                    name="centerId"
                    value={formData.centerId}
                    onChange={handleChange}
                  >
                    <option value="">Select a center</option>
                    {centers.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name} ({center.city})
                      </option>
                    ))}
                  </select>
                  {errors.centerId && <div className="invalid-feedback">{errors.centerId}</div>}
                </div>

                {/* Date */}
                <div className="mb-3">
                  <label htmlFor="appointmentDate" className="form-label">
                    <FaCalendarAlt className="me-2" />Date
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.appointmentDate ? 'is-invalid' : ''}`}
                    id="appointmentDate"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.appointmentDate && <div className="invalid-feedback">{errors.appointmentDate}</div>}
                </div>

                {/* Time */}
                <div className="mb-3">
                  <label htmlFor="appointmentTime" className="form-label">
                    <FaClock className="me-2" />Time
                  </label>
                  <select
                    className={`form-select ${errors.appointmentTime ? 'is-invalid' : ''}`}
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    disabled={!availableSlots.length}
                  >
                    <option value="">Select a time</option>
                    {availableSlots.map((time, idx) => (
                      <option key={idx} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.appointmentTime && <div className="invalid-feedback">{errors.appointmentTime}</div>}
                </div>

                {/* Donation Type */}
                <div className="mb-3">
                  <label htmlFor="donationType" className="form-label">
                    <FaTint className="me-2" />Donation Type
                  </label>
                  <select
                    className={`form-select ${errors.donationType ? 'is-invalid' : ''}`}
                    id="donationType"
                    name="donationType"
                    value={formData.donationType}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="Plasma">Plasma</option>
                    <option value="Platelets">Platelets</option>
                  </select>
                  {errors.donationType && <div className="invalid-feedback">{errors.donationType}</div>}
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-danger btn-lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
                <div className="text-center">
                  <button type="button" className="btn btn-link text-danger" onClick={() => navigate('/donor/dashboard')}>
                    Cancel and return home
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
