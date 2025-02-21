import * as React from 'react';
import { useState, useEffect } from 'react';
import { FaStar, FaTrash, FaRoute, FaSearch } from 'react-icons/fa';
import './FavoriteRoutes.css';

const FavoriteRoutes = ({ userData, onRouteSelect }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!userData) return;
    loadFavorites();
  }, [userData]);

  const loadFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/routes/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        throw new Error('Error cargando favoritos');
      }
    } catch (error) {
      setError('Error al cargar las rutas favoritas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/routes/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== id));
      } else {
        throw new Error('Error eliminando favorito');
      }
    } catch (error) {
      setError('Error al eliminar la ruta favorita');
    }
  };

  const handleSelect = (favorite) => {
    onRouteSelect({
      origin: favorite.origen,
      destination: favorite.destino
    });
  };

  const filteredFavorites = favorites.filter(fav => 
    fav.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.destino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="favorite-routes loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="favorite-routes">
      <div className="favorite-routes-header">
        <h3><FaStar /> Rutas Favoritas</h3>
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar ruta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {filteredFavorites.length === 0 ? (
        <div className="no-favorites">
          <FaRoute />
          <p>{searchTerm ? 'No se encontraron rutas' : 'No hay rutas favoritas'}</p>
        </div>
      ) : (
        <div className="favorites-list">
          {filteredFavorites.map((favorite) => (
            <div key={favorite.id} className="favorite-route-card">
              <div className="route-info" onClick={() => handleSelect(favorite)}>
                <div className="route-points">
                  <div className="origin">
                    <span className="label">Desde:</span>
                    <span className="value">{favorite.origen}</span>
                  </div>
                  <div className="destination">
                    <span className="label">Hasta:</span>
                    <span className="value">{favorite.destino}</span>
                  </div>
                </div>
                <div className="route-meta">
                  <span className="date">
                    {new Date(favorite.fecha_creacion).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(favorite.id)}
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