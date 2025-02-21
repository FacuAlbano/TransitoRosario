import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaExchangeAlt } from 'react-icons/fa';
import './RouteSearch.css';

const RouteSearch = ({ google, userLocation, onRouteSelect }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originAutocomplete, setOriginAutocomplete] = useState(null);
  const [destAutocomplete, setDestAutocomplete] = useState(null);

  useEffect(() => {
    if (!google) return;

    // Inicializar autocompletado para origen
    const originInput = document.getElementById('origin-input');
    const originAC = new google.maps.places.Autocomplete(originInput, {
      componentRestrictions: { country: 'AR' },
      fields: ['geometry', 'formatted_address']
    });
    setOriginAutocomplete(originAC);

    // Inicializar autocompletado para destino
    const destInput = document.getElementById('destination-input');
    const destAC = new google.maps.places.Autocomplete(destInput, {
      componentRestrictions: { country: 'AR' },
      fields: ['geometry', 'formatted_address']
    });
    setDestAutocomplete(destAC);
  }, [google]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (originAutocomplete && destAutocomplete) {
      const originPlace = originAutocomplete.getPlace();
      const destPlace = destAutocomplete.getPlace();

      if (originPlace?.geometry && destPlace?.geometry) {
        onRouteSelect({
          origin: originPlace.geometry.location,
          destination: destPlace.geometry.location
        });
      }
    }
  };

  const useCurrentLocation = () => {
    if (userLocation) {
      setOrigin('Mi ubicación');
      if (originAutocomplete) {
        originAutocomplete.set('place', {
          geometry: { location: userLocation }
        });
      }
    }
  };

  const swapLocations = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  return (
    <div className="route-search">
      <form onSubmit={handleSearch}>
        <div className="search-inputs">
          <div className="input-group">
            <FaMapMarkerAlt className="icon origin-icon" />
            <input
              id="origin-input"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Origen"
              required
            />
            {userLocation && (
              <button
                type="button"
                className="use-location"
                onClick={useCurrentLocation}
                title="Usar ubicación actual"
              >
                <FaMapMarkerAlt />
              </button>
            )}
          </div>

          <button
            type="button"
            className="swap-button"
            onClick={swapLocations}
            title="Intercambiar origen y destino"
          >
            <FaExchangeAlt />
          </button>

          <div className="input-group">
            <FaMapMarkerAlt className="icon destination-icon" />
            <input
              id="destination-input"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destino"
              required
            />
          </div>
        </div>

        <button type="submit" className="search-button">
          <FaSearch /> Buscar Ruta
        </button>
      </form>
    </div>
  );
};

export default RouteSearch; 