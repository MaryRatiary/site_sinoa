import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function AddressSelector({ formData, setFormData }) {
  const [addressMode, setAddressMode] = useState('manual');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialiser la carte quand le modal s'ouvre
  useEffect(() => {
    if (!showMapModal || mapRef.current) return;

    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    try {
      // Créer la carte
      const map = L.map(mapContainer).setView([48.8566, 2.3522], 12);
      
      // Ajouter la couche de tuiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Gérer les clics sur la carte
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });

        // Supprimer l'ancien marqueur s'il existe
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Créer un nouveau marqueur
        markerRef.current = L.marker([lat, lng])
          .bindPopup(`<b>📍 Position sélectionnée</b><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}`)
          .addTo(map)
          .openPopup();
      });

      mapRef.current = map;

      // Cleanup
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }, [showMapModal]);

  const confirmMapLocation = async () => {
    if (selectedLocation) {
      try {
        // Utiliser reverse geocoding pour obtenir l'adresse
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`
        );
        const data = await response.json();
        
        // Extraire les informations d'adresse
        const address = data.address || {};
        setFormData({
          ...formData,
          shippingAddress: address.road || data.display_name?.split(',')[0] || '',
          city: address.city || address.town || address.village || '',
          postal_code: address.postcode || '',
          country: address.country || 'France',
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        });
        setShowMapModal(false);
        setAddressMode('map');
      } catch (error) {
        console.error('Erreur de géocodage inverse:', error);
        // Fallback: utiliser juste les coordonnées
        setFormData({
          ...formData,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        });
        setShowMapModal(false);
        setAddressMode('map');
      }
    }
  };

  const switchToMap = () => {
    setSelectedLocation(null);
    setShowMapModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setAddressMode('manual')}
          className={`p-4 rounded-lg border-2 transition ${
            addressMode === 'manual'
              ? 'border-[#5E2251] bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="text-2xl mb-2">✍️</div>
          <p className="font-semibold text-gray-900">Adresse manuelle</p>
        </button>
        <button
          type="button"
          onClick={switchToMap}
          className={`p-4 rounded-lg border-2 transition ${
            addressMode === 'map'
              ? 'border-[#5E2251] bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="text-2xl mb-2">🗺️</div>
          <p className="font-semibold text-gray-900">Sélectionner sur carte</p>
        </button>
      </div>

      {/* Manual Address Form */}
      {addressMode === 'manual' && (
        <div className="space-y-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
            <input
              type="text"
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
              placeholder="Rue, numéro..."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                placeholder="Paris"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                placeholder="75001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
              >
                <option>France</option>
                <option>Belgique</option>
                <option>Suisse</option>
                <option>Luxembourg</option>
                <option>Canada</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Map Selected Address */}
      {addressMode === 'map' && formData.latitude && formData.longitude && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-2">📍 Position sélectionnée</p>
              <p className="text-sm text-blue-800 mb-1">
                {formData.shippingAddress && (
                  <>
                    {formData.shippingAddress}<br />
                    {formData.postal_code} {formData.city}, {formData.country}
                  </>
                )}
              </p>
              <p className="text-xs text-blue-700 font-mono mt-2">
                📍 Lat: {formData.latitude.toFixed(4)} | Lng: {formData.longitude.toFixed(4)}
              </p>
              <button
                type="button"
                onClick={switchToMap}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline mt-2"
              >
                Modifier la localisation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">🗺️ Cliquez sur la carte pour sélectionner votre adresse</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <div 
                id="mapContainer" 
                className="h-96 rounded-lg overflow-hidden border border-gray-300 mb-4"
                style={{ height: '400px' }}
              />

              {selectedLocation && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-900 font-semibold mb-2">✅ Position sélectionnée</p>
                  <p className="text-sm text-green-800 font-mono">
                    Latitude: {selectedLocation.lat.toFixed(4)}<br />
                    Longitude: {selectedLocation.lng.toFixed(4)}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMapModal(false);
                    setSelectedLocation(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmMapLocation}
                  disabled={!selectedLocation}
                  className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  Confirmer cette position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
