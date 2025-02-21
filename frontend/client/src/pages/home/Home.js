import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleMapsLoader from '../../components/GoogleMapsLoader/GoogleMapsLoader';
import Map from '../../components/Map/Map';
import RouteSearch from '../../components/RouteSearch/RouteSearch';
import ReportsList from '../../components/ReportsList/ReportsList';
import ReportCreator from '../../components/ReportCreator/ReportCreator';
import NewsCarousel from '../../components/NewsCarousel/NewsCarousel';
import FavoriteRoutes from '../../components/FavoriteRoutes/FavoriteRoutes';
import './Home.css';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [activeReports, setActiveReports] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setUserLocation({ lat: -32.9595, lng: -60.6393 }); // Rosario por defecto
        }
      );
    }

    // Cargar reportes activos
    fetchActiveReports();
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const fetchActiveReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/active');
      if (response.ok) {
        const data = await response.json();
        setActiveReports(data);
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="map-section">
          <GoogleMapsLoader>
            <Map 
              userLocation={userLocation}
              selectedRoute={selectedRoute}
              activeReports={activeReports}
            />
          </GoogleMapsLoader>
          <RouteSearch 
            userLocation={userLocation}
            onRouteSelect={setSelectedRoute}
          />
        </div>
        
        <div className="side-content">
          <NewsCarousel reports={activeReports} />
          
          {userData && userData.rol_id !== 5 && (
            <ReportCreator 
              userLocation={userLocation}
              onReportCreated={(report) => {
                setActiveReports([...activeReports, report]);
              }}
            />
          )}
          
          <ReportsList 
            reports={activeReports}
            userLocation={userLocation}
          />
          
          <FavoriteRoutes 
            userData={userData}
            onRouteSelect={setSelectedRoute}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;