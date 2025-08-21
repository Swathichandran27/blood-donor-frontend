import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaHeart } from 'react-icons/fa';
import AuthService from '../services/AuthService';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setLoginError('');

    try {
      const result = await AuthService.login(formData.email, formData.password);
      if (result.success) {
        const user = result.data.user;
        navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/donor/dashboard');
      } else {
        setLoginError(result.error);
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row shadow-lg rounded-4 overflow-hidden mx-auto" style={{ maxWidth: '900px' }}>
          
          {/* Left: Image */}
          <div className="col-lg-6 d-none d-lg-flex p-0">
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: '500px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img
                src="https://plus.unsplash.com/premium_photo-1685141420004-1b13a03c54ca?w=600&auto=format&fit=crop&q=60"
                className="w-100 h-100"
                style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                alt="Blood donation"
              />
            </div>
          </div>
          
          {/* Right: Form */}
          <div className="col-lg-6 bg-white p-4">
            <div className="d-flex flex-column justify-content-center h-100">
              <div className="text-center mb-4">
                <FaHeart className="text-danger" size={48} />
                <h2 className="mt-3 fw-bold">BloodConnect Donor Portal</h2>
                <p className="text-muted">Sign in to manage your donations and save lives</p>
              </div>

              {loginError && (
                <div className="alert alert-danger" role="alert">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaEnvelope /></span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaLock /></span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="text-danger text-decoration-none">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-danger w-100 d-flex align-items-center justify-content-center py-2"
                >
                  {isLoading ? 'Signing in...' : <><FaSignInAlt className="me-2" /> Sign in</>}
                </button>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-2 text-muted">New to BloodLife?</p>
                <Link to="/register" className="btn btn-outline-secondary">
                  Create a donor account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
