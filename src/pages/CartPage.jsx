import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'credit_card',
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Veuillez vous connecter</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder au panier</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-6">Votre panier est vide. Retournez aux produits!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Préparer les items pour la commande
      const items = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      // Créer la commande
      const order = await checkoutAPI.createOrder(
        items,
        formData.shippingAddress,
        formData.paymentMethod
      );

      // Vider le panier
      clearCart();

      // Rediriger vers Shopify Checkout (à implémenter)
      navigate(`/order-confirmation/${order.order.id}`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panier items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="bg-white rounded-lg shadow p-4 flex gap-4"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  {item.size && <p className="text-sm text-gray-600">Taille: {item.size}</p>}
                  {item.color && <p className="text-sm text-gray-600">Couleur: {item.color}</p>}
                  <p className="font-bold text-purple-600 mt-2">{item.price}€</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 border border-gray-300 rounded">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                      }
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                      }
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    className="text-red-600 hover:text-red-800 text-sm font-bold"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé et formulaire */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Résumé</h2>

              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Total articles:</span>
                  <span>{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-purple-600">
                  <span>Total:</span>
                  <span>{getTotalPrice().toFixed(2)}€</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison
                  </label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows="3"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Traitement...' : 'Procéder au paiement'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
