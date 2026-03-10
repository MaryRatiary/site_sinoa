import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import { Trash2, Plus, Minus, CheckCircle, AlertCircle, Package, CreditCard, Smartphone, DollarSign, Truck, Lock } from 'lucide-react';
import LayoutWrapper from '../components/LayoutWrapper';
import AddressSelector from '../components/AddressSelector';
import Footer from '../components/Footer';
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
//               <li><a href="/category/1" className="hover:text-[#5E2251]">Boutique</a></li>
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

// Success Modal Component
const SuccessModal = ({ orderId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center animate-bounce">
        <div className="mb-6 flex justify-center">
          <CheckCircle size={80} className="text-green-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée! 🎉</h2>
        <p className="text-gray-600 mb-4">Merci pour votre achat chez Sinoa!</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Numéro de commande</p>
          <p className="text-2xl font-bold text-[#5E2251]">{orderId}</p>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Vous recevrez un email de confirmation avec les détails de votre commande et le numéro de suivi.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

// Main Cart Page Component
export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    country: 'France',
    latitude: null,
    longitude: null,
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  if (!isAuthenticated) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <AlertCircle size={64} className="mx-auto mb-4 text-blue-500" />
              <h1 className="text-3xl font-bold mb-4">Veuillez vous connecter</h1>
              <p className="text-gray-600 mb-8">Vous devez être connecté pour accéder au panier</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </LayoutWrapper>
    );
  }

  if (cartItems.length === 0 && currentStep === 0) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Package size={64} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-3xl font-bold mb-4">Panier vide</h1>
              <p className="text-gray-600 mb-8">Votre panier est vide. Commencez à faire vos achats!</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Continuer les achats
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </LayoutWrapper>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const items = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const order = await checkoutAPI.createOrder(
        items,
        formData.shippingAddress,
        formData.paymentMethod,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }
      );

      setSuccessOrderId(order.order?.id || 'CMD-' + Date.now());
      setSuccess(true);
      clearCart();

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 0, name: 'Panier', icon: Package },
    { id: 1, name: 'Livraison', icon: Truck },
    { id: 2, name: 'Paiement', icon: CreditCard },
    { id: 3, name: 'Confirmation', icon: CheckCircle },
  ];

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = (subtotal * 0.20).toFixed(2);
  const total = (parseFloat(subtotal) + shipping + parseFloat(tax)).toFixed(2);

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Étapes du processus */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep >= step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-[#5E2251] text-white shadow-lg'
                            : 'bg-gray-300 text-gray-600'
                        } ${isCurrent ? 'ring-4 ring-purple-200' : ''}`}
                      >
                        <StepIcon size={24} />
                      </div>
                      <span
                        className={`mt-2 text-sm font-semibold ${
                          isActive ? 'text-[#5E2251]' : 'text-gray-600'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 ${
                          currentStep > step.id ? 'bg-[#5E2251]' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Partie gauche */}
            <div className="lg:col-span-2">
              {/* Step 0: Panier */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Votre Panier</h2>
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex gap-4"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          {item.size && <span>📏 Taille: <strong>{item.size}</strong></span>}
                          {item.color && <span>🎨 Couleur: <strong>{item.color}</strong></span>}
                        </div>
                        <p className="font-bold text-[#5E2251] mt-2">{item.price}€</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100 transition"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="px-3 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100 transition"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-6 rounded-lg transition mt-6"
                  >
                    Continuer vers la livraison
                  </button>
                </div>
              )}

              {/* Step 1: Livraison */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📦 Informations de Livraison</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* AddressSelector Component */}
                    <AddressSelector formData={formData} setFormData={setFormData} />

                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(0)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
                      >
                        Retour
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-6 rounded-lg transition"
                      >
                        Continuer vers le paiement
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2: Paiement */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Méthode de Paiement</h2>
                  
                  {/* Payment methods */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      { id: 'card', name: 'Carte bancaire', icon: '💳' },
                      { id: 'paypal', name: 'PayPal', icon: '🅿️' },
                      { id: 'apple', name: 'Apple Pay', icon: '🍎' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.paymentMethod === method.id
                            ? 'border-[#5E2251] bg-purple-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-4xl mb-2">{method.icon}</div>
                        <p className="font-semibold text-gray-900">{method.name}</p>
                      </button>
                    ))}
                  </div>

                  {/* Card payment form */}
                  {formData.paymentMethod === 'card' && (
                    <form className="space-y-4 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte *</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardNumber: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim(),
                            })
                          }
                          maxLength="19"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiration *</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setFormData({ ...formData, cardExpiry: value });
                            }}
                            maxLength="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVC *</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={formData.cardCvc}
                            onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                            maxLength="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </form>
                  )}

                  {formData.paymentMethod === 'paypal' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
                      <p className="text-blue-900 font-semibold mb-3">Vous serez redirigé vers PayPal pour finaliser votre paiement</p>
                      <div className="text-5xl mb-2">🅿️</div>
                    </div>
                  )}

                  {formData.paymentMethod === 'apple' && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8 text-center">
                      <p className="text-gray-900 font-semibold mb-3">Authentification Apple Pay activée</p>
                      <div className="text-5xl mb-2">🍎</div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
                    >
                      Retour
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Lock size={20} />
                      Finaliser la commande
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Vérifier votre commande</h2>
                  
                  <div className="space-y-6 mb-8">
                    {/* Shipping info */}
                    <div className="border-b pb-6">
                      <h3 className="font-bold text-gray-900 mb-3">📦 Livraison</h3>
                      <p className="text-gray-600">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.shippingAddress}<br />
                        {formData.postalCode} {formData.city}, {formData.country}
                      </p>
                      {formData.latitude && formData.longitude && (
                        <p className="text-xs text-gray-500 mt-2">
                          📍 Coordonnées: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>

                    {/* Payment method */}
                    <div className="border-b pb-6">
                      <h3 className="font-bold text-gray-900 mb-3">💳 Paiement</h3>
                      <p className="text-gray-600">
                        {formData.paymentMethod === 'card' && `Carte bancaire se terminant par ${formData.cardNumber.slice(-4)}`}
                        {formData.paymentMethod === 'paypal' && 'PayPal'}
                        {formData.paymentMethod === 'apple' && 'Apple Pay'}
                      </p>
                    </div>

                    {/* Items summary */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">🛍️ Articles</h3>
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-gray-600">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex gap-2">
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? '⏳ Traitement...' : '✅ Passer la commande'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Résumé du prix (colonne droite) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-8 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Résumé</h2>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison {subtotal > 50 ? '(Gratuite)' : ''}</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxe (20%)</span>
                    <span>{tax}€</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-[#5E2251]">{total}€</span>
                </div>

                {subtotal > 50 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-700 font-semibold">
                    ✨ Livraison gratuite appliquée!
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                  <p className="font-semibold mb-2">🔒 Paiement sécurisé</p>
                  <p>Vos données sont chiffrées et protégées.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {success && <SuccessModal orderId={successOrderId} onClose={() => setSuccess(false)} />}

      <Footer />
    </LayoutWrapper>
  );
}
