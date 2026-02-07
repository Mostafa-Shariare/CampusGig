import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [gigs, setGigs] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchUserContent();
        }
    }, [token, user]);

    const fetchUserContent = async () => {
        try {
            // Fetch user's gigs
            const gigsResponse = await axios.get('http://localhost:3000/api/gigs');
            const userGigs = gigsResponse.data.filter(gig => gig.postedBy._id === user._id);
            setGigs(userGigs);

            // Fetch user's posts
            const postsResponse = await axios.get('http://localhost:3000/api/posts');
            const userPosts = postsResponse.data.filter(post => post.postedBy._id === user._id);
            setPosts(userPosts);
        } catch (err) {
            console.error('Error fetching profile content:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="profile-page">
                <div className="profile-message">
                    <h2>Please login to view your profile</h2>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading || !user) {
        return <div className="profile-page"><p className="loading">Loading profile...</p></div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {user.coverPicture && (
                    <div className="profile-cover">
                        <img src={user.coverPicture} alt="Cover" />
                    </div>
                )}

                <div className="profile-header">
                    <img
                        src={user.avatar || '/default-avatar.png'}
                        alt="Profile"
                        className="profile-avatar"
                    />
                    <div className="profile-info">
                        <h1>{user.username}</h1>
                        <p>{user.email}</p>
                        <p className="profile-bio">{user.bio || 'No bio yet'}</p>
                    </div>
                    <Link to="/edit-profile" className="btn-edit-profile">
                        Edit Profile
                    </Link>
                </div>

                <div className="profile-stats">
                    <div className="stat">
                        <h3>{user.followers?.length || 0}</h3>
                        <p>Followers</p>
                    </div>
                    <div className="stat">
                        <h3>{user.following?.length || 0}</h3>
                        <p>Following</p>
                    </div>
                    <div className="stat">
                        <h3>{gigs.length}</h3>
                        <p>Gigs</p>
                    </div>
                    <div className="stat">
                        <h3>{posts.length}</h3>
                        <p>Posts</p>
                    </div>
                </div>

                <div className="profile-section">
                    <h2>My Gigs</h2>
                    {gigs.length === 0 ? (
                        <p className="no-content">You haven't posted any gigs yet</p>
                    ) : (
                        <div className="profile-gigs-grid">
                            {gigs.map(gig => (
                                <Link to={`/gigs/${gig._id}`} key={gig._id} className="profile-gig-card">
                                    <img src={gig.image} alt={gig.title} />
                                    <div className="profile-gig-info">
                                        <h4>{gig.title}</h4>
                                        <span className="profile-gig-price">${gig.price}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="profile-section">
                    <h2>My Posts</h2>
                    {posts.length === 0 ? (
                        <p className="no-content">You haven't shared any posts yet</p>
                    ) : (
                        <div className="profile-posts-list">
                            {posts.map(post => (
                                <div key={post._id} className="profile-post-card">
                                    <h4>{post.title}</h4>
                                    <p>{post.description}</p>
                                    {post.image && <img src={post.image} alt={post.title} />}
                                    <span className="post-date">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
