import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaMapMarkerAlt, FaExchangeAlt, FaTimes, FaStar, FaRoute } from 'react-icons/fa';
import './RouteSearch.css';

const RouteSearch = ({ userLocation, onRouteSelect }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const originAutocomplete = useRef(null);
  const destinationAutocomplete = useRef(null);
  const [routes, setRoutes] = useState([]);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

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
    setShowRouteOptions(true);
    setSelectedRoute(null);
    
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
        
        // Solicitar múltiples rutas con diferentes configuraciones
        const routeRequests = [
          {
            origin: originLoc,
            destination: destLoc,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
            optimizeWaypoints: false,
            avoidHighways: false,
            avoidTolls: false
          },
          {
            origin: originLoc,
            destination: destLoc,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
            avoidHighways: true // Evitar autopistas
          },
          {
            origin: originLoc,
            destination: destLoc,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
            avoidTolls: true // Evitar peajes
          }
        ];

        const allRoutes = await Promise.all(
          routeRequests.map(request => 
            new Promise((resolve) => {
              directionsService.route(request, (result, status) => {
                if (status === 'OK') {
                  resolve(result.routes);
                } else {
                  resolve([]);
                }
              });
            })
          )
        );

        // Combinar y filtrar rutas únicas
        const uniqueRoutes = allRoutes
          .flat()
          .filter((route, index, self) => {
            if (index === 0) return true;
            const prevRoutes = self.slice(0, index);
            return !prevRoutes.some(prevRoute => 
              Math.abs(route.legs[0].distance.value - prevRoute.legs[0].distance.value) < 1000 &&
              Math.abs(route.legs[0].duration.value - prevRoute.legs[0].duration.value) < 300
            );
          });

        const routesWithInfo = uniqueRoutes.map((route, index) => ({
          ...route,
          duration: route.legs[0].duration.text,
          distance: route.legs[0].distance.text,
          via: getMainRoadName(route),
          isSelected: index === 0,
          characteristics: getRouteCharacteristics(route)
        }));
        
        setRoutes(routesWithInfo);
        setSelectedRoute(routesWithInfo[0]);
        onRouteSelect({
          origin: originLoc,
          destination: destLoc,
          routes: routesWithInfo,
          selectedRouteIndex: 0
        });
      }
    } catch (error) {
      console.error('Error al buscar la ruta:', error);
    }
  };

  const handleRouteSelect = (index) => {
    const selectedRoute = routes[index];
    
    // Actualizar el estado de las rutas
    setRoutes(routes.map((route, i) => ({
      ...route,
      isSelected: i === index
    })));
    
    setSelectedRoute(selectedRoute);

    // Pasar la ruta seleccionada al mapa
    onRouteSelect({
      origin: selectedRoute.legs[0].start_location,
      destination: selectedRoute.legs[0].end_location,
      routes: [selectedRoute], // Pasar la ruta completa
      selectedRouteIndex: 0
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

  const getMainRoadName = (route) => {
    try {
      const steps = route.legs[0].steps;
      let longestStep = steps[0];
      
      steps.forEach(step => {
        if (step.distance.value > longestStep.distance.value) {
          longestStep = step;
        }
      });

      return longestStep.instructions
        .replace(/<[^>]*>/g, '')
        .replace(/Dirígete|Gira|hacia|por|el|la|los|las/gi, '')
        .trim();
    } catch (error) {
      return '';
    }
  };

  const getRouteCharacteristics = (route) => {
    const characteristics = [];
    const distance = route.legs[0].distance.value;
    const duration = route.legs[0].duration.value;
    const steps = route.legs[0].steps;

    if (steps.some(step => step.instructions.includes('autopista'))) {
      characteristics.push('Usa autopista');
    }
    if (distance < 10000) {
      characteristics.push('Ruta corta');
    }
    if (steps.length < 5) {
      characteristics.push('Pocas vueltas');
    }
    return characteristics;
  };

  return (
    <form className="route-search" onSubmit={handleSearch}>
      <div className="route-inputs">
        <div className="input-group">
          <FaMapMarkerAlt className="location-icon" />
          <input
            id="origin-input"
            type="text"
            placeholder="Origen"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <div className="action-buttons">
            {origin && (
              <button type="button" className="clear-button" onClick={() => clearInput('origin')}>
                <FaTimes />
              </button>
            )}
            {userLocation && !origin && (
              <button type="button" className="use-location" onClick={useCurrentLocation}>
                <FaMapMarkerAlt />
              </button>
            )}
          </div>
        </div>

        <div className="input-group">
          <FaMapMarkerAlt className="location-icon" />
          <input
            id="destination-input"
            type="text"
            placeholder="Destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          {destination && (
            <button type="button" className="clear-button" onClick={() => clearInput('destination')}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="button-group">
        <button type="button" className="swap-button" onClick={swapLocations}>
          <FaExchangeAlt />
        </button>
        <button type="submit" className="search-button">
          <FaSearch /> Buscar Ruta
        </button>
      </div>

      {showRouteOptions && routes.length > 0 && (
        <div className="route-options">
          <div className="route-options-header">
            <h3>
              <FaRoute /> Rutas sugeridas
            </h3>
            <button 
              className="minimize-button"
              onClick={() => setShowRouteOptions(false)}
              title="Minimizar"
            >
              <FaTimes />
            </button>
          </div>
          
          {routes.map((route, index) => (
            <div
              key={index}
              className={`route-option ${route.isSelected ? 'selected' : ''}`}
              onClick={() => handleRouteSelect(index)}
            >
              <div className="route-info">
                <div className="route-main-info">
                  <span className="route-duration">{route.duration}</span>
                  <span className="route-distance">{route.distance}</span>
                </div>
                {route.via && (
                  <span className="route-via">vía {route.via}</span>
                )}
                <div className="route-characteristics">
                  {route.characteristics.map((char, i) => (
                    <span key={i} className="characteristic-tag">{char}</span>
                  ))}
                </div>
              </div>
              <button
                className="save-route-button"
                onClick={(e) => handleSaveRoute(route, e)}
                title="Guardar en favoritos"
              >
                <FaStar />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRoute && !showRouteOptions && (
        <div className="selected-route">
          <div className="selected-route-info">
            <span>{selectedRoute.duration}</span>
            <span>{selectedRoute.distance}</span>
          </div>
          <button 
            className="show-alternatives"
            onClick={() => setShowRouteOptions(true)}
          >
            Ver alternativas
          </button>
        </div>
      )}
    </form>
  );
};

export default RouteSearch; 