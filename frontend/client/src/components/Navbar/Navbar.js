import React from 'react';
import './Navbar.css';
import logoLeft from '../../assets/images/logo-left.png';
import logoRight from '../../assets/images/logo-right.png';

const Navbar = () => {
    return (
        <nav className="navbar">
            <img src={logoLeft} alt="Logo Izquierda" className="nav-logo-left" />
            <a href="/">TRRO</a>
            <a href="/Gallery">Galería</a>
            <a href="/About">Nosotros</a>
            <a href="/User">Usuario</a>
            <a href="/Buses">Colectivos</a>
            <img src={logoRight} alt="Logo Derecha" className="nav-logo-right" />
        </nav>
    );
};

export default Navbar;
