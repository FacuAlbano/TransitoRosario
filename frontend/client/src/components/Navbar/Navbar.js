import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import logoLeft from '../../assets/images/logo-left.png';
import logoRight from '../../assets/images/logo-right.png';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userData, logout } = useAuth();

    const handleAuthClick = () => {
        if (isAuthenticated) {
            logout();
            navigate('/login');
        } else {
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            <img src={logoLeft} alt="Logo Izquierda" className="nav-logo-left" />
            <Link to="/">TRRO</Link>
            <Link to="/gallery">Galería</Link>
            <Link to="/about">Nosotros</Link>
            <Link to="/user">Usuarios</Link>
            <Link to="/buses">Colectivos</Link>
            <button onClick={handleAuthClick} className="auth-button">
                {isAuthenticated ? 'Salir' : 'Ingresar'}
            </button>
            {userData && (
                <span className="user-info">
                    {userData.usuario} ({userData.rol})
                </span>
            )}
            <img src={logoRight} alt="Logo Derecha" className="nav-logo-right" />
        </nav>
    );
};

export default Navbar;
