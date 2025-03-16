import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Products from './components/products/Products';
import ProductDetails from './components/products/ProductDetails';
import EditProduct from './components/products/EditProduct';
import AddProduct from './components/products/AddProduct';
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import CreateOrder from './components/orders/CreateOrder';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          } />
          <Route path="/products/:id/edit" element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />
          <Route path="/products/add" element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          } />
          <Route path="/products/:id/order" element={
            <ProtectedRoute>
              <CreateOrder />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
