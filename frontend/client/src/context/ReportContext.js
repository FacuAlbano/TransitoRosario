import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReportContext = createContext();

export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/reports/active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Reportes cargados:', data); // Para debug
        setReports(data);
      } else {
        console.error('Error al cargar reportes:', await response.text());
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reportes inicialmente y cuando cambie la autenticación
  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated]);

  // Actualizar reportes periódicamente
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(fetchReports, 30000); // Cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const addReport = (newReport) => {
    console.log('Añadiendo nuevo reporte:', newReport); // Para debug
    setReports(prevReports => {
      const updated = [...prevReports, newReport];
      return updated;
    });
  };

  const updateReport = (reportId, updates) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId ? { ...report, ...updates } : report
      )
    );
  };

  return (
    <ReportContext.Provider value={{ 
      reports, 
      loading,
      fetchReports, 
      addReport, 
      updateReport 
    }}>
      {children}
    </ReportContext.Provider>
  );
}; 