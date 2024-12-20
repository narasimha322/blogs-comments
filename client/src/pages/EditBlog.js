import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditBlog.css"; // Import the CSS file
import Header from "../components/Header";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { title, content, category } = response.data;
        setFormData({ title, content, category, image: null });
      } catch (err) {
        console.error("Error fetching blog data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("content", formData.content);
    updatedData.append("category", formData.category);
    if (formData.image) {
      updatedData.append("image", formData.image);
    }

    try {
      await axios.put(`http://localhost:5000/blogs/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/blogs`);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="edit-blog-container">
        <h2 className="edit-blog-title">Edit Blog</h2>
        <form className="edit-blog-form" onSubmit={handleSubmit}>
          <div className="edit-blog-form-group">
            <label className="edit-blog-label">Title</label>
            <input
              type="text"
              name="title"
              className="edit-blog-input"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
            />
          </div>
          <div className="edit-blog-form-group">
            <label className="edit-blog-label">Content</label>
            <textarea
              name="content"
              className="edit-blog-textarea"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your blog content here"
            ></textarea>
          </div>
          <div className="edit-blog-form-group">
            <label className="edit-blog-label">Category</label>
            <input
              type="text"
              name="category"
              className="edit-blog-input"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Enter category"
            />
          </div>
          <div className="edit-blog-form-group">
            <label className="edit-blog-label">Image</label>
            <input
              type="file"
              name="image"
              className="edit-blog-file-input"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="edit-blog-submit">
            Update Blog
          </button>
        </form>
      </div>
    </>
  );
};

export default EditBlog;
