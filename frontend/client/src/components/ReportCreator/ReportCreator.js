import React, { useState } from 'react';
import './ReportCreator.css';

const ReportCreator = ({ userLocation, onReportCreated }) => {
  const [reportData, setReportData] = useState({
    tipo: '',
    descripcion: '',
    latitud: userLocation?.lat || 0,
    longitud: userLocation?.lng || 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        const newReport = await response.json();
        onReportCreated(newReport);
        setReportData({
          tipo: '',
          descripcion: '',
          latitud: userLocation?.lat || 0,
          longitud: userLocation?.lng || 0
        });
      }
    } catch (error) {
      console.error('Error al crear reporte:', error);
    }
  };

  return (
    <div className="report-creator">
      <h3>Crear Reporte</h3>
      <form onSubmit={handleSubmit}>
        <select
          value={reportData.tipo}
          onChange={(e) => setReportData({ ...reportData, tipo: e.target.value })}
          required
        >
          <option value="">Selecciona un tipo</option>
          <option value="1">Accidente</option>
          <option value="2">Obra</option>
          <option value="3">Corte</option>
          <option value="4">Manifestación</option>
          <option value="5">Inundación</option>
          <option value="6">Semáforo</option>
        </select>

        <textarea
          value={reportData.descripcion}
          onChange={(e) => setReportData({ ...reportData, descripcion: e.target.value })}
          placeholder="Descripción del incidente..."
          required
        />

        <button type="submit">Crear Reporte</button>
      </form>
    </div>
  );
};

export default ReportCreator; 