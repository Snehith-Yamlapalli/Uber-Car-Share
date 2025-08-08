// src/hooks/useCurrentLocation.js
import { useEffect } from "react";

const useCurrentLocation = (onSuccess, onError) => {
  useEffect(() => {
    alert(" in usecurrentlocation.js and getting current position")
    const requestLocation = () => {
      if (!navigator.geolocation) {
        onError?.("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSuccess({ latitude, longitude });
          alert("got current position")
        },
        (error) => {
          onError?.(error.message);
        }
      );
    };

    requestLocation();
  }, [onSuccess, onError]);
};

export default useCurrentLocation;
