import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component that handles map click events - MUST be inside MapContainer
const MapClickListener = ({ onLocationSelect }) => {
  useMapEvent('click', (e) => {
    const { lat, lng } = e.latlng;
    onLocationSelect({ lat, lng });
  });

  return null;
};

export default function MapModalContent({ onLocationSelect, selectedLocation }) {
  const mapCenter = [48.8566, 2.3522]; // Paris par défaut

  return (
    <div className="h-96 rounded-lg overflow-hidden border border-gray-300 mb-4">
      <MapContainer 
        center={mapCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapClickListener onLocationSelect={onLocationSelect} />
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>📍 Localisation sélectionnée</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
