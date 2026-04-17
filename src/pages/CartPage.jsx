import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import { Trash2, Plus, Minus, CheckCircle, AlertCircle, Package, CreditCard, Truck, Lock, MapPin, Phone, Mail, Shield } from 'lucide-react';
import { FaPaypal, FaApple, FaCcVisa } from 'react-icons/fa';
import LayoutWrapper from '../components/composants/LayoutWrapper';
import AddressSelector from '../components/composants/AddressSelector';
import Footer from '../components/composants/Footer';


// Success Modal Component
const SuccessModal = ({ orderId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Commande confirmée!</h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">Merci pour votre achat chez Sinoa!</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-xs sm:text-sm text-gray-600">Numéro de commande</p>
          <p className="text-xl sm:text-2xl font-bold text-[#5E2251]">{orderId}</p>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm mb-6">
          Vous recevrez un email de confirmation avec les détails de votre commande.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

// Payment Method Card Component
const PaymentMethodCard = ({ method, isSelected, onClick }) => {
  const Icon = method.icon;
  return (
    <button
      onClick={onClick}
      className={`p-3 sm:p-4 rounded-lg border-2 transition ${
        isSelected
          ? 'border-[#5E2251] bg-purple-50'
          : 'border-gray-300 hover:border-gray-400 bg-white'
      }`}
    >
      <Icon size={32} className="mx-auto mb-2 text-gray-700" />
      <p className="font-semibold text-gray-900 text-sm">{method.name}</p>
    </button>
  );
};

// Step Indicator Component
const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#5E2251] text-white shadow-lg'
                      : 'bg-gray-300 text-gray-600'
                  } ${isCurrent ? 'ring-4 ring-purple-200' : ''}`}
                >
                  <StepIcon size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span
                  className={`mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-center ${
                    isActive ? 'text-[#5E2251]' : 'text-gray-600'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 sm:mx-4 ${
                    currentStep > step.id ? 'bg-[#5E2251]' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
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
        <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-blue-500 sm:w-16 sm:h-16" />
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">Veuillez vous connecter</h1>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Vous devez être connecté pour accéder au panier</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition"
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
        <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
              <Package size={48} className="mx-auto mb-4 text-gray-400 sm:w-16 sm:h-16" />
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">Panier vide</h1>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Votre panier est vide. Commencez à faire vos achats!</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition"
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

  const paymentMethods = [
    { id: 'card', name: 'Carte', icon: FaCcVisa },
    { id: 'paypal', name: 'PayPal', icon: FaPaypal },
    { id: 'apple', name: 'Apple Pay', icon: FaApple },
  ];

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = (subtotal * 0.20).toFixed(2);
  const total = (parseFloat(subtotal) + shipping + parseFloat(tax)).toFixed(2);

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 0: Cart */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Votre Panier</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.id}-${item.size}-${item.color}`}
                        className="bg-white rounded-lg shadow-sm p-4 flex gap-3 sm:gap-4 hover:shadow-md transition"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                          <div className="flex gap-3 text-xs sm:text-sm text-gray-600 mt-1 flex-wrap">
                            {item.size && <span>Taille: <strong>{item.size}</strong></span>}
                            {item.color && <span>Couleur: <strong>{item.color}</strong></span>}
                          </div>
                          <p className="font-bold text-[#5E2251] mt-2">{item.price}€</p>
                        </div>
                        <div className="flex flex-col items-end justify-between gap-2">
                          <button
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                            className="text-red-600 hover:text-red-800 transition p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="flex items-center gap-1 border border-gray-300 rounded">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                              }
                              className="p-1 hover:bg-gray-100 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-2 font-semibold text-sm">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-100 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-4 rounded-lg transition mt-6 text-sm sm:text-base"
                  >
                    Continuer vers la livraison
                  </button>
                </div>
              )}

              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Truck size={24} />
                    Livraison
                  </h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Mail size={16} />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Phone size={16} />
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent text-sm"
                          required
                        />
                      </div>
                    </div>

                    <AddressSelector formData={formData} setFormData={setFormData} />

                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(0)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm"
                      >
                        Retour
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm"
                      >
                        Paiement
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard size={24} />
                    Paiement
                  </h2>
                  
                  {/* Payment methods */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                    {paymentMethods.map((method) => (
                      <PaymentMethodCard
                        key={method.id}
                        method={method}
                        isSelected={formData.paymentMethod === method.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      />
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent text-sm"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent text-sm"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent text-sm"
                            required
                          />
                        </div>
                      </div>
                    </form>
                  )}

                  {formData.paymentMethod === 'paypal' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
                      <FaPaypal size={48} className="mx-auto mb-3 text-blue-600" />
                      <p className="text-blue-900 font-semibold text-sm">Redirection vers PayPal</p>
                    </div>
                  )}

                  {formData.paymentMethod === 'apple' && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8 text-center">
                      <FaApple size={48} className="mx-auto mb-3 text-gray-900" />
                      <p className="text-gray-900 font-semibold text-sm">Apple Pay activé</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm"
                    >
                      Retour
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                    >
                      <Lock size={18} />
                      Vérifier
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle size={24} />
                    Vérification
                  </h2>
                  
                  <div className="space-y-6 mb-8">
                    {/* Shipping info */}
                    <div className="border-b pb-6">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin size={18} />
                        Adresse
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.shippingAddress}<br />
                        {formData.postalCode} {formData.city}, {formData.country}
                      </p>
                    </div>

                    {/* Payment method */}
                    <div className="border-b pb-6">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard size={18} />
                        Paiement
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formData.paymentMethod === 'card' && `Carte bancaire •••• ${formData.cardNumber.slice(-4)}`}
                        {formData.paymentMethod === 'paypal' && 'PayPal'}
                        {formData.paymentMethod === 'apple' && 'Apple Pay'}
                      </p>
                    </div>

                    {/* Items summary */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Articles</h3>
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-gray-600 text-sm">
                            <span>{item.name} ×{item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex gap-2 text-sm">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                    >
                      <Shield size={18} />
                      {loading ? 'Traitement...' : 'Commander'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Résumé</h2>

                <div className="space-y-2 mb-6 pb-6 border-b text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxe (20%)</span>
                    <span>{tax}€</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#5E2251]">{total}€</span>
                </div>

                {subtotal > 50 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-xs text-green-700 font-semibold">
                    ✓ Livraison gratuite!
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex gap-2">
                  <Shield size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Sécurisé</p>
                    <p>Données chiffrées</p>
                  </div>
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
