import React, { useEffect, useState } from 'react';

const GoogleMapsLoader = ({ onLoad, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyB__T70Nbx-i_jyz2awR8zjYN7NsXOgYx0';

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [onLoad]);

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return children;
};

export default GoogleMapsLoader; 