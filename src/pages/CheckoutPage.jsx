import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import {
  AlertCircle, Truck, Lock, MapPin, Phone, Mail, Shield,
  ChevronLeft, Package, Sparkles, ExternalLink, Loader2
} from 'lucide-react';
import LayoutWrapper from '../composants/LayoutWrapper';
import AddressSelector from '../composants/AddressSelector';
import Footer from '../composants/Footer';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  });

  /* ── Calculs ── */
  const subtotal = stateSubtotal ?? getTotalPrice();
  const discountAmount = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount > 50 ? 0 : 9.99;
  const tax = (afterDiscount * 0.20).toFixed(2);
  const total = (afterDiscount + shipping + parseFloat(tax)).toFixed(2);

  /* ── Validation ── */
  const isFormValid = () => {
    return (
      formData.first_name.trim() &&
      formData.last_name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.shippingAddress.trim() &&
      formData.city.trim() &&
      formData.postal_code.trim()
    );
  };

  /* ── Checkout → redirection Shopify ── */
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const items = cartItems.map((item) => ({
        product_id: item.productId || item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        model: item.model,
      }));

      const result = await checkoutAPI.createOrder(
        items,
        formData.shippingAddress,
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

      const shopifyUrl = result?.order?.invoice_url;

      if (shopifyUrl) {
        clearCart();
        // Redirection vers le checkout Shopify
        window.location.href = shopifyUrl;
      } else {
        setError('URL de paiement Shopify non reçue. Veuillez réessayer.');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

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

  /* ── Panier vide ── */
  if (cartItems.length === 0) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-gray-50 py-16 mt-20 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center animate-fadeIn">
            <Package size={52} className="mx-auto mb-4 text-gray-300" />
            <h1 className="text-2xl font-bold mb-3">Panier vide</h1>
            <p className="text-gray-500 mb-8 text-sm">Ajoutez des produits avant de passer commande.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-3 px-8 rounded-xl transition"
            >
              Continuer les achats
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

          {/* Info Shopify */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-start gap-3 animate-fadeIn">
            <Shield size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">Paiement 100% sécurisé par Shopify</p>
              <p className="text-xs text-green-600 mt-0.5">
                Vous serez redirigé vers la page de paiement Shopify (Apple Pay, Google Pay, cartes bancaires…)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ── Formulaire Livraison ── */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleCheckout}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fadeIn"
              >
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
                        required
                      />
                    </Field>
                    <Field label="Nom *">
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className={inputCls}
                        placeholder="Dupont"
                        required
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
                        required
                      />
                    </Field>
                    <Field label="Téléphone *" icon={Phone}>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputCls}
                        placeholder="+33 6 12 34 56 78"
                        required
                      />
                    </Field>
                  </div>

                  {/* AddressSelector gère shippingAddress, city, postal_code, country, latitude, longitude */}
                  <AddressSelector formData={formData} setFormData={setFormData} />

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex gap-2 text-sm animate-fadeIn">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition text-sm"
                      disabled={loading}
                    >
                      Retour au panier
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-2 bg-[#5E2251] hover:bg-[#4a1a40] disabled:opacity-60 text-white font-bold py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-[#5E2251]/30 text-sm flex items-center justify-center gap-2 min-w-[200px]"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Redirection…
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          Payer avec Shopify
                          <ExternalLink size={14} className="opacity-70" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
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
                      key={`${item.id}-${item.size}-${item.color}-${item.model}`}
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
                        <div className="text-[10px] text-gray-400 flex flex-wrap gap-x-1.5">
                          <span>×{item.quantity}</span>
                          {item.color && <span>• {item.color}</span>}
                          {item.size && <span>• {item.size}</span>}
                          {item.model && <span>• {item.model}</span>}
                        </div>
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

                {/* Badges paiement */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-600 flex gap-2 items-start">
                  <Shield size={14} className="flex-shrink-0 mt-0.5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Paiement géré par Shopify</p>
                    <p className="text-gray-400 mt-0.5">Apple Pay · Google Pay · Cartes bancaires</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .flex-2 { flex: 2; }
      `}</style>
    </LayoutWrapper>
  );
}