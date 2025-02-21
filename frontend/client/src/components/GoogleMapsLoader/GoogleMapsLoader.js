import React, { useEffect } from 'react';

const GoogleMapsLoader = ({ children, onLoad }) => {
  useEffect(() => {
    // Verificar si Google Maps ya está cargado
    if (window.google && window.google.maps) {
      onLoad && onLoad();
      return;
    }

    // Cargar el script de Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => onLoad && onLoad();
    
    document.head.appendChild(script);

    return () => {
      // Limpiar el script al desmontar
      document.head.removeChild(script);
    };
  }, [onLoad]);

  return <>{children}</>;
};

export default GoogleMapsLoader; 