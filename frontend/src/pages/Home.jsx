import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Find Gigs & Opportunities on <span>CampusGig</span></h1>
                    <p>
                        The exclusive marketplace for students. Connect, collaborate, and build your career portfolio while earning money.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/gigs" className="btn btn-primary btn-lg">Browse Gigs</Link>
                        <Link to="/register" className="btn btn-outline btn-lg">Get Started</Link>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Placeholder for hero image if not exists, but keeping img tag */}
                    <img src="/hero.svg" alt="CampusGig Collaboration" onError={(e) => e.target.style.display = 'none'} />
                </div>
            </section>

            <section className="stats-bar">
                <div className="stats-container">
                    <div className="stat-item">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Active Students</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">120+</span>
                        <span className="stat-label">Gigs Posted</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">$5k+</span>
                        <span className="stat-label">Earned by Students</span>
                    </div>
                </div>
            </section>

            <section className="services">
                <div className="section-header">
                    <h2>How CampusGig Works</h2>
                    <p>Empowering students to foster a collaborative campus economy.</p>
                </div>
                <div className="service-cards">
                    <div className="card">
                        <div className="card-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
                        <h3>Find Opportunities</h3>
                        <p>Browse a wide variety of gigs from graphic design to tutoring, tailored for your schedule.</p>
                    </div>
                    <div className="card">
                        <div className="card-icon"><i className="fa-solid fa-bullhorn"></i></div>
                        <h3>Post a Gig</h3>
                        <p>Need help with a project or event? Post your requirements and hire talented peers.</p>
                    </div>
                    <div className="card">
                        <div className="card-icon"><i className="fa-solid fa-handshake"></i></div>
                        <h3>Connect & Network</h3>
                        <p>Build meaningful professional relationships within your campus community.</p>
                    </div>
                    <div className="card">
                        <div className="card-icon"><i className="fa-solid fa-briefcase"></i></div>
                        <h3>Build Your Portfolio</h3>
                        <p>Gain real-world experience and reviews to showcase to future employers.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
