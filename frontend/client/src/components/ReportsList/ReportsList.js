import * as React from 'react';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaUser, FaExclamationCircle } from 'react-icons/fa';
import './ReportsList.css';

const ReportsList = ({ reports, userLocation }) => {
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState('all'); // all, nearby, route
  const [sortBy, setSortBy] = useState('date'); // date, distance

  useEffect(() => {
    if (!reports) return;

    let filtered = [...reports].filter(report => report.estado === 'activo');

    // Filtrar por ubicación
    if (filter === 'nearby' && userLocation) {
      filtered = filtered.filter(report => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          report.latitud,
          report.longitud
        );
        return distance <= 800; // 5 cuadras ≈ 800 metros
      });
    }

    // Ordenar reportes
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
      } else if (sortBy === 'distance' && userLocation) {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.latitud,
          a.longitud
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.latitud,
          b.longitud
        );
        return distA - distB;
      }
      return 0;
    });

    setFilteredReports(filtered);
  }, [reports, filter, sortBy, userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la tierra en metros
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters/1000).toFixed(1)} km`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // diferencia en segundos

    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff/60)} minutos`;
    if (diff < 86400) return `hace ${Math.floor(diff/3600)} horas`;
    return date.toLocaleDateString();
  };

  const getReportTypeIcon = (type) => {
    // Aquí podrías mapear los tipos de reporte a sus iconos correspondientes
    const icons = {
      1: <FaExclamationCircle className="type-icon accident" />,
      2: <FaExclamationCircle className="type-icon construction" />,
      3: <FaExclamationCircle className="type-icon road-closed" />,
      // ... más tipos
    };
    return icons[type] || <FaExclamationCircle className="type-icon" />;
  };

  return (
    <div className="reports-list">
      <div className="reports-header">
        <h3>Reportes Activos</h3>
        <div className="reports-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="nearby">Cercanos</option>
            <option value="route">En mi ruta</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Más recientes</option>
            <option value="distance">Más cercanos</option>
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="no-reports">
          <FaExclamationCircle />
          <p>No hay reportes activos {filter === 'nearby' ? 'en tu zona' : ''}</p>
        </div>
      ) : (
        <div className="reports-container">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                {getReportTypeIcon(report.tipo_id)}
                <h4>{report.tipo_nombre}</h4>
                <span className="report-time">
                  <FaClock /> {formatTime(report.fecha_creacion)}
                </span>
              </div>
              
              <div className="report-content">
                <p className="report-description">{report.descripcion}</p>
                
                <div className="report-details">
                  <div className="report-location">
                    <FaMapMarkerAlt />
                    {userLocation && (
                      <span>
                        {formatDistance(calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          report.latitud,
                          report.longitud
                        ))}
                      </span>
                    )}
                  </div>
                  
                  <div className="report-creator">
                    <FaUser />
                    <span>{report.creador_nombre}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsList; 