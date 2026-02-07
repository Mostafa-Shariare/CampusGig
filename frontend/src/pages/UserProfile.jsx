import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user: currentUser } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [gigs, setGigs] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        try {
            // Fetch user profile
            const userResponse = await axios.get(`http://localhost:3000/api/users/${id}`);
            setUser(userResponse.data);

            // Check if current user is following this user
            if (currentUser && userResponse.data.followers) {
                setIsFollowing(userResponse.data.followers.includes(currentUser._id));
            }

            // Fetch user's gigs
            const gigsResponse = await axios.get('http://localhost:3000/api/gigs');
            const userGigs = gigsResponse.data.filter(gig => gig.postedBy._id === id);
            setGigs(userGigs);

            // Fetch user's posts
            const postsResponse = await axios.get('http://localhost:3000/api/posts');
            const userPosts = postsResponse.data.filter(post => post.postedBy._id === id);
            setPosts(userPosts);
        } catch (err) {
            setError('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            if (isFollowing) {
                await axios.put(`http://localhost:3000/api/users/unfollow/${id}`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setIsFollowing(false);
            } else {
                await axios.put(`http://localhost:3000/api/users/follow/${id}`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setIsFollowing(true);
            }
            // Refresh user data to update follower count
            fetchUserData();
        } catch (err) {
            console.error('Follow/unfollow error:', err);
        }
    };

    const handleMessage = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3000/api/conversations/start/${id}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            navigate(`/messages/${response.data._id}`);
        } catch (err) {
            console.error('Start conversation error:', err);
        }
    };

    if (loading) {
        return <div className="user-profile-page"><p className="loading">Loading...</p></div>;
    }

    if (error || !user) {
        return (
            <div className="user-profile-page">
                <div className="error-container">
                    <h2>User not found</h2>
                    <button onClick={() => navigate(-1)} className="btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUser && currentUser._id === id;

    return (
        <div className="user-profile-page">
            <div className="user-profile-container">
                {user.coverPicture && (
                    <div className="user-profile-cover">
                        <img src={user.coverPicture} alt="Cover" />
                    </div>
                )}

                <div className="user-profile-header">
                    <img
                        src={user.avatar || '/default-avatar.png'}
                        alt="Profile"
                        className="user-profile-avatar"
                    />
                    <div className="user-profile-info">
                        <h1>{user.username}</h1>
                        <p className="user-profile-bio">{user.bio || 'No bio yet'}</p>
                    </div>
                    {!isOwnProfile && token && (
                        <div className="profile-actions">
                            <button
                                onClick={handleFollow}
                                className={isFollowing ? 'btn-unfollow' : 'btn-follow'}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                            <button onClick={handleMessage} className="btn-message">
                                Message
                            </button>
                        </div>
                    )}
                </div>

                <div className="user-profile-stats">
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

                <div className="user-profile-section">
                    <h2>{user.username}'s Gigs</h2>
                    {gigs.length === 0 ? (
                        <p className="no-content">No gigs yet</p>
                    ) : (
                        <div className="user-gigs-grid">
                            {gigs.map(gig => (
                                <Link to={`/gigs/${gig._id}`} key={gig._id} className="user-gig-card">
                                    <img src={gig.image} alt={gig.title} />
                                    <div className="user-gig-info">
                                        <h4>{gig.title}</h4>
                                        <span className="user-gig-price">${gig.price}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="user-profile-section">
                    <h2>{user.username}'s Posts</h2>
                    {posts.length === 0 ? (
                        <p className="no-content">No posts yet</p>
                    ) : (
                        <div className="user-posts-list">
                            {posts.map(post => (
                                <div key={post._id} className="user-post-card">
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

export default UserProfile;
