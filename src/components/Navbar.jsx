import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">
                    NextEvent
                </Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/eventi">Tutti gli Eventi</Link>
                    <Link to="/contacts">Contatti</Link>
                </div>
            </div>
        </nav>
    );
}