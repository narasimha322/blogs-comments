import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and description */}
        <div className="footer-logo-section">
          <img
            src="https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png"
            alt="Logo"
            className="footer-logo"
          />
          <p className="footer-description">
            Welcome to our blog platform! Explore and share thoughts on topics that inspire you.
          </p>
        </div>

        {/* Navigation links */}
        <div className="footer-links">
          <h4 className="footer-title">Quick Links</h4>
          <ul>
            <li>
              <a href="/blogs">Home</a>
            </li>
            <li>
              <a href="/add-blog">Create Blog</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <h4 className="footer-title">Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} My Blog Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
