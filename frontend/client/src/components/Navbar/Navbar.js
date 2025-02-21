import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';
import logoLeft from '../../assets/images/logo-left.png';
import logoRight from '../../assets/images/logo-right.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setUserData(data.user);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                handleLogout();
            }
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        }
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserData(null);
        navigate('/login');
    };

    const handleAuthClick = () => {
        if (isAuthenticated) {
            handleLogout();
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
