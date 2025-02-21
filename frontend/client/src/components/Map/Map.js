import React, { useEffect, useRef } from 'react';
import './Map.css';

const Map = ({ userLocation, selectedRoute, activeReports, onMapLoad }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const defaultLocation = { lat: -32.9595, lng: -60.6393 }; // Rosario
    const location = userLocation || defaultLocation;

    const map = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 13,
      styles: mapStyles,
      mapTypeControl: false,
      fullscreenControl: false
    });

    mapInstance.current = map;
    if (onMapLoad) onMapLoad(map);

    // Marcador de ubicación del usuario
    if (userLocation) {
      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#03e9f4',
          fillOpacity: 0.7,
          strokeColor: '#03e9f4',
          strokeWeight: 2
        },
        title: 'Tu ubicación'
      });
    }
  }, [userLocation, onMapLoad]);

  // Actualizar marcadores de reportes
  useEffect(() => {
    if (!mapInstance.current || !activeReports) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    activeReports.forEach(report => {
      const marker = new window.google.maps.Marker({
        position: { lat: report.latitud, lng: report.longitud },
        map: mapInstance.current,
        icon: getReportIcon(report.tipo),
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(report)
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [activeReports]);

  const getReportIcon = (type) => {
    const icons = {
      1: { // Accidente
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#ff4444',
        fillOpacity: 0.7,
        strokeColor: '#ff4444',
        strokeWeight: 2,
        scale: 8
      },
      // ... otros tipos de reportes ...
    };
    return icons[type] || icons[1];
  };

  const createInfoWindowContent = (report) => {
    const date = new Date(report.fecha_creacion);
    return `
      <div class="report-info-window">
        <h3>${report.tipo_nombre}</h3>
        <p>${report.descripcion}</p>
        <div class="report-meta">
          <span>Reportado: ${date.toLocaleString()}</span>
        </div>
      </div>
    `;
  };

  // Mostrar ruta seleccionada
  useEffect(() => {
    if (!window.google || !mapInstance.current || !selectedRoute) return;

    // Limpiar rutas anteriores si existen
    if (window.currentDirectionsRenderer) {
      window.currentDirectionsRenderer.setMap(null);
    }

    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: mapInstance.current,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#03e9f4', // Cambiado a tu color principal
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    });

    window.currentDirectionsRenderer = directionsRenderer;

    // Si tenemos una ruta precomputada, la usamos directamente
    if (selectedRoute.routes && selectedRoute.routes.length > 0) {
      const response = {
        routes: selectedRoute.routes,
        request: {
          origin: selectedRoute.origin,
          destination: selectedRoute.destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        }
      };
      directionsRenderer.setDirections(response);

      // Ajustar el zoom para ver toda la ruta
      const bounds = new window.google.maps.LatLngBounds();
      selectedRoute.routes[0].legs.forEach(leg => {
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
        leg.steps.forEach(step => {
          bounds.extend(step.start_location);
          bounds.extend(step.end_location);
        });
      });
      mapInstance.current.fitBounds(bounds);
    } else {
      // Si no tenemos una ruta precomputada, calculamos una nueva
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: selectedRoute.origin,
        destination: selectedRoute.destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          
          // Ajustar el zoom para ver toda la ruta
          const bounds = new window.google.maps.LatLngBounds();
          response.routes[0].legs.forEach(leg => {
            leg.steps.forEach(step => {
              step.path.forEach(point => {
                bounds.extend(point);
              });
            });
          });
          mapInstance.current.fitBounds(bounds);
        }
      });
    }
  }, [selectedRoute]);

  return <div ref={mapRef} className="map-container" />;
};

// Mantén tus estilos de mapa actuales
const mapStyles = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#000000' }, { weight: 0.5 }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#193341' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#2c5a71' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#29768a' }, { lightness: -37 }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#406d80' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#406d80' }]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'on' }, { color: '#2f3948' }]
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }]
  }
];

export default Map; 