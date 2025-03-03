import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import MessagingPage from './pages/MessagingPage'; // Changed from Messaging to MessagingPage
import './App.css';
import Profile from "./pages/profile.tsx";

const App: React.FC = () => {
  // You would normally check for authentication here
  const isAuthenticated = true; // For demonstration purposes

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/employees" element={isAuthenticated ? <Employees /> : <Navigate to="/login" />} />
        <Route path="/customers" element={isAuthenticated ? <Customers /> : <Navigate to="/login" />} />
        <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" />} />
        <Route path="/suppliers" element={isAuthenticated ? <Suppliers /> : <Navigate to="/login" />} />
        <Route path="/addproductpage" element={isAuthenticated ? <AddProductPage /> : <Navigate to="/login" />} />
        <Route path="/addsupplier" element={isAuthenticated ? <AddSupplierPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/messaging" element={isAuthenticated ? <MessagingPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        
        {/* Default Route Redirect */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
