import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './CreateGig.css'; // Reusing CreateGig css

const EditGig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        price: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGig();
    }, [id]);

    const fetchGig = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/gigs/${id}`);
            const gig = res.data;
            // Check ownership (might populate postedBy full object or just id)
            // Backend populates postedBy, so check _id
            if (user && gig.postedBy._id !== user._id) {
                navigate('/gigs');
                return;
            }
            setFormData({
                title: gig.title,
                description: gig.description,
                category: gig.category,
                price: gig.price,
                image: gig.image || ''
            });
        } catch (err) {
            setError('Failed to fetch gig details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        try {
            await axios.put(`http://localhost:3000/api/gigs/${id}`, formData);
            navigate(`/gigs/${id}`); // Redirect to gig detail
        } catch (err) {
            setError('Failed to update gig');
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="create-gig-container"><p>Loading...</p></div>;

    return (
        <div className="create-gig-container">
            <h2>Edit Gig</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="create-gig-form">
                <div className="form-group">
                    <label>Gig Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="Tech">Tech</option>
                        <option value="Design">Design</option>
                        <option value="Writing">Writing</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="6"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/gig-image.jpg"
                    />
                </div>

                <button type="submit" className="btn-submit" disabled={updating}>
                    {updating ? 'Updating...' : 'Update Gig'}
                </button>
            </form>
        </div>
    );
};

export default EditGig;
