import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './NewsCarousel.css';

const NewsCarousel = () => {
  const [activeReports, setActiveReports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Obtener reportes del servidor
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/reports/active', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al obtener reportes');
        
        const data = await response.json();
        const now = new Date();
        const thirtyMinutesAgo = new Date(now - 30 * 60000);

        const filtered = data.filter(report => {
          const expirationDate = new Date(report.fecha_expiracion);
          const creationDate = new Date(report.fecha_creacion);
          return (
            report.estado === 'activo' &&
            expirationDate > now &&
            creationDate > thirtyMinutesAgo
          );
        });

        setActiveReports(filtered);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchReports();
    // Actualizar más frecuentemente
    const interval = setInterval(fetchReports, 15000); // Cada 15 segundos
    return () => clearInterval(interval);
  }, []);

  // Auto-reproducción
  useEffect(() => {
    let interval;
    if (isAutoPlaying && activeReports.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(current => 
          current === activeReports.length - 1 ? 0 : current + 1
        );
      }, 5000);
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

  const formatLocation = (lat, lng) => {
    try {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      if (isNaN(latitude) || isNaN(longitude)) {
        return 'Ubicación no disponible';
      }
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      return 'Ubicación no disponible';
    }
  };

  if (!activeReports.length) {
    return <div className="news-carousel empty">No hay reportes activos</div>;
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

        <div className="report-slide" data-type={currentReport.tipo_id}>
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
                <span>
                  {formatLocation(currentReport.latitud, currentReport.longitud)}
                </span>
              </div>
              
              <div className="time">
                <FaClock />
                <span>{formatTime(currentReport.fecha_creacion)}</span>
              </div>
            </div>
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