import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from './comments';
import "../styles/BlogDetails.css";
import Header from '../components/Header';

const BlogDetails = () => {
  const { id } = useParams();  // Get blog ID from URL params
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [blogData, setBlogData] = useState(null);  // State for storing blog data

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // Log the URL and token being sent in the request
        const token = localStorage.getItem('token');
        console.log('Requesting blog data for ID:', id);
        console.log('Authorization Token:', token);

        // Request blog data from the backend
        const response = await axios.get(`http://localhost:5000/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Log the response data for debugging
        console.log('Received response:', response);

        if (response.data) {
          // If blog data is returned, update state
          setBlogData(response.data);
        } else {
          setError('No blog found with the given ID');
        }
      } catch (err) {
        // Log the error response and message for debugging
        console.error('Error fetching blog data:', err);
        setError('Error fetching blog data');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);  // Re-run if the blog ID changes

  if (loading) return <p>Loading...</p>;  // Show loading message
  if (error) return <p>{error}</p>;  // Show error message

  return (
    <>
    <Header />
    <div className="blog-details-container">
      <h1>{blogData.title}</h1>
      
      {/* Display large image if available */}
      {blogData.image_url ? (
        <div className="blog-image-container">
          <img
            src={`http://localhost:5000${blogData.image_url}`}  // Ensure the correct image URL
            alt={blogData.title}
            className="blog-image"
          />
        </div>
      ) : (
        <p>No image available</p>
      )}
      
      {/* Content section */}
      <div className="blog-content">
        <p>{blogData.content}</p>
      </div>

      {/* Comments Section */}
      <Comments blogId={id} />
    </div>
    </>
  );
};

export default BlogDetails;
