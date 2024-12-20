import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../styles/blogs.css";
import Footer from "./Footer";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        let decodedToken;
        try {
          decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUserId(decodedToken.id);
        } catch (err) {
          console.error("Error decoding token:", err);
          throw new Error("Invalid token");
        }

        const response = await axios.get("http://localhost:5000/blogs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) return <p>Loading...</p>;

  const filteredBlogs = selectedCategory === 'All' ? blogs : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <>
      <Header />
      <div className="blogs-container">
        <div className="blogs-top-image-container">
          <img src="/blog top.webp" alt="Top Image" className="blogs-top-image" />
        </div>

        <hr />

        <h2 className="blogs-list-heading">BLOGS</h2>

        {/* Category Dropdown */}
        <div className="category-dropdown">
          <label htmlFor="category" className="category-label">Filter by Category: </label>
          <select id="category" value={selectedCategory} onChange={handleCategoryChange} className="category-select">
            <option value="All">All</option>
            <option value="Music">Music</option>
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>

        <div className="blogs-grid">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog.id} className="blogs-blog-card">
                {blog.image_url && (
                  <img
                    src={`http://localhost:5000${blog.image_url}`}
                    alt={blog.title}
                    className="blogs-blog-image"
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                )}

                <div className="blogs-blog-details">
                  <p className="blogs-blog-author">
                    By: {blog.author || "Unknown Author"}
                  </p>
                  <h2 className="blogs-blog-title">{blog.title}</h2>
                  <p className="blogs-blog-description">
                    {blog.content.slice(0, 100)}...
                  </p>

                  {blog.user_id === userId && (
                    <div className="blogs-blog-actions">
                      <i
                        className="fa-solid fa-pen-to-square blogs-action-icon blogs-edit-icon"
                        onClick={() => navigate(`/edit-blog/${blog.id}`)}
                      ></i>
                      <i
                        className="fa-solid fa-trash blogs-action-icon blogs-delete-icon"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            await axios.delete(
                              `http://localhost:5000/blogs/${blog.id}`,
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            setBlogs(blogs.filter((item) => item.id !== blog.id));
                          } catch (err) {
                            console.error("Error deleting blog:", err);
                          }
                        }}
                      ></i>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>
              No blogs available. Click <a href="/add-blog">here</a> to create one.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
