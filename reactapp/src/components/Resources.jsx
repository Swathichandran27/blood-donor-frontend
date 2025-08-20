import React, { useEffect, useState } from "react";
import { 
  FaVideo, 
  FaBookOpen, 
  FaQuestionCircle, 
  FaExternalLinkAlt,
  FaArrowRight,
  FaHeartbeat
} from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { MdHealthAndSafety } from "react-icons/md";
import Sidebar from "./Sidebar";
import ApiService from "../services/ApiService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockResources = [
  {
    id: 1,
    title: "The Importance of Blood Donation",
    content: "https://www.youtube.com/embed/q6Gfho3G6wQ",  // real YouTube video embed link
    type: "video",
    category: "Education",
    duration: "5 min",
    thumbnail: "https://img.youtube.com/vi/q6Gfho3G6wQ/hqdefault.jpg"
  },
  {
    id: 2,
    title: "Blood Donation Process Explained",
    content: "https://www.redcrossblood.org/donate-blood/blood-donation-process.html", // real article link
    type: "article",
    category: "Process",
    readTime: "3 min"
  },
  {
    id: 3,
    title: "Frequently Asked Questions",
    content: "https://www.redcrossblood.org/faq.html",  // real FAQ page
    type: "faq",
    category: "Education",
    questions: 12
  },
  {
    id: 4,
    title: "Health Benefits of Donating Blood",
    content: "https://www.healthline.com/health/benefits-of-donating-blood", // real article link
    type: "article",
    category: "Health",
    readTime: "4 min"
  },
  {
    id: 5,
    title: "Virtual Tour of Donation Center",
    content: "https://www.youtube.com/embed/hs2XMQli3Zk",  // real YouTube video embed link
    type: "video",
    category: "Tour",
    duration: "7 min",
    thumbnail: "https://img.youtube.com/vi/hs2XMQli3Zk/hqdefault.jpg"
  },
  {
    id: 6,
    title: "Donor Eligibility Checklist",
    content: "https://www.nhlbi.nih.gov/health/blood-donation", // official site
    type: "article",
    category: "Eligibility",
    readTime: "2 min"
  }
];


const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate=useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // In a real app, you would use:
        // const data = await ApiService.getResources();
        // For demo, we'll use mock data
        const data = mockResources;
        setResources(data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Get unique categories for filtering
  const categories = ["All", ...new Set(mockResources.map(res => res.category))];

  // Filter resources based on category and search query
  const filteredResources = resources.filter(res => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const getIconForType = (type) => {
    switch(type) {
      case "video": return <FaVideo className="text-danger" />;
      case "article": return <FaBookOpen className="text-primary" />;
      case "faq": return <FaQuestionCircle className="text-info" />;
      default: return <MdHealthAndSafety className="text-success" />;
    }
  };

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
              <h4 className="mt-3 fw-bold">Loading Resources...</h4>
              <p className="text-muted">Gathering valuable information for you</p>
            </div>
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
            style={{ borderRadius: '20px' }}
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold text-danger">
                  <GiHealthNormal className="me-2" /> Educational Resources
                </h1>
                <div className="d-flex">
                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="form-control me-2"
                    style={{ width: '250px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select 
                    className="form-select"
                    style={{ width: '150px' }}
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="lead text-muted">
                Learn more about blood donation and how you can make a difference.
              </p>
            </motion.div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <motion.div 
                variants={itemVariants}
                className="text-center py-5"
              >
                <div className="alert alert-info">
                  <h4>No resources found</h4>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              </motion.div>
            ) : (
              <div className="row g-4">
                {filteredResources.map((res) => (
                  <motion.div 
                    key={res.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="col-md-6 col-lg-4"
                  >
                    <div className="card h-100 border-0 shadow-sm resource-card">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="resource-icon">
                            {getIconForType(res.type)}
                          </div>
                          <span className="badge bg-light text-dark ms-auto">
                            {res.category}
                          </span>
                        </div>
                        <h5 className="card-title fw-bold">{res.title}</h5>
                        
                        {res.type === "video" && (
                          <>
                            <div className="ratio ratio-16x9 mb-3">
                              <iframe 
                                src={res.content} 
                                title={res.title}
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="text-muted small">
                                <FaVideo className="me-1" /> {res.duration}
                              </span>
                              <a
                                href={res.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-danger"
                              >
                                Watch <FaExternalLinkAlt className="ms-1" />
                              </a>
                            </div>
                          </>
                        )}
                        
                        {res.type === "article" && (
                          <>
                            <p className="card-text text-muted">{res.content}</p>
                            <div className="d-flex justify-content-between align-items-center mt-auto">
                              <span className="text-muted small">
                                <FaBookOpen className="me-1" /> {res.readTime} read
                              </span>
                             <a 
                              href={res.content} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-sm btn-outline-primary"
                            >
                              Read More <FaArrowRight className="ms-1" />
                            </a>

                            </div>
                          </>
                        )}
                        
                        {res.type === "faq" && (
                          <>
                            <p className="card-text text-muted">{res.content}</p>
                            <div className="d-flex justify-content-between align-items-center mt-auto">
                              <span className="badge bg-info">
                                {res.questions} questions
                              </span>
                             <a 
                              href={res.content} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-sm btn-outline-info"
                            >
                              View FAQs <FaArrowRight className="ms-1" />
                            </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Call to Action */}
            <motion.div 
              variants={itemVariants}
              className="text-center mt-5 pt-4 border-top"
            >
              <div className="card border-0 shadow-sm bg-danger text-white">
                <div className="card-body py-4">
                  <h4 className="fw-bold mb-3">
                    <FaHeartbeat className="me-2" /> Ready to Make a Difference?
                  </h4>
                  <p className="mb-4">
                    Now that you're informed, consider scheduling your next donation appointment.
                  </p>
                  <button className="btn btn-light btn-lg px-4 fw-bold text-danger" onClick={() => navigate("/eligibility")}>
                    Schedule Donation <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        .resource-card {
          transition: all 0.3s ease;
          border-radius: 12px;
        }
        
        .resource-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .resource-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(220, 53, 69, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        
        .card-title {
          min-height: 50px;
        }
      `}</style>
    </div>
  );
};

export default Resources;