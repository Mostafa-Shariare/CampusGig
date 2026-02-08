import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './GigDetail.css';

const GigDetail = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [hasOrdered, setHasOrdered] = useState(false);
    const [reviewForm, setReviewForm] = useState({ star: 5, desc: '' });
    const [averageRating, setAverageRating] = useState(0);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this gig?')) return;
        try {
            await axios.delete(`http://localhost:3000/api/gigs/${id}`);
            navigate('/gigs');
        } catch (err) {
            console.error('Failed to delete gig:', err);
            alert('Failed to delete gig');
        }
    };

    const handleEdit = () => {
        navigate(`/edit-gig/${id}`);
    };

    useEffect(() => {
        fetchGig();
        fetchReviews();
        if (user) checkCanReview();
    }, [id, user]);

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

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/reviews/${id}`);
            setReviews(res.data);

            // Calculate average
            if (res.data.length > 0) {
                const total = res.data.reduce((acc, curr) => acc + curr.star, 0);
                setAverageRating((total / res.data.length).toFixed(1));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const checkCanReview = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/orders/check/${id}`, {
                headers: { Authorization: `Bearer ${user.token || localStorage.getItem('token')}` } // Ensure token is passed
            });
            setCanReview(res.data.canReview);
            // Check if user has any order (completed or not) to show "Complete" button logic if needed
            // For simplicity, we'll assume if they can't review, they might need to book or complete.
            // But let's add a "Book" button logic separately.
        } catch (err) {
            console.error(err);
        }
    };

    const handleBook = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!window.confirm("Confirm booking this gig? (Demo: This will create an order)")) return;

        try {
            const token = user.token || localStorage.getItem('token'); // handle context structure
            const res = await axios.post(`http://localhost:3000/api/orders/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Auto complete for demo purposes to allow review immediately?
            // Or show a "Complete Order" button? Let's show "Complete Order" button if booked but not completed.
            // For now, let's just alert and maybe auto-complete for smooth UX in demo?
            // "Order created! Please complete it to leave a review."

            // Let's AUTO COMPLETE for better UX in this review demo
            await axios.put(`http://localhost:3000/api/orders/${res.data._id}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Gig booked and marked as completed! You can now leave a review.");
            setCanReview(true);
            setHasOrdered(true);
        } catch (err) {
            console.error(err);
            alert("Booking failed");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = user.token || localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/reviews`, {
                gigId: id,
                star: reviewForm.star,
                desc: reviewForm.desc
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviewForm({ star: 5, desc: '' });
            fetchReviews();
            setCanReview(false); // Only one review
            alert("Review submitted!");
        } catch (err) {
            alert(err.response?.data || "Failed to submit review");
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
                {/* Left Column */}
                <div className="gig-left-col">
                    <div className="gig-header">
                        <h1>{gig.title}</h1>
                        <span className="gig-category-badge">{gig.category}</span>
                    </div>

                    <div className="gig-image-section">
                        <img src={gig.image} alt={gig.title} />
                    </div>

                    <div className="gig-description">
                        <h3>About This Gig</h3>
                        <p>{gig.description}</p>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <h3>Reviews ({reviews.length}) <span className="avg-rating"><i className="fa-solid fa-star"></i> {averageRating}</span></h3>

                        {canReview && (
                            <form className="review-form" onSubmit={handleReviewSubmit}>
                                <h4>Leave a Review</h4>
                                <div className="rating-input">
                                    <label>Rating:</label>
                                    <select
                                        value={reviewForm.star}
                                        onChange={(e) => setReviewForm({ ...reviewForm, star: Number(e.target.value) })}
                                    >
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Good</option>
                                        <option value="3">3 - Average</option>
                                        <option value="2">2 - Poor</option>
                                        <option value="1">1 - Terrible</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Write your experience..."
                                    value={reviewForm.desc}
                                    onChange={(e) => setReviewForm({ ...reviewForm, desc: e.target.value })}
                                    required
                                ></textarea>
                                <button type="submit" className="btn-primary">Submit Review</button>
                            </form>
                        )}

                        <div className="reviews-list">
                            {reviews.map(review => (
                                <div key={review._id} className="review-card">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <img src={review.reviewerId?.avatar || '/default-avatar.png'} alt="Reviewer" />
                                            <span>{review.reviewerId?.username}</span>
                                        </div>
                                        <div className="review-rating">
                                            {Array(review.star).fill().map((_, i) => (
                                                <i key={i} className="fa-solid fa-star"></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-desc">{review.desc}</p>
                                    <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="gig-right-col">
                    <div className="gig-sticky-sidebar">
                        <div className="gig-pricing-card">
                            <div className="price-tag">
                                <span className="price-label">Price</span>
                                <span className="price-amount">${gig.price}</span>
                            </div>

                            {user && gig.postedBy?._id === user._id ? (
                                <div className="owner-actions">
                                    <button className="btn-edit" onClick={handleEdit}><i className="fa-solid fa-pen"></i> Edit</button>
                                    <button className="btn-delete" onClick={handleDelete}><i className="fa-solid fa-trash"></i> Delete</button>
                                </div>
                            ) : (
                                <>
                                    <button className="btn-contact" onClick={handleBook}>Book Gig & Review (Demo)</button>
                                </>
                            )}

                            <div className="gig-meta">
                                <p>Posted on {new Date(gig.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="gig-seller-card">
                            <h3>About The Seller</h3>
                            <Link to={`/user/${gig.postedBy?._id}`} className="seller-link">
                                <img
                                    src={gig.postedBy?.avatar || '/default-avatar.png'}
                                    alt={gig.postedBy?.username}
                                    className="seller-avatar"
                                />
                                <div className="seller-info">
                                    <h4>{gig.postedBy?.username || 'Anonymous'}</h4>
                                    <p className="seller-bio">{gig.postedBy?.bio || 'CampusGig Student Seller'}</p>
                                </div>
                            </Link>
                            {user && gig.postedBy?._id !== user._id && (
                                <button className="btn-message-seller">Message Seller</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GigDetail;
