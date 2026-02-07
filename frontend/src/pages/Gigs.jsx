import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Gigs.css';

const Gigs = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchGigs();
    }, [category]);

    const fetchGigs = async () => {
        try {
            const url = category
                ? `http://localhost:3000/api/gigs?category=${category}`
                : 'http://localhost:3000/api/gigs';
            const response = await axios.get(url);
            setGigs(response.data);
        } catch (error) {
            console.error('Error fetching gigs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gigs-page">
            <div className="gigs-header">
                <h1>Browse Gigs</h1>
                <div className="gigs-actions">
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Tech">Tech</option>
                        <option value="Design">Design</option>
                        <option value="Writing">Writing</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Other">Other</option>
                    </select>
                    <Link to="/create-gig" className="btn-create-gig">+ Create Gig</Link>
                </div>
            </div>

            {loading ? (
                <p className="loading">Loading gigs...</p>
            ) : (
                <div className="gigs-grid">
                    {gigs.length === 0 ? (
                        <p className="no-gigs">No gigs found. Be the first to post one!</p>
                    ) : (
                        gigs.map((gig) => (
                            <div key={gig._id} className="gig-card">
                                <img src={gig.image || '/placeholder.jpg'} alt={gig.title} />
                                <div className="gig-content">
                                    <h3>{gig.title}</h3>
                                    <p className="gig-description">{gig.description}</p>
                                    <div className="gig-footer">
                                        <span className="gig-category">{gig.category}</span>
                                        <span className="gig-price">${gig.price}</span>
                                    </div>
                                    <Link to={`/gigs/${gig._id}`} className="btn-view">View Details</Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Gigs;
