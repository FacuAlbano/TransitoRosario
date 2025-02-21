import React, { useState, useEffect } from 'react';
import './Carrusel.css';

// Importamos todas las imágenes
const images = [
  require('../../assets/images/images1.jpg'),
  require('../../assets/images/images2.jpg'),
  require('../../assets/images/images3.jpg'),
  require('../../assets/images/images4.jpg'),
  require('../../assets/images/images5.jpg'),
  require('../../assets/images/images7.jpg'),
  require('../../assets/images/images8.jpg'),
  require('../../assets/images/images9.jpg'),
  require('../../assets/images/images10.jpg'),
];

const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Función para obtener el índice anterior
  const getPrevIndex = () => {
    return currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  };

  // Función para obtener el índice siguiente
  const getNextIndex = () => {
    return currentIndex === images.length - 1 ? 0 : currentIndex + 1;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="trro-carrusel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="trro-carrusel-button trro-prev" onClick={prevSlide}>
        &#10094;
      </button>
      
      <div className="trro-carrusel-slide-container">
        {/* Vista previa imagen anterior */}
        <div className="trro-preview-slide trro-preview-prev">
          <img 
            src={images[getPrevIndex()]} 
            alt={`Preview ${getPrevIndex() + 1}`}
            className="trro-preview-image"
          />
        </div>

        {/* Imagen principal */}
        <div className="trro-carrusel-slide">
          <img 
            src={images[currentIndex]} 
            alt={`Slide ${currentIndex + 1}`}
            className="trro-carrusel-image"
          />
        </div>

        {/* Vista previa imagen siguiente */}
        <div className="trro-preview-slide trro-preview-next">
          <img 
            src={images[getNextIndex()]} 
            alt={`Preview ${getNextIndex() + 1}`}
            className="trro-preview-image"
          />
        </div>
      </div>

      <button className="trro-carrusel-button trro-next" onClick={nextSlide}>
        &#10095;
      </button>

      <div className="trro-carrusel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`trro-carrusel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrusel; 