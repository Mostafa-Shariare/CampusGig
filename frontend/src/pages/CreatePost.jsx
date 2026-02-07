import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import './CreatePost.css';

const CreatePost = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = (imageUrl) => {
        setFormData({
            ...formData,
            image: imageUrl
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.image) {
            setError('Please upload an image for your post');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/posts', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/feed');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="create-post-page">
                <div className="auth-required">
                    <h2>Please login to create a post</h2>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="create-post-page">
            <div className="create-post-container">
                <h1>Create a New Post</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="What's on your mind?"
                        />
                    </div>

                    <div className="form-group">
                        <label>Content *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="Share your thoughts with the community..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Image *</label>
                        <ImageUpload onUploadComplete={handleImageUpload} />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Posting...' : 'Create Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
