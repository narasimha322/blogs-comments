import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "../styles/CreateBlog.css"; // Import the CSS file

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/blogs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Blog added:", response.data);
      window.location.href = "/blogs";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="add-blog-container">
        <h2 className="add-blog-title">Create a New Blog</h2>
        <form className="add-blog-form" onSubmit={handleSubmit}>
          <div className="add-blog-form-group">
            <label className="add-blog-label">Title</label>
            <input
              type="text"
              className="add-blog-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>
          <div className="add-blog-form-group">
            <label className="add-blog-label">Content</label>
            <textarea
              className="add-blog-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here"
              required
            />
          </div>
          <div className="add-blog-form-group">
            <label className="add-blog-label">Category</label>
            <input
              type="text"
              className="add-blog-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
            />
          </div>
          <div className="add-blog-form-group">
            <label className="add-blog-label">Image</label>
            <input
              type="file"
              className="add-blog-file-input"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button type="submit" className="add-blog-submit">
            Add Blog
          </button>
        </form>
      </div>
    </>
  );
};

export default AddBlog;
