// src/components/Map.jsx
import { useEffect, useState } from 'react';
import usericon from './user-icon.png'
import { MapContainer, TileLayer, Marker, Popup, useMap, } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  calculateRegion,
} from '../Store/UtilMap';

// Simple component to recenter map when region changes
function Recenter({ region }) {
  const map = useMap();
  useEffect(() => {
    if (region) {
      map.flyTo([region.latitude, region.longitude], map.getZoom());
    }
  }, [region, map]);
  return null;
}


const userIcon = new L.Icon({
  iconUrl: { usericon },
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function Map({
  showUserLocation = true,
  showDrivers = true,
  driverData = [],
  destination = null, // { latitude: number, longitude: number }
}) {
  const [userPos, setUserPos] = useState(null);
  const [region, setRegion] = useState(null);

  // 1️⃣ Get user location
  useEffect(() => {
    if (!showUserLocation || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const pos = { latitude: coords.latitude, longitude: coords.longitude };
      setUserPos(pos);
    });
  }, [showUserLocation]);

  useEffect(() => {
    if (
      showDrivers &&
      userPos &&
      Array.isArray(driverData) &&
      driverData.length
    ) {
    }
  }, [showDrivers, userPos, driverData, destination]);

  // 3️⃣ Compute region whenever userPos or destination changes
  useEffect(() => {
    const destLat = destination?.latitude ?? null;
    const destLng = destination?.longitude ?? null;

    const newRegion = calculateRegion({
      userLatitude: userPos?.latitude ?? null,
      userLongitude: userPos?.longitude ?? null,
      destinationLatitude: destLat,
      destinationLongitude: destLng,
    });
    setRegion(newRegion);
  }, [userPos, destination]);

  // Fallback center
  const center = region
    ? [region.latitude, region.longitude]
    : [51.505, -0.09];

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {region && <Recenter region={region} />}

        {showUserLocation && userPos && (
          <Marker
            position={[userPos.latitude, userPos.longitude]}
            icon={userIcon}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
