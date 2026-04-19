import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Package, Truck, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Fonction pour créer des icônes colorées
const createCustomIcon = (status) => {
  const colors = {
    pending: '#FCD34D', // jaune
    processing: '#3B82F6', // bleu
    completed: '#10B981', // vert
    cancelled: '#EF4444', // rouge
  };

  return L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-${colors[status] || '#999'}" style="border-color: ${colors[status] || '#999'}; background-color: white;">
      <div class="w-4 h-4 rounded-full" style="background-color: ${colors[status] || '#999'};"></div>
    </div>`,
    iconSize: [32, 32],
    className: 'custom-icon',
  });
};

// Fonction pour obtenir la couleur du statut
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', dot: 'bg-yellow-400' };
    case 'processing':
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', dot: 'bg-blue-400' };
    case 'completed':
      return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', dot: 'bg-green-400' };
    case 'cancelled':
      return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', dot: 'bg-red-400' };
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', dot: 'bg-gray-400' };
  }
};

// Fonction pour obtenir l'icône du statut
const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <AlertCircle size={16} />;
    case 'processing':
      return <Truck size={16} />;
    case 'completed':
      return <CheckCircle size={16} />;
    case 'cancelled':
      return <AlertCircle size={16} />;
    default:
      return <Package size={16} />;
  }
};

// Fonction pour obtenir le label du statut
const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Complété',
    cancelled: 'Annulé',
  };
  return labels[status] || status;
};

export default function OrdersMap({ orders = [], selectedOrder, setSelectedOrder, onOrderClick }) {
  const [visibleStatuses, setVisibleStatuses] = useState({
    pending: true,
    processing: true,
    completed: true,
    cancelled: true,
  });

  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]); // Paris par défaut
  const [mapZoom, setMapZoom] = useState(10);

  // Filtrer les commandes avec des coordonnées valides
  const ordersWithCoordinates = useMemo(() => {
    return (orders || []).filter(order => 
      order.latitude && 
      order.longitude && 
      typeof order.latitude === 'number' && 
      typeof order.longitude === 'number' &&
      visibleStatuses[order.status] !== false
    );
  }, [orders, visibleStatuses]);

  // Calculer les limites de la carte
  const mapBounds = useMemo(() => {
    if (ordersWithCoordinates.length === 0) {
      return null;
    }
    
    const lats = ordersWithCoordinates.map(o => o.latitude);
    const lngs = ordersWithCoordinates.map(o => o.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return [[minLat, minLng], [maxLat, maxLng]];
  }, [ordersWithCoordinates]);

  const toggleStatusVisibility = (status) => {
    setVisibleStatuses(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // Grouper les commandes par statut pour les statistiques
  const statsByStatus = useMemo(() => {
    return {
      pending: (orders || []).filter(o => o.status === 'pending').length,
      processing: (orders || []).filter(o => o.status === 'processing').length,
      completed: (orders || []).filter(o => o.status === 'completed').length,
      cancelled: (orders || []).filter(o => o.status === 'cancelled').length,
    };
  }, [orders]);

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pending', 'processing', 'completed', 'cancelled'].map(status => {
          const colors = getStatusColor(status);
          const count = statsByStatus[status];
          
          return (
            <button
              key={status}
              onClick={() => toggleStatusVisibility(status)}
              className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                visibleStatuses[status] 
                  ? `${colors.bg} ${colors.border}` 
                  : 'bg-gray-100 border-gray-200 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                <span className={`text-xs font-semibold ${colors.text}`}>
                  {getStatusLabel(status)}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Carte */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-96 md:h-[600px] w-full">
          {ordersWithCoordinates.length > 0 ? (
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%' }}
              bounds={mapBounds}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {ordersWithCoordinates.map(order => (
                <Marker 
                  key={order.id}
                  position={[order.latitude, order.longitude]}
                  icon={createCustomIcon(order.status)}
                  eventHandlers={{
                    click: () => onOrderClick && onOrderClick(order.id),
                  }}
                >
                  <Popup className="order-popup">
                    <div className="p-2 max-w-xs">
                      <p className="font-bold text-gray-900">Commande #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {order.postal_code} {order.city}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-semibold text-gray-900">
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-purple-600 mb-3">
                        Total: {order.totalprice}€
                      </p>
                      <button
                        onClick={() => onOrderClick && onOrderClick(order.id)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-2 rounded transition"
                      >
                        Voir détails
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
              <MapPin size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600 text-center">
                Aucune commande avec localisation disponible
              </p>
              {orders && orders.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {orders.length} commande(s) sans coordonnées GPS
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Liste des commandes avec localisation */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Commandes avec localisation ({ordersWithCoordinates.length})
        </h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {ordersWithCoordinates.length > 0 ? (
            ordersWithCoordinates.map(order => {
              const colors = getStatusColor(order.status);
              const isSelected = selectedOrder?.id === order.id;
              
              return (
                <button
                  key={order.id}
                  onClick={() => onOrderClick && onOrderClick(order.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition ${
                    isSelected
                      ? `${colors.bg} ${colors.border} shadow-md`
                      : `${colors.bg} ${colors.border} hover:shadow`
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-start">
                    <div>
                      <p className="text-xs text-gray-600">Commande</p>
                      <p className="font-bold text-gray-900">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Client</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Adresse</p>
                      <p className="text-sm text-gray-900 truncate">
                        {order.postal_code} {order.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Statut</p>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <span className={`text-xs font-bold ${colors.text}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Total</p>
                      <p className="font-bold text-purple-600">{order.totalprice}€</p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="text-center text-gray-600 py-4">Aucune commande à afficher</p>
          )}
        </div>
      </div>
    </div>
  );
}