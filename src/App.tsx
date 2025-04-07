import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import Home from './pages/Home';
import Employees from './pages/Employees';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import AddProductPage from './pages/Addproductpage';
import AddSupplierPage from './pages/Addsupplierpage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import MessagingPage from './pages/MessagingPage';
import Profile from './pages/profile.tsx';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ component: React.FC }> = ({ component: Component }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

// App Content with Redirect Logic
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Redirect to /home after login
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      toast.success('Login successful!', {
        position: 'top-left',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/home');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route path="/home" element={<ProtectedRoute component={Home} />} />
      <Route path="/employees" element={<ProtectedRoute component={Employees} />} />
      <Route path="/customers" element={<ProtectedRoute component={Customers} />} />
      <Route path="/products" element={<ProtectedRoute component={Products} />} />
      <Route path="/suppliers" element={<ProtectedRoute component={Suppliers} />} />
      <Route path="/addproductpage" element={<ProtectedRoute component={AddProductPage} />} />
      <Route
        path="/addsupplier"
        element={<ProtectedRoute component={() => <AddSupplierPage visible={undefined} onCancel={undefined} onSubmit={undefined} />} />}
      />
      <Route path="/settings" element={<ProtectedRoute component={Settings} />} />
      <Route path="/messaging" element={<ProtectedRoute component={MessagingPage} />} />
      <Route path="/profile" element={<ProtectedRoute component={Profile} />} />

      {/* Default Route Redirect */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/login'} />} />
    </Routes>
  );
};

// App Wrapper with Auth0Provider
const App: React.FC = () => {
  return (
    <Router>
      <AppWithAuth0 />
    </Router>
  );
};

// Separate component for Auth0 provider to use navigate hook
const AppWithAuth0: React.FC = () => {
  const navigate = useNavigate();
  
  const onRedirectCallback = (appState: any) => {
    // Navigate to the intended route after authentication
    console.log("Auth0 redirect callback triggered", appState);
    
    try {
      // Add timeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate(appState?.returnTo || '/home');
      }, 100);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      navigate('/home');
    }
  };
  
  return (
    <Auth0Provider
      domain="dev-sasindu.us.auth0.com"
      clientId="RHVESuFePqwilXmPowr5Za4PemQZ6dDM"
      authorizationParams={{
        redirect_uri: `${window.location.origin}`,
      }}
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      <ToastContainer position="top-left" autoClose={4000} />
      <AppContent />
    </Auth0Provider>
  );
};

export default App;