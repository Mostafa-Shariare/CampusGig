import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { token, logout } = useContext(AuthContext);

    return (
        <header>
            <nav className="navbar">
                <div className="logo">
                    <Link to="/"><h2>Campus<span>Gig</span></h2></Link>
                </div>

                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/gigs">Find Gigs</Link></li>
                    <li><Link to="/feed">Community</Link></li>
                </ul>

                <div className="nav-actions">
                    {token ? (
                        <div className="user-menu">
                            <Link to="/create-post" className="btn-create-nav"><i className="fa-solid fa-plus"></i> Post</Link>
                            <Link to="/create-gig" className="btn-create-nav"><i className="fa-solid fa-briefcase"></i> Gig</Link>
                            <Link to="/messages" className="nav-messages" title="Messages">
                                <i className="fa-regular fa-envelope"></i>
                            </Link>
                            <Link to="/profile" className="nav-profile-link">Profile</Link>
                            <button onClick={logout} className="btn-logout-nav">Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-login-nav">Log In</Link>
                            <Link to="/register" className="btn-signup-nav">Join Now</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
