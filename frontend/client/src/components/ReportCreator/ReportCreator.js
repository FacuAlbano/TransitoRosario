import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa';
import './ReportCreator.css';
import { useReports } from '../../context/ReportContext';

const ReportCreator = () => {
  const { addReport } = useReports();
  const [reportData, setReportData] = useState({
    tipo_id: '',
    descripcion: '',
    latitud: null,
    longitud: null
  });
  const [userLocation, setUserLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Obtener ubicación al montar el componente
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setReportData(prev => ({
            ...prev,
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          // Ubicación por defecto: Rosario
          const defaultLocation = { lat: -32.9595, lng: -60.6393 };
          setUserLocation(defaultLocation);
          setReportData(prev => ({
            ...prev,
            latitud: defaultLocation.lat,
            longitud: defaultLocation.lng
          }));
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para crear reportes');
        return;
      }

      if (!reportData.latitud || !reportData.longitud) {
        alert('No se pudo obtener la ubicación. Por favor, intenta de nuevo.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo_id: parseInt(reportData.tipo_id),
          descripcion: reportData.descripcion,
          latitud: reportData.latitud,
          longitud: reportData.longitud
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el reporte');
      }

      const newReport = await response.json();
      addReport(newReport);

      setReportData({
        tipo_id: '',
        descripcion: '',
        latitud: userLocation?.lat || null,
        longitud: userLocation?.lng || null
      });

      alert('Reporte creado exitosamente');
    } catch (error) {
      console.error('Error:', error);
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
          value={reportData.tipo_id}
          onChange={(e) => setReportData(prev => ({ ...prev, tipo_id: e.target.value }))}
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

        <div className="location-info">
          {isGettingLocation ? (
            <div className="getting-location">
              <FaLocationArrow className="spinning" /> Obteniendo ubicación...
            </div>
          ) : userLocation ? (
            <div className="location-set">
              <FaMapMarkerAlt /> Ubicación establecida
              <button 
                type="button" 
                className="refresh-location"
                onClick={getCurrentLocation}
                title="Actualizar ubicación"
              >
                <FaLocationArrow />
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="get-location-btn"
              onClick={getCurrentLocation}
            >
              <FaLocationArrow /> Obtener ubicación
            </button>
          )}
        </div>

        <button 
          type="submit" 
          className="create-report-btn"
          disabled={isGettingLocation || !userLocation}
        >
          <FaExclamationTriangle /> Crear Reporte
        </button>
      </form>
    </div>
  );
};

export default ReportCreator; 