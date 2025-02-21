import React, { useState } from 'react';
import { FaExclamationTriangle, FaMapMarkerAlt } from 'react-icons/fa';
import './ReportCreator.css';

const ReportCreator = ({ userLocation, onReportCreated }) => {
  const [reportData, setReportData] = useState({
    tipo: '',
    descripcion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para crear reportes');
        return;
      }

      if (!userLocation) {
        alert('No se pudo obtener la ubicación');
        return;
      }

      // Formatear la fecha correctamente para MySQL
      const fecha = new Date(Date.now() + 24*60*60*1000);
      const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');

      const reporteData = {
        tipo_id: parseInt(reportData.tipo),
        descripcion: reportData.descripcion,
        latitud: userLocation.lat,
        longitud: userLocation.lng,
        fecha_expiracion: fechaFormateada
      };

      console.log('Enviando datos:', reporteData);

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reporteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Error al crear el reporte');
      }

      const data = await response.json();

      setReportData({
        tipo: '',
        descripcion: ''
      });

      if (onReportCreated) {
        onReportCreated(data);
      }

      alert('Reporte creado exitosamente');
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="report-creator">
      <h3>
        <FaExclamationTriangle /> Crear Reporte
      </h3>
      <form onSubmit={handleSubmit}>
        <select
          value={reportData.tipo}
          onChange={(e) => setReportData(prev => ({ ...prev, tipo: e.target.value }))}
          required
        >
          <option value="">Selecciona un tipo de incidente</option>
          <option value="1">🚨 Accidente</option>
          <option value="2">🚧 Obra</option>
          <option value="3">🚫 Corte</option>
          <option value="4">👥 Manifestación</option>
          <option value="5">💧 Inundación</option>
          <option value="6">🚦 Semáforo</option>
        </select>

        <textarea
          value={reportData.descripcion}
          onChange={(e) => setReportData(prev => ({ ...prev, descripcion: e.target.value }))}
          placeholder="Describe el incidente..."
          required
        />

        {userLocation && (
          <div className="location-info">
            <FaMapMarkerAlt /> Ubicación seleccionada
          </div>
        )}

        <button type="submit" className="create-report-btn">
          <FaExclamationTriangle /> Crear Reporte
        </button>
      </form>
    </div>
  );
};

export default ReportCreator; 