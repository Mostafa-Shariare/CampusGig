import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Feed.css';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feed-page">
            <div className="feed-header">
                <h1>Community Feed</h1>
                <Link to="/create-post" className="btn-create-post">+ Create Post</Link>
            </div>
            {loading ? (
                <p className="loading">Loading posts...</p>
            ) : (
                <div className="posts-container">
                    {posts.length === 0 ? (
                        <p className="no-posts">No posts yet. Be the first to share something!</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="post-card">
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
                                <h3>{post.title}</h3>
                                <p>{post.description}</p>
                                {post.image && (
                                    <img src={post.image} alt={post.title} className="post-image" />
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Feed;
