import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaVenusMars, FaCalendarAlt, FaTint, FaMapMarkerAlt, FaPhone, FaIdCard } from 'react-icons/fa';
import AuthService from '../services/AuthService';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
    phone: '',
    referredBy: '',
     role: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      if (dob > minAgeDate) newErrors.dateOfBirth = 'You must be at least 18 years old';
    }
    
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.address) newErrors.address = 'Address is required';
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, server: null }));

    try {
      const result = await AuthService.register(formData);

      if (result.success) {
        setRegistrationSuccess(true);
        setTimeout(() => navigate('/donor/dashboard'), 2000);
      } else {
        setErrors(prev => ({
          ...prev,
          email: result.error.includes('Email already') ? 'Email already registered' : prev.email,
          server: !result.error.includes('Email already') ? result.error : null
        }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, server: 'Registration failed. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="container py-5">
        <div className="alert alert-success text-center">
          <h2>Registration Successful!</h2>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center text-danger mb-3">Become a Blood Donor</h2>
              <p className="text-center mb-4">Join our community of life-savers</p>
              {errors.server && <div className="alert alert-danger">{errors.server}</div>}

              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label"><FaUser className="me-2" /> Full Name</label>
                  <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name"/>
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label"><FaEnvelope className="me-2" /> Email</label>
                  <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email"/>
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label"><FaLock className="me-2" /> Password</label>
                  <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters"/>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label"><FaLock className="me-2" /> Confirm Password</label>
                  <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password"/>
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                {/* Gender */}
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label"><FaVenusMars className="me-2" /> Gender</label>
                  <select className={`form-select ${errors.gender ? 'is-invalid' : ''}`} id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>

                {/* Date of Birth */}
                <div className="mb-3">
                  <label htmlFor="dateOfBirth" className="form-label"><FaCalendarAlt className="me-2" /> Date of Birth</label>
                  <input type="date" className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`} id="dateOfBirth" name="dateOfBirth"
                    value={formData.dateOfBirth} onChange={handleChange} max={new Date().toISOString().split('T')[0]}/>
                  {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                </div>

                {/* Blood Group */}
                <div className="mb-3">
                  <label htmlFor="bloodGroup" className="form-label"><FaTint className="me-2" /> Blood Group</label>
                  <select className={`form-select ${errors.bloodGroup ? 'is-invalid' : ''}`} id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  {errors.bloodGroup && <div className="invalid-feedback">{errors.bloodGroup}</div>}
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label htmlFor="address" className="form-label"><FaMapMarkerAlt className="me-2" /> Address</label>
                  <textarea className={`form-control ${errors.address ? 'is-invalid' : ''}`} id="address" name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Enter your address"/>
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label"><FaPhone className="me-2" /> Phone Number</label>
                  <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit phone"/>
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                {/* Referral */}
                <div className="mb-3">
                  <label htmlFor="referredBy" className="form-label"><FaIdCard className="me-2" /> Referral Code (Optional)</label>
                  <input type="text" className="form-control" id="referredBy" name="referredBy" value={formData.referredBy} onChange={handleChange} placeholder="Referral code"/>
                </div>

                {/* Role */}
<div className="mb-3">
  <label htmlFor="role" className="form-label"><FaUser className="me-2" /> Role</label>
  <select
    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
    id="role"
    name="role"
    value={formData.role}
    onChange={handleChange}
  >
    <option value="">Select Role</option>
    <option value="DONOR">Donor</option>
    <option value="ADMIN">Admin</option>
  </select>
  {errors.role && <div className="invalid-feedback">{errors.role}</div>}
</div>


                <div className="d-grid mb-3">
                  <button type="submit" disabled={isSubmitting} className="btn btn-danger btn-lg">{isSubmitting ? 'Registering...' : 'Register as Donor'}</button>
                </div>

                <p className="text-center">Already have an account? <Link to="/login" className="text-danger">Log in</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
