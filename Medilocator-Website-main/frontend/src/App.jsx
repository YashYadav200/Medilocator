import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/Dashboard';
import VendorDashboard from './pages/Vendor/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ContactSupport from './pages/ContactSupport';
import RejectedAccount from './pages/RejectedAccount';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/search" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/account-rejected" element={<RejectedAccount />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['VENDOR']} />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            {/* Add Medicine is technically inside dashboard modal, but if we had a separate page: */}
            {/* <Route path="/vendor/add-medicine" element={<AddMedicine />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
