import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import { FaTrophy, FaMedal, FaHeart, FaAward, FaDownload, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";

const Badges = () => {
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  // Get user data with better error handling
  const storedUserData = localStorage.getItem("user_data");
  const storedUser = storedUserData ? JSON.parse(storedUserData) : null;
  const userId = storedUser?.id;

  useEffect(() => {
    if (!userId) {
      setError("No user found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchGamification = async () => {
      try {
        setLoading(true);
        const response = await ApiService.authenticatedRequest(`/gamification/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setGamification(data);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error("Error fetching gamification:", err);
        setError("Failed to load achievements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGamification();
  }, [userId]);

  // Badge tier data
  const badgeTiers = [
    { name: "Bronze", threshold: 1, icon: <FaMedal className="text-bronze" />, color: "bronze" },
    { name: "Silver", threshold: 5, icon: <FaMedal className="text-silver" />, color: "silver" },
    { name: "Gold", threshold: 10, icon: <FaMedal className="text-gold" />, color: "gold" },
    { name: "Platinum", threshold: 20, icon: <FaAward className="text-platinum" />, color: "platinum" }
  ];

  // Determine current status
  const currentPoints = gamification?.totalPoints || 0;
  const donationCount = Math.floor(currentPoints / 10);
  const currentBadge = gamification?.badge || "New Donor";
  const currentLevel = gamification?.level || 1;
  const certificate = gamification?.certificate;

  // Calculate progress
  const currentTierIndex = badgeTiers.findIndex(tier => donationCount < tier.threshold);
  const nextTier = currentTierIndex === -1 ? null : badgeTiers[currentTierIndex];
  const currentTier = currentTierIndex === 0 ? null : badgeTiers[currentTierIndex - 1];
  
  const progressTarget = nextTier?.threshold || badgeTiers[badgeTiers.length - 1].threshold;
  const progressPercent = progressTarget > 0 
    ? Math.min((donationCount / progressTarget) * 100, 100) 
    : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (!userId) {
    return (
      <div className="container-fluid g-0 donor-dashboard">
        <div className="row g-0">
          <div className="col-md-2"><Sidebar /></div>
          <div className="col-md-10 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="alert alert-warning shadow-lg"
            >
              <h4 className="fw-bold">🔒 Authentication Required</h4>
              <p>Please log in to view your achievements and badges.</p>
              <a href="/login" className="btn btn-primary mt-2">
                Go to Login <FaArrowRight className="ms-2" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-fluid g-0 donor-dashboard">
        <div className="row g-0">
          <div className="col-md-2"><Sidebar /></div>
          <div className="col-md-10 p-4">
            <div className="text-center py-5">
              <div className="spinner-grow text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="mt-3 fw-bold">Loading Your Heroic Achievements...</h4>
              <p className="text-muted">Preparing your donor journey highlights</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid g-0 donor-dashboard">
        <div className="row g-0">
          <div className="col-md-2"><Sidebar /></div>
          <div className="col-md-10 p-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="alert alert-danger shadow-lg"
            >
              <h4 className="fw-bold">⚠️ Error Loading Achievements</h4>
              <p>{error}</p>
              <button 
                className="btn btn-outline-danger mt-2"
                onClick={() => window.location.reload()}
              >
                <span className="fw-bold">Retry</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid g-0 donor-dashboard">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-2">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="card shadow-lg border-0 p-4"
            style={{ borderRadius: '20px', background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)' }}
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h1 className="fw-bold text-danger mb-3">
                <FaHeart className="me-2" /> My Donor Journey
              </h1>
              <p className="lead text-muted">
                Every drop counts! Track your progress and unlock achievements.
              </p>
            </motion.div>

            {/* Current Status Card */}
            <motion.div 
              variants={itemVariants}
              className="card mb-4 border-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}
            >
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center">
                    <div className="position-relative d-inline-block">
                      {currentTier ? (
                        <>
                          <div className={`badge-icon bg-${currentTier.color}-light`}>
                            {currentTier.icon}
                          </div>
                          <div className="pulse-animation"></div>
                        </>
                      ) : (
                        <div className="badge-icon bg-primary-light">
                          <FaHeart className="text-danger" size={40} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h3 className="fw-bold">
                      Current Status: <span className={`text-${currentTier?.color || 'primary'}`}>
                        {currentBadge}
                      </span>
                    </h3>
                    <div className="d-flex align-items-center mb-2">
                      <div className="me-3">
                        <span className="badge bg-danger rounded-pill px-3 py-2">
                          Level {currentLevel}
                        </span>
                      </div>
                      <div>
                        <span className="badge bg-primary rounded-pill px-3 py-2">
                          {currentPoints} Hero Points
                        </span>
                      </div>
                    </div>
                    {certificate && (
                      <div className="mt-3">
                        <button className="btn btn-success">
                          <FaDownload className="me-2" /> Download Certificate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div variants={itemVariants} className="mb-5">
              <div className="d-flex justify-content-between mb-2">
                <h5 className="fw-bold">Journey to Next Tier</h5>
                <span className="text-muted">
                  {donationCount} / {progressTarget} donations
                </span>
              </div>
              <div className="progress" style={{ height: "20px", borderRadius: "10px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ 
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, var(--bs-${nextTier?.color || 'success'}), var(--bs-${nextTier?.color || 'success'}-dark))`,
                    borderRadius: "10px"
                  }}
                  aria-valuenow={progressPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span className="fw-bold">{Math.floor(progressPercent)}%</span>
                </div>
              </div>
              <div className="text-center mt-2">
                {nextTier ? (
                  <p className="text-muted">
                    <span className="fw-bold">{progressTarget - donationCount}</span> more donations to reach{' '}
                    <span className={`text-${nextTier.color} fw-bold`}>{nextTier.name} Tier</span>
                  </p>
                ) : (
                  <p className="text-success fw-bold">
                    🎉 You've reached the highest tier! Keep donating to maintain your status.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Badge Tiers */}
            <motion.div variants={itemVariants} className="mb-5">
              <h4 className="fw-bold mb-4 text-center">Badge Tiers</h4>
              <div className="row g-4">
                {badgeTiers.map((tier, index) => (
                  <div key={tier.name} className="col-md-3">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className={`card h-100 border-0 shadow-sm tier-card ${donationCount >= tier.threshold ? 'unlocked' : 'locked'}`}
                    >
                      <div className="card-body text-center p-4">
                        <div className={`tier-icon bg-${tier.color}-light mb-3`}>
                          {tier.icon}
                          {donationCount >= tier.threshold && (
                            <div className="unlocked-badge">✓</div>
                          )}
                        </div>
                        <h5 className={`fw-bold text-${tier.color}`}>{tier.name}</h5>
                        <p className="text-muted">{tier.threshold}+ donations</p>
                        {donationCount >= tier.threshold ? (
                          <span className="badge bg-success">Unlocked</span>
                        ) : (
                          <span className="badge bg-secondary">Locked</span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              variants={itemVariants}
              className="text-center mt-5"
            >
              
              <button className="btn btn-danger btn-lg px-5 py-3 fw-bold" onClick={() => navigate("/eligibility")}>
                <FaHeart className="me-2" /> Schedule Next Donation
              </button>
              <p className="text-muted mt-3">
                Every donation helps save up to 3 lives!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Add these styles */}
      <style jsx>{`
        :root {
          --bs-bronze: #cd7f32;
          --bs-bronze-light: #f8e9d9;
          --bs-bronze-dark: #a6692a;
          --bs-silver: #c0c0c0;
          --bs-silver-light: #f5f5f5;
          --bs-silver-dark: #a8a8a8;
          --bs-gold: #ffd700;
          --bs-gold-light: #fff9e6;
          --bs-gold-dark: #e6c200;
          --bs-platinum: #e5e4e2;
          --bs-platinum-light: #f8f8f8;
          --bs-platinum-dark: #d0d0d0;
        }
        
        .text-bronze { color: var(--bs-bronze); }
        .text-silver { color: var(--bs-silver); }
        .text-gold { color: var(--bs-gold); }
        .text-platinum { color: var(--bs-platinum); }
        
        .bg-bronze-light { background-color: var(--bs-bronze-light); }
        .bg-silver-light { background-color: var(--bs-silver-light); }
        .bg-gold-light { background-color: var(--bs-gold-light); }
        .bg-platinum-light { background-color: var(--bs-platinum-light); }
        
        .badge-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          position: relative;
        }
        
        .pulse-animation {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 2px solid;
          border-radius: 50%;
          animation: pulse 2s infinite;
          opacity: 0;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        
        .tier-card {
          transition: all 0.3s ease;
          border: 2px solid transparent !important;
        }
        
        .tier-card.unlocked {
          border-color: var(--bs-success) !important;
        }
        
        .tier-card.locked {
          opacity: 0.7;
        }
        
        .tier-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          position: relative;
        }
        
        .unlocked-badge {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 25px;
          height: 25px;
          background-color: var(--bs-success);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Badges;