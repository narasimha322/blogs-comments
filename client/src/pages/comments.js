import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Comments.css'; // Import the new CSS file

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [userId, setUserId] = useState(null);
  const [blogOwnerId, setBlogOwnerId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/comments/${blogId}`);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.id);
    }

    const fetchBlogOwner = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/blogs/${blogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogOwnerId(response.data.user_id);
      } catch (err) {
        console.error('Error fetching blog owner:', err);
      }
    };

    fetchComments();
    fetchBlogOwner();
  }, [blogId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:5000/comments/${blogId}`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment('');
      const response = await axios.get(`http://localhost:5000/comments/${blogId}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleEditComment = (id, content) => {
    setEditingCommentId(id);
    setEditingContent(content);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/comments/${editingCommentId}`,
        { content: editingContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditingContent('');
      const response = await axios.get(`http://localhost:5000/comments/${blogId}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get(`http://localhost:5000/comments/${blogId}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="comments-container">
      <h3 className="comments-heading">
        <i className="fa-regular fa-comment comments-icon"></i> Comments
      </h3>
      <form onSubmit={handleAddComment} className="comments-form">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          required
          className="comments-textarea"
        />
        <button type="submit" className="comments-submit-button">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comments-item">
              {editingCommentId === comment.id ? (
                <div className="comments-editing-container">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    required
                    className="comments-editing-textarea"
                  />
                  <button onClick={handleUpdateComment} className="comments-update-button">
                    Update
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="comments-cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p className="comments-content">{comment.content}</p>
                  {(comment.user_id === userId || userId === blogOwnerId) && (
                    <div className="comments-actions">
                      {comment.user_id === userId && (
                        <i
                          className="fa-solid fa-pen-to-square comments-action-icon"
                          onClick={() => handleEditComment(comment.id, comment.content)}
                        ></i>
                      )}
                      <i
                        className="fa-solid fa-trash comments-action-icon comments-delete-icon"
                        onClick={() => handleDeleteComment(comment.id)}
                      ></i>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="comments-empty">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
