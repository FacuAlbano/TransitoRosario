import * as React from 'react';
import { useState, useEffect } from 'react';

const GoogleMapsLoader = ({ children, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [googleInstance, setGoogleInstance] = useState(null);
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (window.google) {
      setIsLoaded(true);
      setGoogleInstance(window.google);
      if (onLoad) onLoad(window.google);
      return;
    }

    const loadGoogleMaps = () => {
      if (document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
        setGoogleInstance(window.google);
        if (onLoad) onLoad(window.google);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [GOOGLE_MAPS_API_KEY, onLoad]);

  if (!isLoaded || !googleInstance) {
    return <div>Cargando Google Maps...</div>;
  }

  // Clonar los children y pasarles google como prop
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { google: googleInstance });
    }
    return child;
  });
};

export default GoogleMapsLoader; 