import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Blogs from './pages/Blogs';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetails from './pages/BlogDetails';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Listen for changes to localStorage
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);  // Empty dependency array means this effect runs only once when the component mounts.

  return (
    <Router>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route 
          path="/login" 
          element={token ? <Navigate to="/blogs" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={token ? <Navigate to="/blogs" /> : <Register />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/blogs" 
          element={<ProtectedRoute><Blogs /></ProtectedRoute>} 
        />
        <Route 
          path="/add-blog" 
          element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} 
        />
        <Route 
          path="/edit-blog/:id" 
          element={<ProtectedRoute><EditBlog /></ProtectedRoute>} 
        />
        <Route 
          path="/blogs/:id" 
          element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
};

export default App;
