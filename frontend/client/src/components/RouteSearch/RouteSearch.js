import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaMapMarkerAlt, FaExchangeAlt, FaTimes, FaStar } from 'react-icons/fa';
import './RouteSearch.css';

const RouteSearch = ({ userLocation, onRouteSelect }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const originAutocomplete = useRef(null);
  const destinationAutocomplete = useRef(null);
  const [routes, setRoutes] = useState([]);
  const [showRouteOptions, setShowRouteOptions] = useState(false);

  useEffect(() => {
    if (!window.google) return;

    const initAutocomplete = () => {
      const originInput = document.getElementById('origin-input');
      const destInput = document.getElementById('destination-input');

      if (originInput && destInput) {
        originAutocomplete.current = new window.google.maps.places.Autocomplete(originInput, {
          componentRestrictions: { country: 'AR' },
          fields: ['geometry', 'formatted_address']
        });

        destinationAutocomplete.current = new window.google.maps.places.Autocomplete(destInput, {
          componentRestrictions: { country: 'AR' },
          fields: ['geometry', 'formatted_address']
        });

        originAutocomplete.current.addListener('place_changed', () => {
          const place = originAutocomplete.current.getPlace();
          if (place.formatted_address) {
            setOrigin(place.formatted_address);
          }
        });

        destinationAutocomplete.current.addListener('place_changed', () => {
          const place = destinationAutocomplete.current.getPlace();
          if (place.formatted_address) {
            setDestination(place.formatted_address);
          }
        });
      }
    };

    initAutocomplete();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowRouteOptions(false);
    
    try {
      let originLoc, destLoc;

      if (!originAutocomplete.current?.getPlace()?.geometry || !destinationAutocomplete.current?.getPlace()?.geometry) {
        const geocoder = new window.google.maps.Geocoder();
        
        const [originResult, destResult] = await Promise.all([
          new Promise((resolve) => {
            geocoder.geocode({ address: origin + ', Argentina' }, (results, status) => {
              if (status === 'OK') resolve(results[0]);
              else resolve(null);
            });
          }),
          new Promise((resolve) => {
            geocoder.geocode({ address: destination + ', Argentina' }, (results, status) => {
              if (status === 'OK') resolve(results[0]);
              else resolve(null);
            });
          })
        ]);

        if (originResult && destResult) {
          originLoc = originResult.geometry.location;
          destLoc = destResult.geometry.location;
        }
      } else {
        const originPlace = originAutocomplete.current.getPlace();
        const destPlace = destinationAutocomplete.current.getPlace();
        originLoc = originPlace.geometry.location;
        destLoc = destPlace.geometry.location;
      }

      if (originLoc && destLoc) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route({
          origin: originLoc,
          destination: destLoc,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true
        }, (result, status) => {
          if (status === 'OK') {
            const routesWithInfo = result.routes.map((route, index) => ({
              ...route,
              duration: route.legs[0].duration.text,
              distance: route.legs[0].distance.text,
              isSelected: index === 0
            }));
            
            setRoutes(routesWithInfo);
            setShowRouteOptions(true);
            
            onRouteSelect({
              origin: originLoc,
              destination: destLoc,
              routes: result.routes,
              selectedRouteIndex: 0
            });
          }
        });
      }
    } catch (error) {
      console.error('Error al buscar la ruta:', error);
    }
  };

  const handleRouteSelect = (index) => {
    setRoutes(routes.map((route, i) => ({
      ...route,
      isSelected: i === index
    })));
    onRouteSelect({
      origin: routes[index].legs[0].start_location,
      destination: routes[index].legs[0].end_location,
      routes: routes,
      selectedRouteIndex: index
    });
  };

  const handleSaveRoute = async (route, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para guardar rutas');
        return;
      }

      // Preparar los datos de la ruta de forma más simple
      const routeData = {
        legs: route.legs.map(leg => ({
          distance: leg.distance.text,
          duration: leg.duration.text,
          start_location: {
            lat: leg.start_location.lat(),
            lng: leg.start_location.lng()
          },
          end_location: {
            lat: leg.end_location.lat(),
            lng: leg.end_location.lng()
          }
        })),
        overview_path: route.overview_path.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        })),
        bounds: {
          north: route.bounds.getNorthEast().lat(),
          south: route.bounds.getSouthWest().lat(),
          east: route.bounds.getNorthEast().lng(),
          west: route.bounds.getSouthWest().lng()
        }
      };

      console.log('Enviando datos:', {
        origin,
        destination,
        duration: route.duration,
        distance: route.distance,
        routeData
      });

      const response = await fetch('http://localhost:5000/api/routes/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          origin,
          destination,
          duration: route.duration,
          distance: route.distance,
          routeData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Error al guardar la ruta');
      }

      alert('Ruta guardada en favoritos');
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al guardar la ruta: ${error.message}`);
    }
  };

  const useCurrentLocation = () => {
    if (userLocation) {
      setOrigin('Mi ubicación actual');
      if (originAutocomplete.current) {
        originAutocomplete.current.set('place', {
          geometry: { location: userLocation },
          formatted_address: 'Mi ubicación actual'
        });
      }
    }
  };

  const clearInput = (field) => {
    if (field === 'origin') {
      setOrigin('');
    } else {
      setDestination('');
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
              autoComplete="off"
            />
            {origin && (
              <button type="button" className="clear-button" onClick={(e) => clearInput('origin')}>
                <FaTimes />
              </button>
            )}
            {userLocation && !origin && (
              <button type="button" className="use-location" onClick={useCurrentLocation}>
                <FaMapMarkerAlt />
              </button>
            )}
          </div>

          <button type="button" className="swap-button" onClick={swapLocations}>
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
              autoComplete="off"
            />
            {destination && (
              <button type="button" className="clear-button" onClick={(e) => clearInput('destination')}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        <button type="submit" className="search-button">
          <FaSearch /> Buscar Ruta
        </button>
      </form>

      {showRouteOptions && routes.length > 0 && (
        <div className="route-options">
          <h3>Rutas disponibles:</h3>
          {routes.map((route, index) => (
            <div
              key={index}
              className={`route-option ${route.isSelected ? 'selected' : ''}`}
              onClick={() => handleRouteSelect(index)}
            >
              <div className="route-info">
                <span className="route-duration">{route.duration}</span>
                <span className="route-distance">{route.distance}</span>
              </div>
              <button
                className="save-route-button"
                onClick={(e) => handleSaveRoute(route, e)}
              >
                <FaStar /> Guardar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteSearch; 