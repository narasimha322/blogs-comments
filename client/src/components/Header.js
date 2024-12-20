import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";  // You can add your CSS styles here, if needed

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token and navigate to register page
    localStorage.removeItem("token");
    navigate("/register");  // Redirect to the register page after logout
  };

  return (
    <header className="blogs-header">
      <nav>
        <div className="logo-container">
          <img 
            src="https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png" 
            alt="Logo" 
            className="logo" 
          />
        </div>
        <div className="nav-links">
          <a onClick={() => navigate("/blogs")}>Home</a>
          <a onClick={() => navigate("/add-blog")}>Create Blog</a>
          <a onClick={handleLogout}>Log out</a>  {/* Move the logic to a function */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
