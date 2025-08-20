import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home';
import EligibilityCheck from './components/EligibilityCheck';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/Login';
import Appointment from './components/Appointment'; // <-- Import Appointment
import Profile from './components/Profile';
import DonorDashboard from './components/DonorDashboard';
import './index.css';
import ManageAppointments from './components/ManageAppointments';
import UrgentRequests from './components/UrgentRequest';
import Badges from './components/Badges';
import DonationCenters from './components/DonationCenters';
import Chat from './components/Chat';
import AdminChat from './components/AdminChat';
import FeedbackForm from './components/Feedbackform';
import Resources from './components/Resources';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            
            {/* Protected Routes for Donors */}
            <Route path="/donor/dashboard" element={
              <ProtectedRoute requiredRole="DONOR">
                <DonorDashboard/>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" 
               element={
                 <ProtectedRoute roleRequired="ADMIN">
                   <AdminDashboard />
                 </ProtectedRoute>
               } 
        />
            <Route path="/eligibility" element={
              <ProtectedRoute>
                <EligibilityCheck />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            } /> 
            <Route path="/book-appointment" element={
              <ProtectedRoute>
                <Appointment/>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            } />
            <Route path='/manage-appointments' element={
              <ProtectedRoute>
                <ManageAppointments/>
              </ProtectedRoute>
            }/>
            <Route path="/UrgentRequest" element={
              <ProtectedRoute>
                <UrgentRequests/>
              </ProtectedRoute>
            }/>
            <Route path="/badges" element={
              <ProtectedRoute>
                <Badges/>
              </ProtectedRoute>
            }/>
            <Route path="/donationcenter" element={
              <ProtectedRoute>
                <DonationCenters/>
              </ProtectedRoute>
            }/>
            <Route path="/chatwithcenter" element={
              <ProtectedRoute>
                <Chat/>
              </ProtectedRoute>
            }/>
            <Route path="/feedback/:appointmentId" element={
              <ProtectedRoute>
                <FeedbackForm />
              </ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute>
                <Resources/>
              </ProtectedRoute>
            }/>
            
            {/* Admin Routes */}
            <Route path="/adminchat" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminChat/>
              </ProtectedRoute>
            }/>
            
            {/* Unauthorized page */}
            <Route path="/unauthorized" element={
              <div className="container mt-5 text-center">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
              </div>
            }/>
          </Routes>
          
        </header>
      </div>
    </Router>
  );
}

export default App;