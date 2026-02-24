import React, { useState } from 'react';
import { useCart } from '../store/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItem, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const discountAmount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyCoupon = () => {
    if (couponCode === 'KPOP10') {
      setAppliedCoupon('KPOP10');
      setCouponCode('');
    } else {
      alert('Code coupon invalide');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">Commencez vos achats et découvrez nos produits KPOP exclusifs</p>
          <button
            onClick={() => navigate('/')}
            className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.size && <span>{item.size} • </span>}
                        {item.color && <span>{item.color}</span>}
                      </p>
                      <p className="text-sm text-gray-500">{item.price.toFixed(2)}€</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() =>
                          updateCartItem(item.id, {
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartItem(item.id, {
                            quantity: item.quantity + 1,
                          })
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Price & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)}€
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200 italic">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-pink-600 font-semibold hover:text-pink-700 flex items-center gap-2"
            >
              ← Continuer vos achats
            </button>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Résumé commande</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)}€`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Réduction ({appliedCoupon})</span>
                    <span>-{discountAmount.toFixed(2)}€</span>
                  </div>
                )}
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Code coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Entrez votre code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode}
                    className="px-4 py-2 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Appliquer
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Essayez: KPOP10</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600">Total</span>
                  <span className="text-3xl font-bold text-gray-900">{total.toFixed(2)}€</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                Procéder au paiement
                <ArrowRight size={20} />
              </button>

              <div className="mt-6 space-y-2 text-xs text-gray-600">
                <p>✓ Paiement sécurisé SSL</p>
                <p>✓ Livraison rapide</p>
                <p>✓ Retour gratuit 30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
