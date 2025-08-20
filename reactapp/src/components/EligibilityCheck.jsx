import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import authService from "../services/AuthService"; // ✅ use AuthService
import axios from "axios";

const EligibilityCheck = () => {
  const [formData, setFormData] = useState({
    traveledRecently: false,
    hasChronicIllness: false,
    onMedication: false,
    underweight: false,
    hadSurgeryRecently: false,
  });
  const [result, setResult] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { centerId } = location.state || {};

  // 👇 get logged in user from AuthService
  const storedUser = authService.getUserData();
  const userId = storedUser?.id;

  const handlePass = () => {
    navigate("/book-appointment", { state: { centerId } });
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userId) {
      setResult("You must be logged in to check eligibility.");
      setIsEligible(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://blood-donor-backend-cibk.onrender.com/api/users/eligibility-check`, // ✅ tie check to logged-in user
        formData,
        {
          headers: authService.getAuthHeaders(), // ✅ attach token
        }
      );

      const data = response.data;
      setResult(data);

      if (typeof data === "string" && data.toLowerCase().includes("eligible")) {
        setIsEligible(true);
      } else {
        setIsEligible(false);
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      if (error.response?.status === 401) {
        authService.removeToken(); // clear expired token
        navigate("/login"); // redirect
      }
      setResult("Error checking eligibility. Please try again.");
      setIsEligible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      traveledRecently: false,
      hasChronicIllness: false,
      onMedication: false,
      underweight: false,
      hadSurgeryRecently: false,
    });
    setResult(null);
    setIsEligible(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <button onClick={() => navigate(-1)} className="btn btn-outline-danger mb-3">
            <FaArrowLeft className="me-2" /> Back
          </button>

          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center text-danger mb-3">
                Blood Donation Eligibility Check
              </h2>
              <p className="text-center mb-4 text-muted">
                Answer these questions to check if you're eligible to donate blood today.
              </p>

              {result ? (
                <div
                  className={`alert ${
                    isEligible ? "alert-success" : "alert-danger"
                  } text-center`}
                >
                  <h4 className="mb-3">
                    {isEligible ? (
                      <FaCheck className="me-2" />
                    ) : (
                      <FaTimes className="me-2" />
                    )}
                    {result}
                  </h4>
                  <p className="small text-muted">
                    Note: This is a preliminary check. A final medical screening will be conducted
                    at the donation center.
                  </p>

                  {isEligible && (
                    <button
                      onClick={handlePass}
                      className="btn btn-danger w-100 mb-2"
                    >
                      Proceed to Book Appointment
                    </button>
                  )}

                  <button onClick={resetForm} className="btn btn-outline-danger w-100">
                    Check Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {Object.keys(formData).map((key) => (
                    <div className="form-check mb-3" key={key}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={key}
                        name={key}
                        checked={formData[key]}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {key === "traveledRecently" &&
                          "Have you traveled outside the country in the last 3 months?"}
                        {key === "hasChronicIllness" &&
                          "Do you have any chronic illness (e.g., diabetes, heart disease)?"}
                        {key === "onMedication" &&
                          "Are you currently taking any medications?"}
                        {key === "underweight" &&
                          "Is your weight below 50 kg (110 lbs)?"}
                        {key === "hadSurgeryRecently" &&
                          "Have you had surgery in the last 6 months?"}
                      </label>
                    </div>
                  ))}

                  <div className="d-grid">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-danger btn-lg"
                    >
                      {isLoading ? "Checking..." : "Check Eligibility"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityCheck;
