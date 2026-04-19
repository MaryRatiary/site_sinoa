import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import { 
  Package, Truck, CheckCircle, Clock, AlertCircle, ChevronLeft, 
  Calendar, DollarSign, MapPin, Phone, Mail, User, Home, Globe, 
  Copy, Download, ArrowRight
} from 'lucide-react';
import Header from '../components/composants/Header';
import Footer from '../components/composants/Footer';

// Footer Component
// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white mt-16 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//           <div>
//             <h3 className="text-lg font-bold mb-4">À propos</h3>
//             <p className="text-gray-400 text-sm">Sinoa - Votre boutique officielle KPOP de confiance depuis 2024.</p>
//           </div>
//           <div>
//             <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
//             <ul className="space-y-2 text-gray-400 text-sm">
//               <li><a href="/" className="hover:text-[#5E2251]">Accueil</a></li>
//               <li><a href="/orders" className="hover:text-[#5E2251]">Mes Commandes</a></li>
//               <li><a href="/cart" className="hover:text-[#5E2251]">Panier</a></li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-lg font-bold mb-4">Support</h3>
//             <ul className="space-y-2 text-gray-400 text-sm">
//               <li><a href="#" className="hover:text-[#5E2251]">Contact</a></li>
//               <li><a href="#" className="hover:text-[#5E2251]">FAQ</a></li>
//               <li><a href="#" className="hover:text-[#5E2251]">Conditions</a></li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-lg font-bold mb-4">Suivez-nous</h3>
//             <div className="flex gap-4">
//               <a href="#" className="hover:text-[#5E2251]">📘 Facebook</a>
//               <a href="#" className="hover:text-[#5E2251]">📸 Instagram</a>
//               <a href="#" className="hover:text-[#5E2251]">𝕏 Twitter</a>
//             </div>
//           </div>
//         </div>
//         <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
//           <p>&copy; 2024 Sinoa KPOP. Tous droits réservés. | Livraison gratuite dès 50€ 🎁</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// Timeline Component
const OrderTimeline = ({ status, created_at }) => {
  const stages = [
    { key: 'pending', label: 'Commande confirmée', icon: CheckCircle, days: 0 },
    { key: 'processing', label: 'En traitement', icon: Clock, days: '1-2' },
    { key: 'shipped', label: 'Expédiée', icon: Truck, days: '2-3' },
    { key: 'delivered', label: 'Livrée', icon: CheckCircle, days: '3-5' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === status);

  return (
    <div className="relative">
      {/* Timeline container */}
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentStageIndex && status !== 'cancelled';
          const isCurrent = index === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex items-start gap-4">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all ${
                    isCompleted ? 'bg-[#5E2251] shadow-lg' : 'bg-gray-300'
                  } ${isCurrent ? 'ring-4 ring-[#5E2251] ring-opacity-30' : ''}`}
                >
                  {isCompleted ? <CheckCircle size={20} /> : <div>{index + 1}</div>}
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={`w-1 h-12 mt-2 transition-all ${
                      isCompleted ? 'bg-[#5E2251]' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>

              {/* Stage content */}
              <div className="flex-1 pt-1">
                <h4
                  className={`font-semibold text-lg transition-all ${
                    isCompleted ? 'text-[#5E2251]' : 'text-gray-400'
                  }`}
                >
                  {stage.label}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {isCompleted && isCurrent ? '📍 Étape actuelle' : `⏱️ ${stage.days} jours`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Product Image */}
        <div className="w-full sm:w-32 h-40 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
              <Package size={40} className="text-purple-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h4>
            <p className="text-sm text-gray-600 mb-3">SKU: {item.slug}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {item.size && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                  Taille: {item.size}
                </span>
              )}
              {item.color && (
                <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-semibold">
                  Couleur: {item.color}
                </span>
              )}
            </div>
          </div>

          {/* Product Details Row */}
          <div className="flex justify-between items-center pt-3 border-t">
            <div>
              <p className="text-xs text-gray-500">Quantité</p>
              <p className="text-lg font-bold text-gray-900">{item.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Prix unitaire</p>
              <p className="text-lg font-bold text-gray-900">{item.price}€</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Sous-total</p>
              <p className="text-lg font-bold text-green-600">{(item.price * item.quantity).toFixed(2)}€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shipping Info Card
const ShippingInfoCard = ({ order }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copié au presse-papiers!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Informations de contact */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-[#5E2251]" />
          Informations de contact
        </h3>
        <div className="space-y-4">
          {order.first_name || order.last_name ? (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Nom complet</p>
              <p className="text-gray-900 font-semibold">{order.first_name} {order.last_name}</p>
            </div>
          ) : null}

          {order.email ? (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
              <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#5E2251]" />
                  <p className="text-gray-900 font-semibold break-all">{order.email}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(order.email)}
                  className="text-[#5E2251] hover:bg-purple-100 p-2 rounded transition"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          ) : null}

          {order.phone ? (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Téléphone</p>
              <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#5E2251]" />
                  <p className="text-gray-900 font-semibold">{order.phone}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(order.phone)}
                  className="text-[#5E2251] hover:bg-purple-100 p-2 rounded transition"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Adresse de livraison */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <Home size={20} className="text-[#5E2251]" />
          Adresse de livraison
        </h3>
        <div className="space-y-4">
          {order.shippingaddress && (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Adresse</p>
              <p className="text-gray-900 font-semibold">{order.shippingaddress}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {order.city && (
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Ville</p>
                <p className="text-gray-900 font-semibold">{order.city}</p>
              </div>
            )}
            {order.postalcode && (
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Code postal</p>
                <p className="text-gray-900 font-semibold">{order.postalcode}</p>
              </div>
            )}
          </div>

          {order.country && (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Pays</p>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-[#5E2251]" />
                <p className="text-gray-900 font-semibold">{order.country}</p>
              </div>
            </div>
          )}

          {order.latitude && order.longitude && typeof order.latitude === 'number' && typeof order.longitude === 'number' && (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Coordonnées GPS</p>
              <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded">
                {parseFloat(order.latitude).toFixed(6)}, {parseFloat(order.longitude).toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Méthode de paiement */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-[#5E2251]" />
          Paiement
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Méthode</p>
            <p className="text-gray-900 font-semibold capitalize">{order.paymentmethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Statut du paiement</p>
            <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
              order.paymentstatus === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : order.paymentstatus === 'refunded'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.paymentstatus === 'paid' ? '✅ Payé' : order.paymentstatus === 'refunded' ? '↩️ Remboursé' : '⏳ En attente'}
            </span>
          </div>
        </div>
      </div>

      {/* Numéro de suivi */}
      {order.trackingnumber && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Truck size={20} className="text-[#5E2251]" />
            Suivi de livraison
          </h3>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-2">Numéro de suivi</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
              <p className="text-gray-900 font-semibold flex-1 break-all">{order.trackingnumber}</p>
              <button
                onClick={() => copyToClipboard(order.trackingnumber)}
                className="text-[#5E2251] hover:bg-purple-100 p-2 rounded transition"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const data = await checkoutAPI.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5E2251] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">Chargement des détails de la commande...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <AlertCircle className="text-red-500 mb-3" size={24} />
              <h2 className="font-bold text-red-900 mb-1">Erreur</h2>
              <p className="text-red-800">{error || 'Commande non trouvée'}</p>
              <button
                onClick={() => navigate('/orders')}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Retour aux commandes
              </button>
            </div>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-[#5E2251] hover:text-[#4a1a40] font-semibold mb-6 transition"
            >
              <ChevronLeft size={20} />
              Retour aux commandes
            </button>

            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-[#5E2251]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Commande #{order.id}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#5E2251]" />
                      {new Date(order.createdat).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="text-lg font-bold text-green-600">{order.totalprice}€</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-full font-bold text-white text-sm ${
                    order.status === 'pending' ? 'bg-yellow-500' :
                    order.status === 'processing' ? 'bg-blue-500' :
                    order.status === 'shipped' ? 'bg-indigo-500' :
                    order.status === 'delivered' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}>
                    {order.status === 'pending' ? '⏳ En attente' :
                     order.status === 'processing' ? '⚙️ En traitement' :
                     order.status === 'shipped' ? '🚚 Expédiée' :
                     order.status === 'delivered' ? '✅ Livrée' :
                     '❌ Annulée'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-8 sticky top-4">
                <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                  <Truck size={24} className="text-[#5E2251]" />
                  Suivi de progression
                </h2>
                <OrderTimeline status={order.status} created_at={order.createdat} />
              </div>
            </div>

            {/* Products and Details Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Products */}
              <div>
                <h2 className="font-bold text-2xl text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={24} className="text-[#5E2251]" />
                  Articles commandés ({order.items?.length || 0})
                </h2>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <ProductCard key={item.id} item={item} />
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <Package size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">Aucun article trouvé</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping and Payment Info */}
              <div>
                <h2 className="font-bold text-2xl text-gray-900 mb-4 flex items-center gap-2">
                  <Home size={24} className="text-[#5E2251]" />
                  Informations de livraison et paiement
                </h2>
                <ShippingInfoCard order={order} />
              </div>

              {/* Notes Section */}
              {order.notes && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">📝 Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded">{order.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2">
                  <Download size={20} />
                  Télécharger la facture
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="flex-1 border-2 border-[#5E2251] text-[#5E2251] hover:bg-purple-50 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <ArrowRight size={20} />
                  Mes autres commandes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
