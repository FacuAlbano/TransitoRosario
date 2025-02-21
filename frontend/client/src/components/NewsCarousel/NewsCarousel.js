import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './NewsCarousel.css';

const NewsCarousel = ({ reports }) => {
  const [activeReports, setActiveReports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!reports) return;
    const filtered = reports.filter(report => report.estado === 'activo');
    setActiveReports(filtered);
  }, [reports]);

  useEffect(() => {
    let interval;
    if (isAutoPlaying && activeReports.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(current => 
          current === activeReports.length - 1 ? 0 : current + 1
        );
      }, 5000); // Cambiar cada 5 segundos
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, activeReports.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(current => 
      current === 0 ? activeReports.length - 1 : current - 1
    );
    setIsAutoPlaying(false);
  }, [activeReports.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(current => 
      current === activeReports.length - 1 ? 0 : current + 1
    );
    setIsAutoPlaying(false);
  }, [activeReports.length]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff/60)} minutos`;
    if (diff < 86400) return `hace ${Math.floor(diff/3600)} horas`;
    return date.toLocaleDateString();
  };

  const getReportTypeColor = (type) => {
    const colors = {
      1: '#ff4444', // Accidente
      2: '#ffbb33', // Obra
      3: '#00C851', // Corte
      4: '#33b5e5', // Manifestación
      5: '#2BBBAD', // Inundación
      6: '#aa66cc'  // Semáforo
    };
    return colors[type] || '#03e9f4';
  };

  if (!activeReports.length) {
    return null;
  }

  const currentReport = activeReports[currentIndex];

  return (
    <div 
      className="news-carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="carousel-content">
        <button 
          className="nav-button prev"
          onClick={handlePrevious}
          disabled={activeReports.length <= 1}
        >
          <FaChevronLeft />
        </button>

        <div className="report-slide">
          <div 
            className="report-type-indicator"
            style={{ backgroundColor: getReportTypeColor(currentReport.tipo_id) }}
          >
            {currentReport.tipo_nombre}
          </div>

          <div className="report-main-content">
            <h4>{currentReport.descripcion}</h4>
            
            <div className="report-details">
              <div className="location">
                <FaMapMarkerAlt />
                <span>{currentReport.ubicacion}</span>
              </div>
              
              <div className="time">
                <FaClock />
                <span>{formatTime(currentReport.fecha_creacion)}</span>
              </div>
            </div>
          </div>

          <div className="progress-bar">
            <div 
              className="progress"
              style={{
                width: `${((currentIndex + 1) / activeReports.length) * 100}%`,
                backgroundColor: getReportTypeColor(currentReport.tipo_id)
              }}
            />
          </div>
        </div>

        <button 
          className="nav-button next"
          onClick={handleNext}
          disabled={activeReports.length <= 1}
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="carousel-indicators">
        {activeReports.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            style={{
              backgroundColor: index === currentIndex 
                ? getReportTypeColor(currentReport.tipo_id)
                : undefined
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel; 