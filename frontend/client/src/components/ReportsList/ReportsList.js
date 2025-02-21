import React, { useState, useEffect } from 'react';
import { FaClock, FaMapMarkerAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import './ReportsList.css';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';

// Agregar la función calculateAge
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const ReportsList = ({ userLocation }) => {
  const { reports, loading, fetchReports } = useReports();
  const { userData } = useAuth();
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    if (!reports) return;

    const now = new Date();
    const thirtyMinutesAgo = new Date(now - 30 * 60000);

    let filtered = reports.filter(report => {
      const expirationDate = new Date(report.fecha_expiracion);
      const creationDate = new Date(report.fecha_creacion);
      return (
        report.estado === 'activo' &&
        expirationDate > now &&
        creationDate > thirtyMinutesAgo
      );
    });

    if (filter !== 'all') {
      filtered = filtered.filter(report => report.tipo_id === parseInt(filter));
    }

    // Ordenar reportes
    filtered.sort((a, b) => {
      if (sort === 'recent') {
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
      } else {
        return new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
      }
    });

    setFilteredReports(filtered);
  }, [reports, filter, sort]);

  const canCreateReports = () => {
    if (!userData) return false;
    if (userData.rol_id === 5) return false; // Usuario menor de 16 años
    if (userData.rol_id === 1) {
      const age = calculateAge(userData.fechaNacimiento);
      return age >= 16;
    }
    return true; // Otros roles pueden crear reportes
  };

  const canVerifyReports = () => {
    return userData && (userData.rol_id === 3 || userData.rol_id === 4);
  };

  const handleConfirmReport = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al confirmar el reporte');
      }

      // Actualizar los reportes usando el contexto
      await fetchReports();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al confirmar el reporte');
    }
  };

  const handleVerifyReport = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al verificar el reporte');
      }

      fetchReports();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al verificar el reporte');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff/60)} minutos`;
    if (diff < 86400) return `hace ${Math.floor(diff/3600)} horas`;
    return date.toLocaleDateString();
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

  if (loading) {
    return <div className="reports-list loading">Cargando reportes...</div>;
  }

  if (!filteredReports.length) {
    return <div className="reports-list empty">No hay reportes activos</div>;
  }

  return (
    <div className="reports-list">
      <div className="reports-header">
        <h3><FaExclamationTriangle /> Reportes Activos</h3>
        <div className="reports-filters">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los tipos</option>
            <option value="1">Accidente</option>
            <option value="2">Obra</option>
            <option value="3">Corte</option>
            <option value="4">Manifestación</option>
            <option value="5">Inundación</option>
            <option value="6">Semáforo</option>
          </select>

          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </select>
        </div>
      </div>

      <div className="reports-container">
        {filteredReports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <span className={`report-type type-${report.tipo_id}`}>
                {report.tipo_nombre}
              </span>
              <span className="report-time">
                <FaClock /> {formatTime(report.fecha_creacion)}
              </span>
            </div>

            <div className="report-content">
              <p>{report.descripcion}</p>
              <div className="report-location">
                <FaMapMarkerAlt />
                {formatLocation(report.latitud, report.longitud)}
              </div>
            </div>

            <div className="report-footer">
              <span className="report-author">
                Por: {report.creador_nombre}
              </span>
              {canCreateReports() && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmReport(report.id);
                  }}
                  className="confirm-button"
                  title="Confirmar reporte"
                >
                  <FaCheck />
                </button>
              )}
              {canVerifyReports() && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVerifyReport(report.id);
                  }}
                  className="verify-button"
                  title="Verificar reporte"
                >
                  <FaExclamationTriangle />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsList; 