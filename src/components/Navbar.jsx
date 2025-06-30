// Navbar.js
import { useState } from "react";
import { NavLink } from "react-router-dom";
import '../css/Navbar.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="container">
                <NavLink to="/" className="logo">
                    NextEvent
                </NavLink>

                {/* Burger menu sempre visibile */}
                <button className={`burger-menu ${isOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Sidebar */}
                <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                    <div className="sidebar-content">
                        <NavLink to="/" end onClick={toggleMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            Home
                        </NavLink>
                        <NavLink to="/events" onClick={toggleMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            Eventi
                        </NavLink>
                        <NavLink to="/contacts" onClick={toggleMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            Contatti
                        </NavLink>
                        {/* <NavLink to="/bookings" onClick={toggleMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            Prenota
                        </NavLink> */}
                    </div>
                </div>
            </div>
        </nav>
    );
}