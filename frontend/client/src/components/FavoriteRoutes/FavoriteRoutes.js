import React, { useState, useEffect } from 'react';
import { FaStar, FaTrash, FaRoute, FaSearch } from 'react-icons/fa';
import './FavoriteRoutes.css';

const FavoriteRoutes = ({ onRouteSelect }) => {
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavoriteRoutes();
  }, []);

  const fetchFavoriteRoutes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/routes/favorite', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const routes = await response.json();
        setFavoriteRoutes(routes);
      }
    } catch (error) {
      console.error('Error al cargar rutas favoritas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/routes/favorite/${routeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchFavoriteRoutes();
      }
    } catch (error) {
      console.error('Error al eliminar ruta:', error);
    }
  };

  const handleRouteClick = (route) => {
    const routeData = JSON.parse(route.routeData);
    onRouteSelect({
      origin: routeData.legs[0].start_location,
      destination: routeData.legs[0].end_location,
      routes: [routeData],
      selectedRouteIndex: 0
    });
  };

  const filteredRoutes = favoriteRoutes.filter(route =>
    route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="favorite-routes">
      <div className="favorite-routes-header">
        <h3><FaStar /> Rutas Favoritas</h3>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar ruta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="no-routes">
          <FaRoute className="empty-icon" />
          <p>{searchTerm ? 'No se encontraron rutas' : 'No hay rutas favoritas'}</p>
        </div>
      ) : (
        <div className="routes-list">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="route-item">
              <div className="route-content" onClick={() => handleRouteClick(route)}>
                <div className="route-details">
                  <div className="route-endpoints">
                    <span className="origin">{route.origin}</span>
                    <span className="separator">→</span>
                    <span className="destination">{route.destination}</span>
                  </div>
                  <div className="route-meta">
                    <span className="duration">{route.duration}</span>
                    <span className="distance">{route.distance}</span>
                  </div>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteRoute(route.id)}
                title="Eliminar ruta"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteRoutes; 