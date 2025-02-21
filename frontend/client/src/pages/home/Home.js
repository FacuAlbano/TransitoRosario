import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../../components/Map/Map';
import RouteSearch from '../../components/RouteSearch/RouteSearch';
import ReportsList from '../../components/ReportsList/ReportsList';
import ReportCreator from '../../components/ReportCreator/ReportCreator';
import NewsCarousel from '../../components/NewsCarousel/NewsCarousel';
import FavoriteRoutes from '../../components/FavoriteRoutes/FavoriteRoutes';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeReports, setActiveReports] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    requestLocation();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
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
        }
      );
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="map-section">
          <Map 
            userLocation={userLocation}
            selectedRoute={selectedRoute}
            activeReports={activeReports}
          />
          <RouteSearch 
            userLocation={userLocation}
            onRouteSelect={setSelectedRoute}
          />
        </div>
        
        <div className="side-content">
          <NewsCarousel reports={activeReports} />
          
          {userData && userData.rol_id !== 5 && ( // No mostrar para menores de 16
            <ReportCreator 
              userLocation={userLocation}
              userData={userData}
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