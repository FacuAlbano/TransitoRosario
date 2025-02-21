import React from 'react';
import './Gallery.css';
import Carrusel from '../../components/carrusel/Carrusel';

function Gallery() {
  return (
    <div className="galeria-page">
      <main className="galeria-content">
        <h1>Galería de Imágenes</h1>
        <p className="galeria-description">
          Explora nuestra colección de imágenes del transporte público en Rosario
        </p>
        <Carrusel />
      </main>
    </div>
  );
}

export default Gallery; 