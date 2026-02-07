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
                    <li><Link to="/gigs">Gigs</Link></li>
                    <li><Link to="/feed">Feed</Link></li>
                    {token ? (
                        <>
                            <li><Link to="/messages">Messages</Link></li>
                            <li><Link to="/create-gig" className="btn-create">+ Gig</Link></li>
                            <li><Link to="/create-post" className="btn-create">+ Post</Link></li>
                            <li><Link to="/profile">Profile</Link></li>
                            <li><button onClick={logout} className="btn-logout">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className="btn-login">Login</Link></li>
                            <li><Link to="/register" className="btn-signup">Sign Up</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
