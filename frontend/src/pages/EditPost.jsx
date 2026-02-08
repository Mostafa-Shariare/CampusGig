import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './CreatePost.css'; // Reusing CreatePost css

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/posts/${id}`);
            const post = res.data;
            // Check ownership
            if (user && post.postedBy._id !== user._id) {
                navigate('/'); // Not authorized
                return;
            }
            setTitle(post.title);
            setDescription(post.description);
            setImage(post.image || '');
        } catch (err) {
            setError('Failed to fetch post details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        try {
            await axios.put(`http://localhost:3000/api/posts/${id}`, {
                title,
                description,
                image
            });
            navigate('/'); // Redirect to feed
        } catch (err) {
            setError('Failed to update post');
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="create-post-container"><p>Loading...</p></div>;

    return (
        <div className="create-post-container">
            <h2>Edit Post</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="5"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                <button type="submit" className="btn-submit" disabled={updating}>
                    {updating ? 'Updating...' : 'Update Post'}
                </button>
            </form>
        </div>
    );
};

export default EditPost;
