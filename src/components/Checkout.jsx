import React, { useState } from 'react';
import { useCart } from '../store/CartContext';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Lock, Truck, Gift } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    // Step 1: Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    shippingMethod: 'standard',

    // Step 2: Payment
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingAddress: 'same',
    billingCity: '',
    billingPostalCode: '',

    // Step 3: Confirmation
    giftWrap: false,
    giftMessage: '',
    newsletter: true,
    terms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert('Veuillez remplir tous les champs requis');
        return false;
      }
      if (!formData.address || !formData.city || !formData.postalCode) {
        alert('Veuillez remplir l\'adresse complète');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        alert('Veuillez remplir les informations de carte');
        return false;
      }
      if (formData.cardNumber.length !== 16) {
        alert('Numéro de carte invalide (16 chiffres)');
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!formData.terms) {
        alert('Vous devez accepter les conditions générales');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);
    
    // Simuler une requête de paiement
    setTimeout(() => {
      // Succès du paiement
      clearCart();
      navigate('/order-confirmation', {
        state: {
          orderId: `ORD-${Date.now()}`,
          total: getTotalPrice(),
          items: cartItems,
          customer: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
          },
        },
      });
      setIsProcessing(false);
    }, 2000);
  };

  const subtotal = getTotalPrice();
  const shipping = formData.shippingMethod === 'express' ? 15.99 : (subtotal > 50 ? 0 : 9.99);
  const total = subtotal + shipping;

  // Étapes du checkout
  const steps = [
    { number: 1, title: 'Adresse', icon: Truck },
    { number: 2, title: 'Paiement', icon: Lock },
    { number: 3, title: 'Confirmation', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb / Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step >= s.number;
              const isCurrent = step === s.number;

              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${
                        isActive
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isActive ? <Icon size={24} /> : s.number}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent ? 'text-pink-600' : isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        isActive ? 'bg-pink-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* STEP 1: SHIPPING */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Adresse de livraison</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                      placeholder="jean@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                      placeholder="123 Rue de la Paix"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                        placeholder="Paris"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                        placeholder="75001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Méthode de livraison
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-600 transition-colors"
                             style={{ borderColor: formData.shippingMethod === 'standard' ? '#ec4899' : '' }}>
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-semibold text-gray-900">Livraison Standard</p>
                          <p className="text-sm text-gray-600">5-7 jours ouvrables - {subtotal > 50 ? 'Gratuit' : '9,99€'}</p>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-600 transition-colors"
                             style={{ borderColor: formData.shippingMethod === 'express' ? '#ec4899' : '' }}>
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-semibold text-gray-900">Livraison Express</p>
                          <p className="text-sm text-gray-600">2-3 jours ouvrables - 15,99€</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Informations de paiement</h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nom sur la carte *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                      placeholder="JEAN DUPONT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Numéro de carte *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                        handleInputChange({ target: { name: 'cardNumber', value, type: 'text' } });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 font-mono"
                      placeholder="1234 5678 9012 3456"
                      maxLength="16"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Expiration (MM/YY) *
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          handleInputChange({ target: { name: 'cardExpiry', value, type: 'text' } });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        CVC *
                      </label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                          handleInputChange({ target: { name: 'cardCvc', value, type: 'text' } });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <Lock className="inline mr-2" size={16} />
                      <strong>Paiement sécurisé SSL 256-bit</strong> - Vos données sont cryptées et sécurisées
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-pink-600 transition-colors">
                      <input
                        type="checkbox"
                        name="billingAddress"
                        checked={formData.billingAddress === 'same'}
                        onChange={() => handleInputChange({ target: { name: 'billingAddress', value: formData.billingAddress === 'same' ? 'different' : 'same', type: 'text' } })}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-gray-900">
                        L'adresse de facturation est identique à celle de livraison
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIRMATION */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Confirmation de commande</h2>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">Détails de la commande</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Livraison à:</span>
                        <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adresse:</span>
                        <span className="font-semibold">{formData.address}, {formData.postalCode} {formData.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">{formData.email}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600">Méthode:</span>
                        <span className="font-semibold">
                          {formData.shippingMethod === 'standard' ? 'Livraison Standard (5-7 jours)' : 'Livraison Express (2-3 jours)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-pink-600 transition-colors">
                      <input
                        type="checkbox"
                        name="giftWrap"
                        checked={formData.giftWrap}
                        onChange={handleInputChange}
                        className="w-4 h-4 mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          <Gift size={16} />
                          Emballage cadeau (+5,00€)
                        </p>
                        <p className="text-sm text-gray-600">Parfait pour offrir</p>
                      </div>
                    </label>
                  </div>

                  {formData.giftWrap && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Message cadeau (optionnel)
                      </label>
                      <textarea
                        name="giftMessage"
                        value={formData.giftMessage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 resize-none"
                        placeholder="Écrivez votre message ici..."
                        rows="3"
                      />
                    </div>
                  )}

                  <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-pink-600 transition-colors">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-1"
                    />
                    <span className="ml-3 text-sm text-gray-900">
                      Je souhaite recevoir nos offres et actualités
                    </span>
                  </label>

                  <label className="flex items-start p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-600 transition-colors"
                         style={{ borderColor: formData.terms ? '#ec4899' : '' }}>
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-1"
                    />
                    <span className="ml-3 text-sm text-gray-900">
                      J'accepte les <a href="#" className="text-pink-600 font-semibold">conditions générales de vente</a> et la <a href="#" className="text-pink-600 font-semibold">politique de confidentialité</a> *
                    </span>
                  </label>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handlePreviousStep}
                  disabled={step === 1}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:border-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Retour
                </button>

                {step < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continuer
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        Confirmer la commande
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Résumé commande</h3>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-gray-600">×{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{shipping.toFixed(2)}€</span>
                </div>
                {formData.giftWrap && (
                  <div className="flex justify-between text-gray-600">
                    <span>Emballage cadeau</span>
                    <span>5,00€</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600 font-semibold">Total</span>
                  <span className="text-3xl font-bold text-pink-600">
                    {(total + (formData.giftWrap ? 5 : 0)).toFixed(2)}€
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>✓ Paiement sécurisé 256-bit SSL</p>
                <p>✓ Données personnelles protégées</p>
                <p>✓ Garantie de confidentialité</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
