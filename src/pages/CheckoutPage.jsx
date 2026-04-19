import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import { createShopifyCheckout } from '../services/shopify';
import { AlertCircle, Loader } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
    country: user?.country || 'France',
  });

  const [paymentMethod, setPaymentMethod] = useState('shopify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cartItems.length, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const shippingAddress = `${formData.address}, ${formData.city} ${formData.postal_code}, ${formData.country}`;

      if (paymentMethod === 'shopify') {
        // 1️⃣ Créer la commande dans la base de données
        const order = await checkoutAPI.createOrder(
          cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          shippingAddress,
          'shopify'
        );

        // 2️⃣ Créer le checkout Shopify
        const shopifyCheckout = await createShopifyCheckout(
          cartItems.map(item => ({
            merchandiseId: item.shopifyVariantId || `gid://shopify/ProductVariant/${item.id}`,
            quantity: item.quantity,
          }))
        );

        // 3️⃣ Mettre à jour la commande avec les infos Shopify
        // (Optionnel: appel API pour associer le cartId Shopify)

        // 4️⃣ Rediriger vers Shopify Checkout
        clearCart();
        window.location.href = shopifyCheckout.checkoutUrl;
      } else {
        // Paiement local (futur: Stripe, etc.)
        const order = await checkoutAPI.createOrder(
          cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          shippingAddress,
          paymentMethod
        );

        clearCart();
        setSuccess(true);
        setTimeout(() => {
          navigate(`/orders/${order.order.id}`);
        }, 2000);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Paiement Sécurisé</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600">✅ Commande créée avec succès!</p>
                </div>
              )}

              {/* Infos personnelles */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Prénom"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent outline-none"
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Nom"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent outline-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Adresse de livraison</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="Ville"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent outline-none"
                    />
                    <input
                      type="text"
                      name="postal_code"
                      placeholder="Code postal"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    name="country"
                    placeholder="Pays"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Méthode de paiement */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Méthode de paiement</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#5E2251] transition-colors"
                    style={{ borderColor: paymentMethod === 'shopify' ? '#5E2251' : undefined }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="shopify"
                      checked={paymentMethod === 'shopify'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Shopify Checkout (Sécurisé)</p>
                      <p className="text-sm text-gray-500">Paiement par carte, Apple Pay, Google Pay</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bouton Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5E2251] text-white py-3 rounded-lg font-semibold hover:bg-[#4a1a3d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader size={20} className="animate-spin" />}
                {loading ? 'Traitement...' : `Payer ${getTotalPrice().toFixed(2)}€`}
              </button>
            </form>
          </div>

          {/* Résumé */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h2>
            <div className="space-y-4 mb-6 border-b pb-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t">
                <span>Total</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
