import React from 'react';
import './Footer.css';  // Importar el archivo CSS
import logoLeft from '../../assets/images/logo-left.png';
import logoRight from '../../assets/images/logo-right.png';

const Footer = () => {
    return (
        <footer className="footer">
            <img src={logoLeft} alt="Logo izquierdo" className="footer-logo-left" />
            
            <div className="footer-content">
                <div className="social-media">
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                </div>
                <p>© 2024 TRRO - Todos los derechos reservados.</p>
            </div>

            <img src={logoRight} alt="Logo derecho" className="footer-logo-right" />
        </footer>
    );
};

export default Footer;
