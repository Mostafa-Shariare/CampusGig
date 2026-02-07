import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './GigDetail.css';

const GigDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGig();
    }, [id]);

    const fetchGig = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/gigs/${id}`);
            setGig(response.data);
        } catch (err) {
            setError('Failed to load gig details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="gig-detail-page"><p className="loading">Loading...</p></div>;
    }

    if (error || !gig) {
        return (
            <div className="gig-detail-page">
                <div className="error-container">
                    <h2>Gig not found</h2>
                    <button onClick={() => navigate('/gigs')} className="btn-primary">
                        Back to Gigs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="gig-detail-page">
            <div className="gig-detail-container">
                <div className="gig-image-section">
                    <img src={gig.image} alt={gig.title} />
                </div>

                <div className="gig-info-section">
                    <div className="gig-header">
                        <h1>{gig.title}</h1>
                        <span className="gig-category-badge">{gig.category}</span>
                    </div>

                    <div className="gig-seller">
                        <Link to={`/user/${gig.postedBy?._id}`} className="seller-link">
                            <img
                                src={gig.postedBy?.avatar || '/default-avatar.png'}
                                alt={gig.postedBy?.username}
                                className="seller-avatar"
                            />
                            <div className="seller-info">
                                <h4>{gig.postedBy?.username || 'Anonymous'}</h4>
                                <p className="seller-bio">{gig.postedBy?.bio || 'CampusGig Seller'}</p>
                            </div>
                        </Link>
                    </div>

                    <div className="gig-description">
                        <h3>About This Gig</h3>
                        <p>{gig.description}</p>
                    </div>

                    <div className="gig-pricing">
                        <div className="price-tag">
                            <span className="price-label">Price</span>
                            <span className="price-amount">${gig.price}</span>
                        </div>
                        <button className="btn-contact">Contact Seller</button>
                    </div>

                    <div className="gig-meta">
                        <p>Posted on {new Date(gig.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GigDetail;
