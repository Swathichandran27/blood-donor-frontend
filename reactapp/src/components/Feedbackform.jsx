import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaArrowLeft, FaHeartbeat, FaSyringe } from "react-icons/fa";
import authService from "../services/AuthService";

const FeedbackForm = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: "",
    reportedAdverseReaction: false,
    adverseReactionDetails: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedback({
      ...feedback,
      [name]: type === "checkbox" ? checked : value,
    });
  };
   
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Get auth headers from your AuthService
    const headers = {
      "Content-Type": "application/json",
      ...authService.getAuthHeaders()
    };

    await axios.post(
      `http://localhost:8080/feedbacks/${appointmentId}`,
      feedback,
      { headers }
    );
    alert("Feedback submitted successfully!");
    navigate("/manage-appointments");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    if (error.response?.status === 401) {
      authService.removeToken();
      navigate("/login");
    } else {
      alert("Failed to submit feedback!");
    }
  }
};


  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm" style={{ 
            borderTop: "4px solid #c00",
            borderRadius: "0 0 8px 8px"
          }}>
            <div className="card-header py-3" style={{ 
              background: "linear-gradient(135deg, #fff 0%, #ffecec 100%)",
              borderBottom: "1px solid #ffdddd"
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  onClick={() => navigate(-1)} 
                  className="btn btn-sm"
                  style={{
                    background: "#c00",
                    color: "white",
                    fontWeight: "500"
                  }}
                >
                  <FaArrowLeft className="me-1" /> Back
                </button>
                <h4 className="mb-0 text-center flex-grow-1" style={{ color: "#900" }}>
                  <FaHeartbeat className="me-2" style={{ color: "#c00" }} />
                  Donation Feedback
                  <FaSyringe className="ms-2" style={{ color: "#c00" }} />
                </h4>
              </div>
            </div>
            
            <div className="card-body p-4" style={{ background: "#fffafa" }}>
              <h5 className="card-title text-center mb-4" style={{ color: "#900" }}>
                Share your donation experience #{appointmentId}
              </h5>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: "#900" }}>
                    How was your experience?
                  </label>
                  <div className="d-flex align-items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <React.Fragment key={star}>
                        <input
                          type="radio"
                          id={`star-${star}`}
                          name="rating"
                          value={star}
                          checked={parseInt(feedback.rating) === star}
                          onChange={handleChange}
                          className="d-none"
                        />
                        <label
                          htmlFor={`star-${star}`}
                          className="fs-2 mx-1"
                          style={{ 
                            cursor: "pointer", 
                            color: parseInt(feedback.rating) >= star ? "#c00" : "#e0b7b7",
                            transition: "color 0.2s",
                            textShadow: parseInt(feedback.rating) >= star ? "0 0 2px rgba(204,0,0,0.3)" : "none"
                          }}
                        >
                          <FaStar />
                        </label>
                      </React.Fragment>
                    ))}
                    <span className="ms-2 fs-5" style={{ color: "#600" }}>
                      {feedback.rating} {feedback.rating === 1 ? "star" : "stars"}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="comment" className="form-label fw-bold" style={{ color: "#900" }}>
                    Tell us more
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    className="form-control"
                    rows="4"
                    value={feedback.comment}
                    onChange={handleChange}
                    required
                    placeholder="How did your donation process go?"
                    style={{ 
                      minHeight: "120px",
                      borderColor: "#d99",
                      background: "#fff",
                      borderRadius: "6px"
                    }}
                  />
                </div>

                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="reportedAdverseReaction"
                    name="reportedAdverseReaction"
                    checked={feedback.reportedAdverseReaction}
                    onChange={handleChange}
                    style={{ 
                      width: "1.2em", 
                      height: "1.2em", 
                      marginTop: "0.2em",
                      borderColor: "#900",
                      accentColor: "#c00"
                    }}
                  />
                  <label 
                    htmlFor="reportedAdverseReaction" 
                    className="form-check-label fw-bold ms-2"
                    style={{ color: "#900" }}
                  >
                    Did you experience any side effects?
                  </label>
                </div>

                {feedback.reportedAdverseReaction && (
                  <div className="mb-4" style={{ animation: "fadeIn 0.3s ease-in" }}>
                    <label htmlFor="adverseReactionDetails" className="form-label fw-bold" style={{ color: "#900" }}>
                      Please describe the side effects
                    </label>
                    <textarea
                      id="adverseReactionDetails"
                      name="adverseReactionDetails"
                      className="form-control"
                      rows="3"
                      value={feedback.adverseReactionDetails}
                      onChange={handleChange}
                      required
                      placeholder="Describe any symptoms you experienced..."
                      style={{ 
                        borderColor: "#d99",
                        background: "#fff",
                        borderRadius: "6px"
                      }}
                    />
                    <small className="text-muted" style={{ color: "#a66" }}>
                      This helps us improve donor safety
                    </small>
                  </div>
                )}

                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-lg fw-bold py-2"
                    style={{ 
                      background: "linear-gradient(135deg, #c00 0%, #900 100%)",
                      color: "white",
                      letterSpacing: "0.5px",
                      border: "none",
                      borderRadius: "6px",
                      boxShadow: "0 2px 4px rgba(153,0,0,0.2)"
                    }}
                  >
                    Submit Your Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            body {
              background-color: #fff5f5;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;