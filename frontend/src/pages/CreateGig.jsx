import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import './CreateGig.css';

const CreateGig = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Tech',
        price: '',
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
            setError('Please upload an image for your gig');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/gigs', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/gigs');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create gig');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="create-gig-page">
                <div className="auth-required">
                    <h2>Please login to create a gig</h2>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="create-gig-page">
            <div className="create-gig-container">
                <h1>Create a New Gig</h1>
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
                            placeholder="e.g., I will design your website"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                            placeholder="Describe what you're offering..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="Tech">Tech</option>
                                <option value="Design">Design</option>
                                <option value="Writing">Writing</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Price ($) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="50"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Gig Image *</label>
                        <ImageUpload onUploadComplete={handleImageUpload} />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Gig'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGig;
