import { Link } from "react-router-dom";
import '../css/Navbar.css'

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
                    <Link to="/eventi">Prenota</Link>
                    <Link to="/contacts">Contatti</Link>
                    <Link to="/contacts">Login</Link>
                </div>
            </div>
        </nav>
    );
}