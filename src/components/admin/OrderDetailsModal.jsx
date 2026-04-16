import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Calendar, DollarSign, Package, Phone, Mail, Truck, CheckCircle, Clock } from 'lucide-react';
import { OrderTimeline } from './OrderTimeline';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DeliveryMap = ({ latitude, longitude, address, city, country }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || mapInstanceRef.current) return;

    try {
      const map = L.map(mapRef.current).setView([latitude, longitude], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.marker([latitude, longitude])
        .bindPopup(`<b>📍 Adresse de Livraison</b><br>${address}<br>${city}, ${country}`)
        .addTo(map)
        .openPopup();

      mapInstanceRef.current = map;

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }, [latitude, longitude, address, city, country]);

  return <div ref={mapRef} className="w-full h-64 sm:h-80 md:h-96 rounded-lg border border-gray-300" />;
};

export const OrderDetailsModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || 'unpaid');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingnumber || '');
  const [notes, setNotes] = useState(order?.notes || '');
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !order) return null;

  const handleUpdate = () => {
    onUpdateStatus(order.id, {
      status,
      paymentStatus,
      trackingNumber,
      notes
    });
  };

  const getStatusColor = (stat) => {
    switch(stat) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentColor = (stat) => {
    switch(stat) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'unpaid': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl sm:max-w-3xl md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#5E2251] to-[#4a1a40] text-white p-3 sm:p-4 md:p-6 flex justify-between items-start sm:items-center">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold">Commande #{order.id}</h2>
            <p className="text-purple-100 text-xs sm:text-sm mt-1">
              {new Date(order.createdat).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 flex-shrink-0 ml-2"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 border-b border-gray-300 px-3 sm:px-4 md:px-6 bg-gray-50">
          {[
            { id: 'details', label: 'Détails' },
            { id: 'items', label: 'Articles' },
            { id: 'timeline', label: 'Historique' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-[#5E2251] border-b-2 border-[#5E2251]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Onglet Détails */}
          {activeTab === 'details' && (
            <>
              <section className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Mail className="text-[#5E2251] flex-shrink-0" size={18} />
                  Informations Client
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Nom Complet</p>
                    <p className="text-gray-900 font-semibold text-sm truncate">{order.firstname} {order.lastname}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Email</p>
                    <p className="text-gray-900 text-sm truncate">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Téléphone</p>
                    <p className="text-gray-900 flex items-center gap-2 text-sm">
                      <Phone size={14} className="flex-shrink-0" />
                      <span className="truncate">{order.phone}</span>
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-blue-500">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin className="text-blue-600 flex-shrink-0" size={18} />
                  Adresse de Livraison et Localisation
                </h3>
                
                <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 space-y-2">
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">{order.shippingaddress}</p>
                  <p className="text-gray-700 text-sm">{order.postalcode} {order.city}</p>
                  <p className="text-gray-700 font-semibold text-sm">{order.country}</p>
                  
                  {order.latitude && order.longitude && (
                    <div className="mt-3 sm:mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Coordonnées GPS</p>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="bg-white rounded p-2">
                          <p className="text-xs text-gray-600">📍 Latitude</p>
                          <p className="text-xs sm:text-sm font-mono font-bold text-[#5E2251] truncate">{parseFloat(order.latitude).toFixed(8)}</p>
                        </div>
                        <div className="bg-white rounded p-2">
                          <p className="text-xs text-gray-600">📍 Longitude</p>
                          <p className="text-xs sm:text-sm font-mono font-bold text-[#5E2251] truncate">{parseFloat(order.longitude).toFixed(8)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {order.latitude && order.longitude ? (
                  <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-300">
                    <DeliveryMap 
                      latitude={order.latitude}
                      longitude={order.longitude}
                      address={order.shippingaddress}
                      city={order.city}
                      country={order.country}
                    />
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6 text-center">
                    <MapPin className="mx-auto text-yellow-600 mb-2" size={32} />
                    <p className="text-yellow-900 font-semibold text-sm">Aucune coordonnée GPS disponible</p>
                    <p className="text-xs sm:text-sm text-yellow-800">Cette commande n'a pas de localisation précise enregistrée.</p>
                  </div>
                )}
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <section className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Truck className="text-[#5E2251] flex-shrink-0" size={18} />
                    Statut Commande
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Statut</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${getStatusColor(status)}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="processing">En traitement</option>
                        <option value="completed">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Numéro de suivi</label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Ex: FDX123456789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5E2251]"
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <DollarSign className="text-green-600 flex-shrink-0" size={18} />
                    Paiement
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Statut Paiement</label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${getPaymentColor(paymentStatus)}`}
                      >
                        <option value="unpaid">Non payée</option>
                        <option value="pending">En attente</option>
                        <option value="paid">Payée</option>
                      </select>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-300">
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Total</p>
                      <p className="text-xl sm:text-2xl font-bold text-[#5E2251]">{parseFloat(order.totalprice).toFixed(2)}€</p>
                    </div>
                  </div>
                </section>
              </div>

              <section className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Notes Internes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez des notes sur cette commande..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5E2251] h-20 sm:h-24"
                />
              </section>

              <section className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-[#5E2251]">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Méthode de Paiement</p>
                <p className="text-gray-900 font-semibold text-sm capitalize">{order.paymentmethod}</p>
              </section>
            </>
          )}

          {/* Onglet Articles */}
          {activeTab === 'items' && (
            <section>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Package className="text-[#5E2251] flex-shrink-0" size={18} />
                Articles Commandés
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">Produit</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-700">Qté</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-700">Taille</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-700">Couleur</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-semibold text-gray-700">Prix U.</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold truncate">{item.name}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700">{item.quantity}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700">{item.size || '-'}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700">{item.color || '-'}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-right text-gray-900 font-semibold">{parseFloat(item.price).toFixed(2)}€</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-right text-[#5E2251] font-bold">{(parseFloat(item.price) * item.quantity).toFixed(2)}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Onglet Historique */}
          {activeTab === 'timeline' && (
            <OrderTimeline order={order} />
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 md:pt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base"
            >
              Fermer
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <CheckCircle size={18} />
              <span className="hidden sm:inline">Mettre à Jour</span>
              <span className="sm:hidden">Mettre à jour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
