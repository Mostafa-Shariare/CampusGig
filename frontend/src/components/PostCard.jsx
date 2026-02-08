import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../pages/Feed.css'; // Reusing Feed.css for now, can extract if needed

const PostCard = ({ post, onDelete }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [likes, setLikes] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        setIsLiked(post.likes.includes(user?._id));
    }, [user, post.likes]);

    const handleLike = async () => {
        if (!user) return alert("Please login to like posts");

        try {
            // Optimistic update
            setIsLiked(!isLiked);
            setLikes(isLiked ? likes - 1 : likes + 1);

            await axios.put(`http://localhost:3000/api/posts/${post._id}/like`);
        } catch (error) {
            // Revert on error
            setIsLiked(!isLiked);
            setLikes(isLiked ? likes + 1 : likes - 1);
            console.error("Error liking post:", error);
        }
    };

    const toggleComments = async () => {
        setShowComments(!showComments);
        if (!showComments && comments.length === 0) {
            fetchComments();
        }
    };

    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const res = await axios.get(`http://localhost:3000/api/comments/post/${post._id}`);
            setComments(res.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await axios.post("http://localhost:3000/api/comments", {
                postId: post._id,
                userId: user._id,
                text: newComment
            });
            setComments([res.data, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/posts/${post._id}`);
            if (onDelete) onDelete(post._id);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleEdit = () => {
        navigate(`/edit-post/${post._id}`);
    };

    return (
        <div className="post-card">
            <div className="post-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Link to={`/user/${post.postedBy?._id}`} className="post-header">
                    <img
                        src={post.postedBy?.avatar || '/default-avatar.png'}
                        alt={post.postedBy?.username}
                        className="post-avatar"
                    />
                    <div className="post-info">
                        <h4>{post.postedBy?.username || 'Anonymous'}</h4>
                        <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </Link>
                {user && post.postedBy?._id === user._id && (
                    <div className="post-owner-actions">
                        <button onClick={handleEdit} className="btn-icon" title="Edit">
                            <i className="fa-solid fa-pen"></i>
                        </button>
                        <button onClick={handleDelete} className="btn-icon delete" title="Delete">
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                )}
            </div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            {post.image && (
                <img src={post.image} alt={post.title} className="post-image" />
            )}

            <div className="post-actions">
                <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                    <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                    <span>{likes} Likes</span>
                </button>
                <button className="action-btn" onClick={toggleComments}>
                    <i className="fa-regular fa-comment"></i>
                    <span>Comments</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    {user && (
                        <form className="comment-form" onSubmit={handleAddComment}>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button type="submit" disabled={!newComment.trim()}>Post</button>
                        </form>
                    )}

                    {loadingComments ? (
                        <p className="loading-comments">Loading comments...</p>
                    ) : (
                        <div className="comments-list">
                            {comments.map(comment => (
                                <div key={comment._id} className="comment-item">
                                    <img
                                        src={comment.userId?.avatar || '/default-avatar.png'}
                                        alt={comment.userId?.username}
                                        className="comment-avatar"
                                    />
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <span className="comment-user">{comment.userId?.username || 'Anonymous'}</span>
                                            <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            {user && user._id === comment.userId?._id && (
                                                <button
                                                    className="delete-comment-btn"
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
