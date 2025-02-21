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
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No hay token disponible');
        return;
      }

      const response = await fetch('http://localhost:5000/api/reports/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener reportes: ${await response.text()}`);
      }

      const data = await response.json();
      setReports(data);
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
    setReports(prevReports => [...prevReports, newReport]);
  };

  const updateReport = (reportId, updates) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId ? { ...report, ...updates } : report
      )
    );
  };

  const removeReport = (reportId) => {
    setReports(prevReports => 
      prevReports.filter(report => report.id !== reportId)
    );
  };

  return (
    <ReportContext.Provider value={{ 
      reports, 
      loading,
      fetchReports, 
      addReport, 
      updateReport,
      removeReport
    }}>
      {children}
    </ReportContext.Provider>
  );
}; 