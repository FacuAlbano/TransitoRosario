import React, { useEffect, useRef } from 'react';
import './Map.css';

const Map = ({ google, userLocation, selectedRoute, activeReports }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Inicializar el mapa
  useEffect(() => {
    if (!google || !mapRef.current) return;

    const defaultLocation = { lat: -32.9595, lng: -60.6393 }; // Rosario
    const location = userLocation || defaultLocation;

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: location,
      zoom: 13,
      styles: mapStyles,
      mapTypeControl: false,
      fullscreenControl: false
    });

    // Marcador de ubicación del usuario
    if (userLocation) {
      new google.maps.Marker({
        position: userLocation,
        map: mapInstance.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#03e9f4',
          fillOpacity: 0.7,
          strokeColor: '#03e9f4',
          strokeWeight: 2
        },
        title: 'Tu ubicación'
      });
    }
  }, [google, userLocation]);

  // Actualizar marcadores de reportes
  useEffect(() => {
    if (!google || !mapInstance.current || !activeReports) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    activeReports.forEach(report => {
      const marker = new google.maps.Marker({
        position: { lat: report.latitud, lng: report.longitud },
        map: mapInstance.current,
        icon: getReportIcon(report.tipo),
        animation: google.maps.Animation.DROP
      });

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(report)
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [google, activeReports]);

  const getReportIcon = (type) => {
    const icons = {
      1: { // Accidente
        path: google.maps.SymbolPath.CIRCLE,
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
    if (!google || !mapInstance.current || !selectedRoute) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: mapInstance.current
    });

    directionsService.route({
      origin: selectedRoute.origin,
      destination: selectedRoute.destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      }
    });
  }, [google, selectedRoute]);

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