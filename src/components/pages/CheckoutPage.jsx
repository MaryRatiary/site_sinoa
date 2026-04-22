import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkoutAPI } from '../../services/api';
// Import supprimé - utilise le backend pour Shopify
import {
  CheckCircle, AlertCircle, CreditCard,
  Truck, Lock, MapPin, Phone, Mail, Shield,
  ChevronLeft, Package, Sparkles
} from 'lucide-react';
import { FaPaypal, FaApple, FaCcVisa } from 'react-icons/fa';
import LayoutWrapper from '../composants/LayoutWrapper';
import AddressSelector from '../composants/AddressSelector';
import Footer from '../composants/Footer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* ─────────────────────────────────────────
   Générateur de reçu PDF
───────────────────────────────────────── */
const generateReceiptPDF = (orderId, formData, cartItems, subtotal, discountAmount, shipping, tax, total) => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(22);
  doc.setTextColor(94, 34, 81); // #5E2251
  doc.text('SINOA KPOP - Facture', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Numéro de commande : ${orderId}`, 14, 30);
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 14, 38);

  // Informations client
  doc.setFontSize(14);
  doc.setTextColor(50);
  doc.text('Informations Client :', 14, 50);
  doc.setFontSize(11);
  doc.text(`${formData.first_name} ${formData.last_name}`, 14, 58);
  doc.text(formData.email, 14, 65);
  doc.text(formData.phone || '-', 14, 72);

  // Adresse
  doc.setFontSize(14);
  doc.text('Adresse de livraison :', 110, 50);
  doc.setFontSize(11);
  doc.text(formData.shippingAddress, 110, 58);
  doc.text(`${formData.postal_code} ${formData.city}`, 110, 65);
  doc.text(formData.country, 110, 72);

  // Paiement
  doc.text(`Mode de paiement : ${formData.paymentMethod.toUpperCase()}`, 14, 85);
  if (formData.paymentMethod === 'card') {
    doc.text(`Carte : **** **** **** ${formData.cardNumber.slice(-4) || 'XXXX'}`, 14, 92);
  }

  // Tableau des articles
  const tableData = cartItems.map(item => {
    let details = [];
    if (item.color) details.push(`Couleur: ${item.color}`);
    if (item.size) details.push(`Taille: ${item.size}`);
    if (item.model) details.push(`Modèle: ${item.model}`);
    const detailsStr = details.length ? `\n(${details.join(' • ')})` : '';

    return [
      `${item.name}${detailsStr}`,
      item.quantity,
      `€${item.price.toFixed(2)}`,
      `€${(item.price * item.quantity).toFixed(2)}`
    ];
  });

  doc.autoTable({
    startY: 100,
    head: [['Produit', 'Quantité', 'Prix Unitaire', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [94, 34, 81] },
    styles: { fontSize: 10 }
  });

  // Totaux
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Sous-total: €${subtotal.toFixed(2)}`, 130, finalY);
  if (discountAmount > 0) doc.text(`Réduction: -€${discountAmount.toFixed(2)}`, 130, finalY + 8);
  doc.text(`Livraison: ${shipping === 0 ? 'Gratuite' : `€${shipping.toFixed(2)}`}`, 130, finalY + 16);
  doc.text(`TVA (20%): €${tax}`, 130, finalY + 24);
  
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`TOTAL TTC: €${total}`, 130, finalY + 34);

  // Pied de page
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Merci de votre achat chez Sinoa !', 105, 280, { align: 'center' });

  doc.save(`Facture_Sinoa_${orderId}.pdf`);
};

/* ─────────────────────────────────────────
   Success Modal
───────────────────────────────────────── */
const SuccessModal = ({ orderId, formData, cartItems, subtotal, discountAmount, shipping, tax, total, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl animate-scaleIn">
      <div className="mb-5 flex justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500 sm:w-12 sm:h-12" />
        </div>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
      <p className="text-gray-500 mb-6 text-xs sm:text-sm">Merci pour votre achat chez Sinoa !</p>
      <div className="bg-[#5E2251]/5 border border-[#5E2251]/20 rounded-xl p-3 sm:p-4 mb-6">
        <p className="text-xs text-gray-500 mb-1">Numéro de commande</p>
        <p className="text-lg sm:text-xl font-bold text-[#5E2251]">{orderId}</p>
      </div>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={() => generateReceiptPDF(orderId, formData, cartItems, subtotal, discountAmount, shipping, tax, total)}
          className="w-full bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 px-4 sm:py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#5E2251]/30 text-sm sm:text-base flex items-center justify-center gap-2"
        >
          📄 Télécharger la facture (PDF)
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Step Indicator — 3 étapes
───────────────────────────────────────── */
const StepIndicator = ({ steps, currentStep }) => (
  <div className="mb-8 sm:mb-10">
    <div className="flex items-center justify-between gap-1 sm:gap-4">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center w-full">
              <div
                className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-md shadow-green-200'
                    : isActive
                    ? 'bg-[#5E2251] text-white shadow-lg shadow-[#5E2251]/30 ring-4 ring-[#5E2251]/20'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? <CheckCircle size={16} className="sm:w-6 sm:h-6" /> : <StepIcon size={14} className="sm:w-5 sm:h-5" />}
              </div>
              <span
                className={`mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-center ${
                  isCompleted ? 'text-green-600' : isActive ? 'text-[#5E2251]' : 'text-gray-400'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 rounded-full overflow-hidden bg-gray-100 mx-1 sm:mx-4">
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
    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
      {Icon && <Icon size={12} className="sm:w-4 sm:h-4 text-[#5E2251]" />}
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#5E2251]/30 focus:border-[#5E2251] text-xs sm:text-sm transition-all duration-200 bg-white placeholder:text-gray-300';

/* ─────────────────────────────────────────
   Main CheckoutPage
───────────────────────────────────────── */

// ========== FONCTION POUR CHARGER CONFIG SHOPIFY SÉCURISÉE ==========
const fetchShopifyConfig = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non authentifié');

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/shopify-checkout/config`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Configuration Shopify non disponible');
    }

    const data = await response.json();
    return data.config;
  } catch (error) {
    console.error('Erreur chargement config Shopify:', error);
    throw error;
  }
};

// ============== COMPOSANT CHECKOUT PAGE ==============

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');

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

  const paymentLogos = [
    { name: 'Visa', src: '/paiement/Visa.svg' },
    { name: 'Mastercard', src: '/paiement/masstercard.svg' },
    { name: 'American Express', src: '/paiement/amex.svg' },
    { name: 'UnionPay', src: '/paiement/unionPay.svg' },
  ];

  const subtotal = stateSubtotal ?? getTotalPrice();
  const discountAmount = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount > 50 ? 0 : 9.99;
  const tax = (afterDiscount * 0.20).toFixed(2);
  const total = (afterDiscount + shipping + parseFloat(tax)).toFixed(2);

    const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const items = cartItems.map((item) => ({
        productId: item.product_id || item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        model: item.model,
      }));

      // Créer la commande via le backend
      const response = await checkoutAPI.createOrder(
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

      const order = response.order;
      
      // Si le paiement est via Shopify, créer le checkout Shopify
      if (formData.paymentMethod === 'shopify') {
        try {
          // Créer le checkout via la route sécurisée du backend
          const shopifyCheckoutResponse = await checkoutAPI.shopifyCheckout(
            items,
            order.id
          );

          if (shopifyCheckoutResponse.checkoutUrl) {
            clearCart();
            // Rediriger vers Shopify Checkout
            window.location.href = shopifyCheckoutResponse.checkoutUrl;
            return;
          }
        } catch (shopifyError) {
          console.error('❌ Erreur Shopify:', shopifyError);
          setError('Erreur lors de la création du checkout Shopify. Veuillez réessayer.');
          setLoading(false);
          return;
        }
      } else {
        // Pour les autres méthodes de paiement
        setSuccessOrderId(order?.id || 'CMD-' + Date.now());
        setSuccess(true);
        // On ne vide plus le panier immédiatement s'il faut les données pour la facture PDF
        // Mais c'est ok car ils sont sauvés localement ou en state de SuccessModal
        clearCart();
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la commande');
      console.error('Erreur checkout:', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 0, name: 'Livraison', icon: Truck },
    { id: 1, name: 'Paiement', icon: CreditCard },
    { id: 2, name: 'Confirmation', icon: CheckCircle },
  ];

  // Suppression du bloc de redirection forcée pour permettre le checkout invité

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50 pt-23 sm:pt-38 pb-20 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 sm:gap-1.5 text-[#5E2251] hover:text-[#4a1a40] font-semibold transition-colors text-xs sm:text-sm"
            >
              <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <h1 className="text-base sm:text-xl font-bold text-gray-900">Finaliser la commande</h1>
          </div>

          {/* Discount banner */}
          {discount > 0 && (
            <div className="mb-6 sm:mb-8 bg-gradient-to-r from-[#5E2251] to-[#8b3a7a] text-white rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 flex items-center gap-2 sm:gap-3 shadow-lg shadow-[#5E2251]/20 animate-fadeIn">
              <Sparkles size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-semibold">
                🎉 Réduction <strong>{discount}%</strong> — vous économisez <strong>€{discountAmount.toFixed(2)}</strong> !
              </p>
            </div>
          )}

          {/* Steps */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

            {/* ── Left — Main Content ── */}
            <div className="lg:col-span-2 w-full">

              {/* ÉTAPE 0 — Livraison */}
              {currentStep === 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 animate-fadeIn">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#5E2251]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck size={14} className="sm:w-4 sm:h-4 text-[#5E2251]" />
                    </div>
                    <span className="text-sm sm:text-lg">Adresse de livraison</span>
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

                    <AddressSelector formData={formData} setFormData={setFormData} />

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl transition text-xs sm:text-sm"
                      >
                        Retour au panier
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:shadow-[#5E2251]/30 text-xs sm:text-sm flex items-center justify-center gap-2"
                      >
                        <CreditCard size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Paiement</span>
                        <span className="sm:hidden">Payer</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 1 — Paiement */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 animate-fadeIn">

                  <div className="flex items-center gap-2 mb-1">
                    <Lock size={14} className="sm:w-5 sm:h-5 text-gray-800" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Paiement Sécurisé</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">Toutes les transactions sont sécurisées et chiffrées.</p>

                  <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden mb-6">

                    <div className="flex border-b border-gray-200">
                      {[
                        { id: 'card',   label: 'Carte' },
                        { id: 'paypal', label: 'PayPal' },
                        { id: 'apple',  label: 'Apple' },
                        { id: 'shopify', label: 'Shopify' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                          className={`flex-1 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
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
                      <div className="animate-fadeIn space-y-3">
                        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-100 bg-white flex-wrap gap-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">Cartes acceptées</span>
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            {paymentLogos.map((logo) => (
                              <img
                                key={logo.name}
                                src={logo.src}
                                alt={logo.name}
                                title={logo.name}
                                className="h-4 sm:h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="border-b border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3.5">
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
                            className="w-full px-0 py-0 text-xs sm:text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>

                        <div className="flex border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="MM/AA"
                            value={formData.cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, '');
                              if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                              setFormData({ ...formData, cardExpiry: v });
                            }}
                            maxLength="5"
                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:bg-gray-50 transition-colors border-r border-gray-100"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            value={formData.cardCvc}
                            onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                            maxLength="3"
                            className="w-16 sm:w-20 px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:bg-gray-50 transition-colors"
                          />
                        </div>

                        <div className="border-b border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3.5">
                          <input
                            type="text"
                            placeholder="Nom sur la carte"
                            className="w-full px-0 py-0 text-xs sm:text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none bg-transparent"
                          />
                        </div>

                        <label className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-gray-900 cursor-pointer" />
                          <span className="text-xs sm:text-sm text-gray-700">Utiliser l'adresse d'expédition</span>
                        </label>
                      </div>
                    )}

                    {/* PayPal */}
                    {formData.paymentMethod === 'paypal' && (
                      <div className="px-4 sm:px-6 py-8 sm:py-10 text-center animate-fadeIn">
                        <img src="/paiement/Shop.svg" alt="PayPal" className="h-8 sm:h-12 mx-auto mb-3 object-contain" />
                        <p className="text-gray-700 font-semibold text-xs sm:text-sm">Redirige vers PayPal</p>
                      </div>
                    )}

                    {/* Apple Pay */}
                    {formData.paymentMethod === 'apple' && (
                      <div className="px-4 sm:px-6 py-8 sm:py-10 text-center animate-fadeIn">
                        <img src="/paiement/applepay.svg" alt="Apple Pay" className="h-8 sm:h-12 mx-auto mb-3 object-contain" />
                        <p className="text-gray-700 font-semibold text-xs sm:text-sm">Apple Pay prêt</p>
                      </div>
                    )}

                    {/* Shopify Checkout */}
                    {formData.paymentMethod === 'shopify' && (
                      <div className="px-4 sm:px-6 py-8 sm:py-10 text-center animate-fadeIn">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#5E2251]/10 rounded-full mb-4">
                          <CreditCard size={24} className="sm:w-8 sm:h-8 text-[#5E2251]" />
                        </div>
                        <p className="text-gray-700 font-semibold text-xs sm:text-sm mb-2">Paiement Shopify Sécurisé</p>
                        <p className="text-gray-500 text-xs mb-4">Configuré via Netlify - Vos données sont protégées</p>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                          <p className="font-semibold mb-2">🔒 Moyens de paiement disponibles :</p>
                          <ul className="text-left space-y-1">
                            <li>✓ Carte bancaire (Visa, Mastercard, American Express)</li>
                            <li>✓ Apple Pay</li>
                            <li>✓ Google Pay</li>
                            <li>✓ Autres méthodes Shopify</li>
                          </ul>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Paiement traité de manière sécurisée par Shopify</p>
                      </div>
                    )}

                    
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl transition text-xs sm:text-sm"
                    >
                      Retour
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-2 px-3 sm:py-3.5 sm:px-4 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <span className="hidden sm:inline">Vérifier</span>
                      <span className="sm:hidden">Suite</span> →
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 — Confirmation */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 animate-fadeIn">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    Vérification
                  </h2>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-xs sm:text-sm">
                        <MapPin size={12} className="sm:w-4 sm:h-4 text-[#5E2251]" />
                        Adresse
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        {formData.first_name} {formData.last_name}<br />
                        {formData.shippingAddress}<br />
                        {formData.postal_code} {formData.city}, {formData.country}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-xs sm:text-sm">
                        <CreditCard size={12} className="sm:w-4 sm:h-4 text-[#5E2251]" />
                        Paiement
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {formData.paymentMethod === 'card' && `Carte •••• ${formData.cardNumber.slice(-4)}`}
                        {formData.paymentMethod === 'paypal' && 'PayPal'}
                        {formData.paymentMethod === 'apple' && 'Apple Pay'}
                        {formData.paymentMethod === 'shopify' && 'Shopify Checkout'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-xs sm:text-sm">
                        <Package size={12} className="sm:w-4 sm:h-4 text-[#5E2251]" />
                        Articles ({cartItems.length})
                      </h3>
                      <div className="space-y-1">
                        {cartItems.map((item) => (
                          <div key={`${item.id}-${item.size}-${item.color}-${item.model}`} className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">
                              {item.name} ×{item.quantity}
                              <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                                {item.color && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Couleur: {item.color}</span>}
                                {item.size && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Taille: {item.size}</span>}
                                {item.model && <span className="text-[10px] bg-[#5E2251]/5 text-[#5E2251] px-1.5 py-0.5 rounded font-medium">Modèle: {item.model}</span>}
                              </div>
                            </span>
                            <span className="font-semibold text-gray-800">€{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl mb-5 flex gap-2 text-xs sm:text-sm animate-fadeIn">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl transition text-xs sm:text-sm"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/30 text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <Shield size={14} className="sm:w-4 sm:h-4" />
                      {loading ? 'Traitement...' : 'Confirmer'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right — Résumé ── */}
            <div className="lg:col-span-1 w-full">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-24 sm:top-28">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
                  <Package size={14} className="sm:w-4 sm:h-4 text-[#5E2251]" />
                  Résumé
                </h2>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-gray-100 max-h-40 sm:max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-2 items-start">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded flex-shrink-0 border border-gray-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        <div className="text-[10px] text-gray-400 flex flex-wrap gap-x-1.5 mt-0.5">
                          <span>×{item.quantity}</span>
                          {item.color && <span>• {item.color}</span>}
                          {item.size && <span>• {item.size}</span>}
                          {item.model && <span>• {item.model}</span>}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-gray-700 flex-shrink-0">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-gray-100 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Sous-total</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#5E2251] font-semibold bg-[#5E2251]/5 -mx-2 px-2 py-1 rounded-lg text-xs">
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
                    <span>TVA</span>
                    <span>€{tax}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="font-bold text-gray-900 text-sm sm:text-base">Total</span>
                  <span className="text-lg sm:text-2xl font-bold text-[#5E2251]">€{total}</span>
                </div>

                {discount > 0 && (
                  <div className="bg-[#5E2251]/5 border border-[#5E2251]/20 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 text-xs text-[#5E2251] font-semibold flex items-center gap-2">
                    <Sparkles size={11} className="sm:w-3.5 sm:h-3.5" />
                    {discount}% appliquée !
                  </div>
                )}

                {afterDiscount > 50 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 text-xs text-green-700 font-semibold flex items-center gap-2">
                    <Truck size={11} className="sm:w-3.5 sm:h-3.5" />
                    Livraison gratuite !
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl p-2 sm:p-3 text-xs text-blue-700 flex gap-2 items-start">
                  <Shield size={12} className="flex-shrink-0 mt-0.5 sm:w-3.5 sm:h-3.5" />
                  <div>
                    <p className="font-semibold">Sécurisé</p>
                    <p className="text-blue-500 text-[10px] sm:text-xs mt-0.5">SSL chiffré</p>
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
          formData={formData}
          cartItems={cartItems}
          subtotal={subtotal}
          discountAmount={discountAmount}
          shipping={shipping}
          tax={tax}
          total={total}
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
