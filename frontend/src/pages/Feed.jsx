import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
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

    const handleDeletePost = (deletedPostId) => {
        setPosts(posts.filter(post => post._id !== deletedPostId));
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
                            <div key={post._id} className="post-card-container">
                                <PostCard post={post} onDelete={handleDeletePost} />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Feed;
