import React, { useState, useEffect } from 'react';
import { FaClock, FaMapMarkerAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import './ReportsList.css';

const ReportsList = ({ reports, onReportClick, userRole }) => {
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState('Más recientes');

  useEffect(() => {
    if (!reports) return;
    let filtered = [...reports];

    if (filter !== 'Todos') {
      filtered = filtered.filter(report => report.tipo_nombre === filter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha_creacion);
      const dateB = new Date(b.fecha_creacion);
      return sortBy === 'Más recientes' ? dateB - dateA : dateA - dateB;
    });

    setFilteredReports(filtered);
  }, [reports, filter, sortBy]);

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

      // Actualizar la lista de reportes
      if (onReportClick) {
        onReportClick(reportId, 'confirm');
      }
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

      if (onReportClick) {
        onReportClick(reportId, 'verify');
      }
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="Más recientes">⌚ Más recientes</option>
            <option value="Más antiguos">📅 Más antiguos</option>
          </select>
        </div>
      </div>

      <div className="reports-container">
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <p>No hay reportes activos</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id} 
              className={`report-item ${report.estado}`}
              onClick={() => onReportClick && onReportClick(report)}
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
                {userRole === 'usuario' && (
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
                {userRole === 'admin' && (
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