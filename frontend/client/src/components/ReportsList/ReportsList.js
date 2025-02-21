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
    
    let filtered = reports.filter(report => {
      const expirationDate = new Date(report.fecha_expiracion);
      return expirationDate > new Date();
    });

    if (filter !== 'all') {
      filtered = filtered.filter(report => report.tipo_id === parseInt(filter));
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha_creacion);
      const dateB = new Date(b.fecha_creacion);
      return sort === 'recent' ? dateB - dateA : dateA - dateB;
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

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' años';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' meses';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' días';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' horas';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutos';
    return Math.floor(seconds) + ' segundos';
  };

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
            <option value="Todos">🔍 Todos</option>
            <option value="Accidente">🚨 Accidentes</option>
            <option value="Obra">🚧 Obras</option>
            <option value="Corte">🚫 Cortes</option>
            <option value="Manifestación">👥 Manifestaciones</option>
            <option value="Inundación">💧 Inundaciones</option>
            <option value="Semáforo">🚦 Semáforos</option>
          </select>

          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
          >
            <option value="Más recientes">⌚ Más recientes</option>
            <option value="Más antiguos">📅 Más antiguos</option>
          </select>
        </div>
      </div>

      <div className="reports-container">
        {loading ? (
          <div className="loading">Cargando reportes...</div>
        ) : filteredReports.length === 0 ? (
          <div className="no-reports">
            <p>No hay reportes activos</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id} 
              className={`report-item ${report.estado}`}
            >
              <div className="report-type">
                {report.tipo_nombre}
                {report.confirmaciones > 0 && (
                  <span className="confirmations">
                    <FaCheck /> {report.confirmaciones}
                  </span>
                )}
              </div>
              <div className="report-content">
                <p className="report-description">{report.descripcion}</p>
                <div className="report-meta">
                  <span className="report-time">
                    <FaClock /> {getTimeAgo(report.fecha_creacion)}
                  </span>
                  <span className="report-location">
                    <FaMapMarkerAlt /> Ver en mapa
                  </span>
                </div>
              </div>
              <div className="report-actions">
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
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsList; 