import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkoutAPI } from '../../services/api';
import {
  CheckCircle, AlertCircle, CreditCard,
  Truck, Lock, MapPin, Phone, Mail, Shield,
  ChevronLeft, Package, Sparkles
} from 'lucide-react';
import { FaPaypal, FaApple, FaCcVisa } from 'react-icons/fa';
import LayoutWrapper from '../composants/LayoutWrapper';
import AddressSelector from '../composants/AddressSelector';
import Footer from '../composants/Footer';

/* ─────────────────────────────────────────
   Success Modal
───────────────────────────────────────── */
const SuccessModal = ({ orderId, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-scaleIn">
      <div className="mb-5 flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={48} className="text-green-500" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
      <p className="text-gray-500 mb-6 text-sm">Merci pour votre achat chez Sinoa !</p>
      <div className="bg-[#5E2251]/5 border border-[#5E2251]/20 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500 mb-1">Numéro de commande</p>
        <p className="text-xl font-bold text-[#5E2251]">{orderId}</p>
      </div>
      <p className="text-gray-500 text-xs mb-6">
        Un email de confirmation avec les détails de votre commande vous sera envoyé.
      </p>
      <button
        onClick={onClose}
        className="w-full bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#5E2251]/30"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Payment Method Card
───────────────────────────────────────── */
const PaymentMethodCard = ({ method, isSelected, onClick }) => {
  const Icon = method.icon;
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
        isSelected
          ? 'border-[#5E2251] bg-[#5E2251]/5 shadow-md shadow-[#5E2251]/10 scale-105'
          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
      }`}
    >
      <Icon size={28} className={isSelected ? 'text-[#5E2251]' : 'text-gray-500'} />
      <p className={`font-semibold text-sm ${isSelected ? 'text-[#5E2251]' : 'text-gray-700'}`}>
        {method.name}
      </p>
    </button>
  );
};

/* ─────────────────────────────────────────
   Step Indicator — 3 étapes
   Livraison → Paiement → Confirmation
───────────────────────────────────────── */
const StepIndicator = ({ steps, currentStep }) => (
  <div className="mb-10">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-md shadow-green-200'
                    : isActive
                    ? 'bg-[#5E2251] text-white shadow-lg shadow-[#5E2251]/30 ring-4 ring-[#5E2251]/20'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? <CheckCircle size={20} /> : <StepIcon size={18} />}
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-semibold text-center hidden sm:block ${
                  isCompleted ? 'text-green-600' : isActive ? 'text-[#5E2251]' : 'text-gray-400'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4 h-1 rounded-full overflow-hidden bg-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-[#5E2251] to-green-500 rounded-full transition-all duration-700"
                  style={{ width: currentStep > step.id ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Input helper
───────────────────────────────────────── */
const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
      {Icon && <Icon size={14} className="text-[#5E2251]" />}
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5E2251]/30 focus:border-[#5E2251] text-sm transition-all duration-200 bg-white placeholder:text-gray-300';

/* ─────────────────────────────────────────
   Main CheckoutPage
───────────────────────────────────────── */
export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 3 étapes : 0 = Livraison, 1 = Paiement, 2 = Confirmation
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');

  // Données transmises par CartModal via navigate('/checkout', { state: {...} })
  const { discount = 0, subtotal: stateSubtotal } = location.state || {};

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    shippingAddress: '',
    city: '',
    postal_code: '',
    country: 'France',
    latitude: null,
    longitude: null,
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  // ✅ Logos de paiement
  const paymentLogos = [
    { name: 'Visa', src: '/paiement/Visa.svg' },
    { name: 'Mastercard', src: '/paiement/masstercard.svg' },
    { name: 'American Express', src: '/paiement/amex.svg' },
    { name: 'UnionPay', src: '/paiement/unionPay.svg' },
  ];

  /* ── Calculs (priorité au subtotal passé par le modal) ── */
  const subtotal = stateSubtotal ?? getTotalPrice();
  const discountAmount = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount > 50 ? 0 : 9.99;
  const tax = (afterDiscount * 0.20).toFixed(2);
  const total = (afterDiscount + shipping + parseFloat(tax)).toFixed(2);

  /* ── Appel API réel ── */
  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const items = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const order = await checkoutAPI.createOrder(
        items,
        formData.shippingAddress,
        formData.paymentMethod,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }
      );

      setSuccessOrderId(order.order?.id || 'CMD-' + Date.now());
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 0, name: 'Livraison', icon: Truck },
    { id: 1, name: 'Paiement', icon: CreditCard },
    { id: 2, name: 'Confirmation', icon: CheckCircle },
  ];

  const paymentMethods = [
    { id: 'card', name: 'Carte', icon: FaCcVisa },
    { id: 'paypal', name: 'PayPal', icon: FaPaypal },
    { id: 'apple', name: 'Apple Pay', icon: FaApple },
  ];

  /* ── Guard non connecté ── */
  if (!isAuthenticated) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-gray-50 py-16 mt-20 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center animate-fadeIn">
            <AlertCircle size={52} className="mx-auto mb-4 text-[#5E2251]" />
            <h1 className="text-2xl font-bold mb-3">Veuillez vous connecter</h1>
            <p className="text-gray-500 mb-8 text-sm">
              Vous devez être connecté pour procéder au paiement.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-8 rounded-xl transition"
            >
              Se connecter
            </button>
          </div>
        </div>
        <Footer />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-[#5E2251] hover:text-[#4a1a40] font-semibold transition-colors text-sm"
            >
              <ChevronLeft size={18} />
              Retour
            </button>
            <h1 className="text-xl font-bold text-gray-900">Finaliser la commande</h1>
          </div>

          {/* Discount banner */}
          {discount > 0 && (
            <div className="mb-6 bg-gradient-to-r from-[#5E2251] to-[#8b3a7a] text-white rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg shadow-[#5E2251]/20 animate-fadeIn">
              <Sparkles size={16} className="flex-shrink-0" />
              <p className="text-sm font-semibold">
                🎉 Réduction <strong>{discount}%</strong> appliquée — vous économisez{' '}
                <strong>€{discountAmount.toFixed(2)}</strong> !
              </p>
            </div>
          )}

          {/* Steps */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ── Left ── */}
            <div className="lg:col-span-2">

              {/* ÉTAPE 0 — Livraison */}
              {currentStep === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fadeIn">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#5E2251]/10 rounded-lg flex items-center justify-center">
                      <Truck size={16} className="text-[#5E2251]" />
                    </div>
                    Adresse de livraison
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Prénom *">
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          className={inputCls}
                          placeholder="Jean"
                        />
                      </Field>
                      <Field label="Nom *">
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          className={inputCls}
                          placeholder="Dupont"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Email *" icon={Mail}>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputCls}
                          placeholder="jean@exemple.fr"
                        />
                      </Field>
                      <Field label="Téléphone *" icon={Phone}>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={inputCls}
                          placeholder="+33 6 12 34 56 78"
                        />
                      </Field>
                    </div>

                    {/* AddressSelector gère shippingAddress, city, postal_code, country, latitude, longitude */}
                    <AddressSelector formData={formData} setFormData={setFormData} />

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition text-sm"
                      >
                        Retour au panier
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-[#5E2251]/30 text-sm flex items-center justify-center gap-2"
                      >
                        <CreditCard size={16} />
                        Paiement
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 1 — Paiement */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fadeIn">

                  {/* Titre section */}
                  <div className="flex items-center gap-2 mb-1">
                    <Lock size={18} className="text-gray-800" />
                    <h2 className="text-lg font-bold text-gray-900">Paiement Sécurisé</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">Toutes les transactions sont sécurisées et chiffrées.</p>

                  {/* Bloc carte de crédit unifié */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">

                    {/* Header méthode — onglets PayPal / Apple Pay */}
                    <div className="flex border-b border-gray-200">
                      {[
                        { id: 'card',   label: 'Carte de crédit' },
                        { id: 'paypal', label: 'PayPal' },
                        { id: 'apple',  label: 'Apple Pay' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                          className={`flex-1 py-3 text-xs font-semibold transition-all border-b-2 ${
                            formData.paymentMethod === m.id
                              ? 'border-gray-900 text-gray-900 bg-white'
                              : 'border-transparent text-gray-400 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {/* Carte de crédit */}
                    {formData.paymentMethod === 'card' && (
                      <div className="animate-fadeIn">
                        {/* ✅ Logos cartes — SVG locaux */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-wrap gap-2">
                          <span className="text-sm font-medium text-gray-700">Cartes acceptées</span>
                          <div className="flex items-center gap-2">
                            {paymentLogos.map((logo) => (
                              <img
                                key={logo.name}
                                src={logo.src}
                                alt={logo.name}
                                title={logo.name}
                                className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Champ numéro */}
                        <div className="border-b border-gray-100">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Numéro de carte"
                              value={formData.cardNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  cardNumber: e.target.value
                                    .replace(/\s/g, '')
                                    .replace(/(\d{4})/g, '$1 ')
                                    .trim(),
                                })
                              }
                              maxLength="19"
                              className="w-full px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:bg-gray-50 transition-colors"
                            />
                            <Lock size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                          </div>
                        </div>

                        {/* Expiration + CVC */}
                        <div className="flex border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="Date d'expiration (MM/AA)"
                            value={formData.cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, '');
                              if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                              setFormData({ ...formData, cardExpiry: v });
                            }}
                            maxLength="5"
                            className="flex-1 px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:bg-gray-50 transition-colors border-r border-gray-100"
                          />
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Code de sécurité"
                              value={formData.cardCvc}
                              onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                              maxLength="3"
                              className="w-full px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:bg-gray-50 transition-colors"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 text-xs font-bold leading-none">?</span>
                          </div>
                        </div>

                        {/* Nom sur la carte */}
                        <div className="border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="Nom sur la carte"
                            className="w-full px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:bg-gray-50 transition-colors"
                          />
                        </div>

                        {/* Checkbox adresse facturation */}
                        <label className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded accent-gray-900 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700">
                            Utiliser l'adresse d'expédition comme adresse de facturation
                          </span>
                        </label>
                      </div>
                    )}

                    {/* PayPal */}
                    {formData.paymentMethod === 'paypal' && (
                      <div className="px-6 py-10 text-center animate-fadeIn">
                        <img src="/paiement/Shop.svg" alt="PayPal" className="h-12 mx-auto mb-3 object-contain" />
                        <p className="text-gray-700 font-semibold text-sm">
                          Vous serez redirigé vers PayPal pour finaliser le paiement
                        </p>
                      </div>
                    )}

                    {/* Apple Pay */}
                    {formData.paymentMethod === 'apple' && (
                      <div className="px-6 py-10 text-center animate-fadeIn">
                        <img src="/paiement/applepay.svg" alt="Apple Pay" className="h-12 mx-auto mb-3 object-contain" />
                        <p className="text-gray-700 font-semibold text-sm">Apple Pay prêt</p>
                      </div>
                    )}
                  </div>

                  {/* Section téléphone */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      Sauvegardez mes données pour effectuer des paiements rapidement
                    </p>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
                      <Phone size={16} className="text-gray-400 flex-shrink-0" />
                      <input
                        type="tel"
                        placeholder="Téléphone mobile (facultatif)"
                        className="flex-1 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none bg-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      En fournissant votre numéro de téléphone, vous acceptez de créer un compte.
                    </p>
                  </div>

                  {/* Boutons navigation */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition text-sm"
                    >
                      Retour
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 tracking-wide"
                    >
                      Vérifier la commande →
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 — Confirmation */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fadeIn">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    Vérification de la commande
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-[#5E2251]" />
                        Adresse de livraison
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {formData.first_name} {formData.last_name}<br />
                        {formData.shippingAddress}<br />
                        {formData.postal_code} {formData.city}, {formData.country}<br />
                        {formData.phone}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                        <CreditCard size={14} className="text-[#5E2251]" />
                        Paiement
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formData.paymentMethod === 'card' &&
                          `Carte bancaire •••• ${formData.cardNumber.slice(-4)}`}
                        {formData.paymentMethod === 'paypal' && 'PayPal'}
                        {formData.paymentMethod === 'apple' && 'Apple Pay'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                        <Package size={14} className="text-[#5E2251]" />
                        Articles ({cartItems.length})
                      </h3>
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div
                            key={`${item.id}-${item.size}-${item.color}`}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {item.name} ×{item.quantity}
                              {item.size && <span className="text-gray-400 ml-1">({item.size})</span>}
                            </span>
                            <span className="font-semibold text-gray-800">
                              €{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 flex gap-2 text-sm animate-fadeIn">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition text-sm"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/30 text-sm flex items-center justify-center gap-2"
                    >
                      <Shield size={16} />
                      {loading ? 'Traitement...' : 'Confirmer la commande'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right — Résumé ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Package size={16} className="text-[#5E2251]" />
                  Résumé
                </h2>

                {/* Articles miniatures */}
                <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex gap-2 items-center"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">×{item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-700">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Calculs */}
                <div className="space-y-2 mb-5 pb-5 border-b border-gray-100 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Sous-total</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#5E2251] font-semibold bg-[#5E2251]/5 -mx-2 px-2 py-1.5 rounded-lg">
                      <span>Réduction {discount}%</span>
                      <span>-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-500">
                    <span>Livraison</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shipping === 0 ? 'Gratuite' : `€${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>TVA (20%)</span>
                    <span>€{tax}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-5">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#5E2251]">€{total}</span>
                </div>

                {discount > 0 && (
                  <div className="bg-[#5E2251]/5 border border-[#5E2251]/20 rounded-xl p-3 mb-3 text-xs text-[#5E2251] font-semibold flex items-center gap-2">
                    <Sparkles size={13} />
                    {discount}% de réduction appliquée !
                  </div>
                )}

                {afterDiscount > 50 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 text-xs text-green-700 font-semibold flex items-center gap-2">
                    <Truck size={13} />
                    Livraison gratuite !
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex gap-2 items-start">
                  <Shield size={14} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Paiement 100% sécurisé</p>
                    <p className="text-blue-500 mt-0.5">Données chiffrées SSL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <SuccessModal
          orderId={successOrderId}
          onClose={() => {
            setSuccess(false);
            navigate('/');
          }}
        />
      )}

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn  { animation: fadeIn  0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </LayoutWrapper>
  );
}
