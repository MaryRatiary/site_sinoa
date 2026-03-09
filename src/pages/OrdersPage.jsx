import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import { Package, Truck, CheckCircle, Clock, AlertCircle, ChevronRight, Calendar, DollarSign, MapPin } from 'lucide-react';
import Header from '../components/Header';

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">À propos</h3>
            <p className="text-gray-400 text-sm">Sinoa - Votre boutique officielle KPOP de confiance depuis 2024.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-[#5E2251]">Accueil</a></li>
              <li><a href="/category/1" className="hover:text-[#5E2251]">Boutique</a></li>
              <li><a href="/cart" className="hover:text-[#5E2251]">Panier</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-[#5E2251]">Contact</a></li>
              <li><a href="#" className="hover:text-[#5E2251]">FAQ</a></li>
              <li><a href="#" className="hover:text-[#5E2251]">Conditions</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Suivez-nous</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#5E2251]">📘 Facebook</a>
              <a href="#" className="hover:text-[#5E2251]">📸 Instagram</a>
              <a href="#" className="hover:text-[#5E2251]">𝕏 Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Sinoa KPOP. Tous droits réservés. | Livraison gratuite dès 50€ 🎁</p>
        </div>
      </div>
    </footer>
  );
};

// Composant pour afficher le statut avec icône
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { icon: Clock, bg: 'bg-yellow-50', text: 'text-yellow-800', label: 'En attente', color: 'text-yellow-500' },
    processing: { icon: Truck, bg: 'bg-blue-50', text: 'text-blue-800', label: 'En traitement', color: 'text-blue-500' },
    completed: { icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-800', label: 'Livrée', color: 'text-green-500' },
    shipped: { icon: Truck, bg: 'bg-indigo-50', text: 'text-indigo-800', label: 'Expédiée', color: 'text-indigo-500' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.text} px-4 py-2 rounded-full flex items-center gap-2 w-fit`}>
      <Icon size={16} className={config.color} />
      <span className="font-semibold text-sm">{config.label}</span>
    </div>
  );
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await checkoutAPI.getUserOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5E2251] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">Chargement de vos commandes...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">📦 Mes Commandes</h1>
                <p className="text-gray-600 text-lg">Suivez et gérez toutes vos commandes en un seul endroit</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="hidden md:flex items-center gap-2 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-6 rounded-lg transition shadow-lg"
              >
                Continuer les achats
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#5E2251]">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-1">Total de commandes</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-1">Commandes livrées</p>
                <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === 'completed').length}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-1">En traitement</p>
                <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'processing' || o.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8 flex items-start gap-4">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Erreur</h3>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Package size={64} className="mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Aucune commande</h2>
              <p className="text-gray-600 mb-8 text-lg">Vous n'avez pas encore passé de commande. Commencez à faire vos achats dès maintenant!</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-8 rounded-lg transition shadow-lg"
              >
                🛍️ Découvrir la boutique
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {/* Order Header */}
                  <div
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {/* Order ID */}
                          <div>
                            <p className="text-sm text-gray-600 font-semibold uppercase mb-1">Commande</p>
                            <p className="text-lg font-bold text-[#5E2251]">#{order.id}</p>
                          </div>

                          {/* Date */}
                          <div className="flex items-start gap-3">
                            <Calendar className="text-gray-400 mt-1" size={20} />
                            <div>
                              <p className="text-sm text-gray-600 font-semibold uppercase mb-1">Date</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(order.createdat).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="flex items-start gap-3">
                            <DollarSign className="text-green-500 mt-1" size={20} />
                            <div>
                              <p className="text-sm text-gray-600 font-semibold uppercase mb-1">Total</p>
                              <p className="text-lg font-bold text-green-600">{order.totalprice}€</p>
                            </div>
                          </div>

                          {/* Status */}
                          <div>
                            <p className="text-sm text-gray-600 font-semibold uppercase mb-2">Statut</p>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      </div>

                      {/* Expand Button */}
                      <div className="flex items-center gap-2">
                        <ChevronRight 
                          size={24} 
                          className={`text-gray-400 transition transform ${expandedOrder === order.id ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {expandedOrder === order.id && (
                    <div className="border-t bg-gray-50 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Shipping Info */}
                        <div>
                          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin size={20} className="text-[#5E2251]" />
                            Adresse de livraison
                          </h3>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-gray-700">
                            <p className="font-semibold">{order.shippingaddress}</p>
                            <p>{order.city}</p>
                            <p>{order.postalcode}</p>
                            <p className="font-semibold text-gray-900">{order.country}</p>
                            {order.latitude && order.longitude && (
                              <p className="text-xs text-gray-500 font-mono pt-2 border-t">
                                📍 {order.latitude.toFixed(4)}, {order.longitude.toFixed(4)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div>
                          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Truck size={20} className="text-[#5E2251]" />
                            Suivi de commande
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-[#5E2251]"></div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">Commande confirmée</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdat).toLocaleDateString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className={`flex items-center gap-3 ${order.status !== 'pending' ? 'opacity-100' : 'opacity-50'}`}>
                              <div className={`w-3 h-3 rounded-full ${order.status !== 'pending' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">En traitement</p>
                                <p className="text-sm text-gray-600">24-48 heures</p>
                              </div>
                            </div>
                            <div className={`flex items-center gap-3 ${order.status === 'completed' ? 'opacity-100' : 'opacity-50'}`}>
                              <div className={`w-3 h-3 rounded-full ${order.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">Expédiée</p>
                                <p className="text-sm text-gray-600">Suivi disponible</p>
                              </div>
                            </div>
                            <div className={`flex items-center gap-3 ${order.status === 'completed' ? 'opacity-100' : 'opacity-50'}`}>
                              <div className={`w-3 h-3 rounded-full ${order.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">Livrée</p>
                                <p className="text-sm text-gray-600">Entre 3-5 jours ouvrables</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 pt-6 border-t flex gap-3">
                        <button
                          onClick={() => navigate(`/order/${order.id}`)}
                          className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                          Voir les détails complets
                        </button>
                        <button className="flex-1 border-2 border-[#5E2251] text-[#5E2251] hover:bg-purple-50 font-bold py-2 px-4 rounded-lg transition">
                          Télécharger la facture
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
