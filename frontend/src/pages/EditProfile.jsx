import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        bio: user?.bio || '',
        avatar: user?.avatar || '',
        coverPicture: user?.coverPicture || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAvatarUpload = (imageUrl) => {
        setFormData({ ...formData, avatar: imageUrl });
    };

    const handleCoverUpload = (imageUrl) => {
        setFormData({ ...formData, coverPicture: imageUrl });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.put(`http://localhost:3000/api/users/${user._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="edit-profile-page">
                <div className="auth-required">
                    <h2>Please login to edit your profile</h2>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-container">
                <h1>Edit Profile</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Profile Picture</label>
                        <ImageUpload
                            onUploadComplete={handleAvatarUpload}
                            currentImage={formData.avatar}
                        />
                    </div>

                    <div className="form-group">
                        <label>Cover Picture</label>
                        <ImageUpload
                            onUploadComplete={handleCoverUpload}
                            currentImage={formData.coverPicture}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
