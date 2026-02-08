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
                <h1>Find The Perfect Gig</h1>
                <div className="gigs-actions">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        <option value="Tech">Tech & Programming</option>
                        <option value="Design">Design & Creative</option>
                        <option value="Writing">Writing & Translation</option>
                        <option value="Marketing">Marketing & Sales</option>
                        <option value="Other">Other</option>
                    </select>
                    <Link to="/create-gig" className="btn-create-gig"><i className="fa-solid fa-plus"></i> Post a Gig</Link>
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
                            <Link to={`/gigs/${gig._id}`} key={gig._id} className="gig-card">
                                <div className="gig-image-container">
                                    <img src={gig.image || '/placeholder.jpg'} alt={gig.title} />
                                </div>
                                <div className="gig-content">
                                    <div className="gig-seller-info">
                                        <img
                                            src={gig.postedBy?.avatar || '/default-avatar.png'}
                                            alt={gig.postedBy?.username}
                                            className="seller-avatar-small"
                                        />
                                        <span className="seller-name">{gig.postedBy?.username || 'Anonymous'}</span>
                                    </div>
                                    <h3>{gig.title}</h3>
                                    <p className="gig-description">{gig.description}</p>
                                    <div className="gig-footer">
                                        <div className="gig-rating">
                                            <i className="fa-solid fa-star"></i> 5.0 <span>(New)</span>
                                        </div>
                                        <div className="gig-price">
                                            <span>STARTING AT</span>${gig.price}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Gigs;
