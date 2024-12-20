import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';  // Import the CSS file for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to /blogs page
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/blogs');
    }
  }, [navigate]);  // Only run the effect when the navigate function changes

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/blogs');  // Redirect to /blogs immediately after successful login
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      {/* Logo instead of heading */}
      <img
        src="https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png"
        alt="Logo"
        className="auth-logo"
      />
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className='login-register' type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      
      {/* Create Account button */}
      <div className="signup-option">
        <p>Don't have an account?</p>
        <button className='other-button' onClick={() => navigate('/register')}>Create Account</button>
      </div>
    </div>
  );
};

export default Login;
