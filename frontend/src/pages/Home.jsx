import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Find Gigs & Opportunities on Campus</h1>
                    <p>
                        Connect with students, find freelance work, and build your portfolio
                        while earning money on campus.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/gigs" className="btn-primary">Browse Gigs</Link>
                        <Link to="/register" className="btn-secondary">Get Started</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/hero.svg" alt="CampusGig Hero" />
                </div>
            </section>

            <section className="about">
                <h2>About CampusGig</h2>
                <p>
                    CampusGig is a platform designed specifically for students to find
                    freelance opportunities, part-time gigs, and connect with peers for
                    collaborative projects. Whether you're looking to earn extra income
                    or build your professional portfolio, we've got you covered.
                </p>
            </section>

            <section className="services">
                <h2>What We Offer</h2>
                <div className="service-cards">
                    <div className="card">
                        <h3>🎯 Find Gigs</h3>
                        <p>Browse through various opportunities posted by students and campus organizations.</p>
                    </div>
                    <div className="card">
                        <h3>💼 Post Jobs</h3>
                        <p>Need help with a project? Post your gig and find talented students.</p>
                    </div>
                    <div className="card">
                        <h3>🤝 Network</h3>
                        <p>Connect with fellow students and build your professional network.</p>
                    </div>
                    <div className="card">
                        <h3>📈 Build Portfolio</h3>
                        <p>Showcase your work and gain valuable experience for your future career.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
