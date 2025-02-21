import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleMapsLoader from '../../components/GoogleMapsLoader/GoogleMapsLoader';
import Map from '../../components/Map/Map';
import RouteSearch from '../../components/RouteSearch/RouteSearch';
import ReportsList from '../../components/ReportsList/ReportsList';
import ReportCreator from '../../components/ReportCreator/ReportCreator';
import NewsCarousel from '../../components/NewsCarousel/NewsCarousel';
import FavoriteRoutes from '../../components/FavoriteRoutes/FavoriteRoutes';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [activeReports, setActiveReports] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState(null);

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

  const handleRouteSelect = (routeData) => {
    setSelectedRoute(routeData);
    if (mapInstance) {
      // Limpiar rutas anteriores
      if (window.currentDirectionsRenderer) {
        window.currentDirectionsRenderer.setMap(null);
      }

      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#2196F3',
          strokeWeight: 6,
          strokeOpacity: 0.8
        }
      });

      window.currentDirectionsRenderer = directionsRenderer;

      if (routeData.selectedRouteIndex !== undefined) {
        directionsRenderer.setRouteIndex(routeData.selectedRouteIndex);
      }

      directionsRenderer.setDirections({
        routes: routeData.routes,
        request: {
          origin: routeData.origin,
          destination: routeData.destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        }
      });
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="home-container">
      <div className="map-section">
        <GoogleMapsLoader>
          <Map
            userLocation={userLocation}
            selectedRoute={selectedRoute}
            activeReports={activeReports}
            onMapLoad={setMapInstance}
          />
          <RouteSearch
            userLocation={userLocation}
            onRouteSelect={handleRouteSelect}
          />
        </GoogleMapsLoader>
      </div>
      
      <div className="side-panel">
        <ReportCreator
          userLocation={userLocation}
          onReportCreated={(report) => {
            setActiveReports([...activeReports, report]);
          }}
        />
        
        <NewsCarousel reports={activeReports} />
        
        <ReportsList
          reports={activeReports}
          userLocation={userLocation}
        />
        
        {userData && userData.rol_id !== 5 && (
          <FavoriteRoutes 
            userData={userData}
            onRouteSelect={setSelectedRoute}
          />
        )}
      </div>
    </div>
  );
};

export default Home;