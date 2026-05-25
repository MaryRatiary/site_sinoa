import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { checkoutAPI } from '../../services/api';
import { X, Trash2, Plus, Minus, ShoppingBag, Zap, Loader2 } from 'lucide-react';

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  // ✅ Compter le NOMBRE TOTAL d'articles (somme des quantités)
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = getTotalPrice();
  
  // Logique de réduction basée sur le nombre TOTAL d'articles
  const getDiscount = () => {
    if (itemCount >= 5) return 20;
    if (itemCount >= 2) return 10;
    return 0;
  };

const getDiscountMessage = () => {
  if (itemCount >= 5) return '🎉 20% max débloqué !';
  if (itemCount >= 2) return `✅ 10% débloqué — encore ${5 - itemCount} produit${5 - itemCount > 1 ? 's' : ''} pour 20% !`;
  if (itemCount === 1) return '➕ Encore 1 produit pour débloquer 10% !';
  return '🛒 Ajoutez 2 produits pour débloquer 10% !';
};

  const discount = getDiscount();
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const progressPercentage = Math.min((itemCount / 5) * 100, 100);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Shopify checkout interdit l'iframe (frame-ancestors 'none').
  // Si l'app tourne dans une iframe (ex: Shopify Admin embedded app),
  // window.location.href ne change que l'iframe → Shopify bloque le rendu.
  // On force un redirect au niveau du top-frame.
  const redirectToCheckout = (url) => {
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = url;
        return;
      }
    } catch (e) {
      // Parent cross-origin : impossible d'écrire window.top.location.
      // Fallback : ouvrir le checkout dans un nouvel onglet (top-level).
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (win) return;
    }
    window.location.href = url;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    setCheckoutError(null);
    setIsCheckingOut(true);
    handleClose();
    try {
      const { checkoutUrl } = await checkoutAPI.createShopifyCheckout(cartItems);
      redirectToCheckout(checkoutUrl);
    } catch (err) {
      setIsCheckingOut(false);
      setCheckoutError(err.message || 'Erreur lors du checkout');
      alert(err.message || 'Erreur lors du checkout');
    }
  };

  if (!isOpen) return null;

  // ✅ Logos de paiement
  const paymentLogos = [
    { name: 'Visa', src: '/paiement/Visa.svg' },
    { name: 'Mastercard', src: '/paiement/masstercard.svg' },
    { name: 'American Express', src: '/paiement/amex.svg' },
    { name: 'PayPal', src: '/paiement/Shop.svg' },
    { name: 'Apple Pay', src: '/paiement/applepay.svg' },
    { name: 'Google Pay', src: '/paiement/Gpay.svg' },
    { name: 'Bancontact', src: '/paiement/bancontact.svg' },
    { name: 'UnionPay', src: '/paiement/unionPay.svg' },
  ];

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes progressFill {
          from {
            width: 0;
          }
          to {
            width: ${progressPercentage}%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .cart-modal-overlay {
          animation: fadeInOverlay 0.3s ease-out;
        }

        .cart-modal-panel {
          animation: ${isClosing ? 'slideOutRight' : 'slideInRight'} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .cart-item {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .discount-badge {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .progress-bar {
          animation: progressFill 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[999] cart-modal-overlay"
        onClick={handleClose}
      />

      {/* Sidebar Modal - 35% width desktop, 100% mobile */}
      <div className="fixed right-0 top-0 h-screen w-full md:w-[35%] bg-white shadow-2xl z-[1000] flex flex-col cart-modal-panel">
        {/* Header - COMPACT */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={24} className="text-[#5E2251]" />
            Panier
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition duration-200"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>


        {/* Jauge de Réduction - ULTRA COMPACT */}
        {cartItems.length > 0 && (
          <div className="px-4 py-2 border-b border-gray-200 bg-yellow-50">
            {/* Titre et compteur */}
            <div className="flex items-center gap-1">
  <Zap size={16} className="text-yellow-500" />
  <span className="font-bold text-gray-900 text-sm">
    Réduction {discount > 0 ? `${discount}%` : ''}
  </span>
</div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1">
                <Zap size={16} className="text-yellow-500" />
                <span className="font-bold text-gray-900 text-sm">
                  {discount}%
                </span>
              </div>
              <span className="text-xs font-bold text-gray-600">
                {itemCount}/5
              </span>
            </div>

            {/* Barre de progression - RÉDUITE */}
           {/* Barre de progression avec marqueurs */}
<div className="relative mb-1">
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div
      className="progress-bar bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full"
      style={{ width: `${progressPercentage}%` }}
    />
  </div>

  {/* Marqueur 10% — à 40% de la barre (2/5) */}
  <div
    className="absolute top-[-3px]"
    style={{ left: 'calc(40% - 1px)' }}
  >
    <div className="w-[2px] h-[14px] bg-orange-400 rounded-sm" />
  </div>

  {/* Marqueur 20% — à 100% de la barre (5/5) */}
  <div className="absolute top-[-3px] right-0">
    <div className="w-[2px] h-[14px] bg-red-500 rounded-sm" />
  </div>
</div>

{/* Légende des marqueurs */}
<div className="relative h-4 mb-1">
  <span
    className="absolute text-[10px] font-bold text-orange-400"
    style={{ left: 'calc(40% - 10px)' }}
  >
    10%
  </span>
  <span className="absolute right-0 text-[10px] font-bold text-red-500">
    20%
  </span>
</div>

            {/* Message - COMPACT */}
            <p className="text-xs text-gray-600 font-semibold">
              {getDiscountMessage()}
            </p>
          </div>
        )}

        {/* Contenu du Panier - MAXIMISER CET ESPACE */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-gray-200 mb-3" />
              <p className="text-gray-600 font-bold text-sm">Panier vide</p>
              <p className="text-xs text-gray-500 mt-1">
                Ajoutez des produits!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all duration-200 cart-item border border-gray-200 hover:border-[#5E2251]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image et infos */}
                  <div className="flex gap-2 mb-2">
                    {item.image && (
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-300"
                        />
                        {item.quantity > 1 && (
                          <div className="absolute -top-1 -right-1 bg-[#5E2251] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-xs truncate">
                        {item.name}
                      </h3>
                      <div className="text-xs text-gray-600 mt-0.5 space-y-0.5">
                        {item.size && <p>T: {item.size}</p>}
                        {item.color && <p>C: {item.color}</p>}
                      </div>
                      <p className="font-bold text-[#5E2251] mt-1 text-sm">
                        €{(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Contrôles quantité - COMPACT */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0 border border-gray-300 rounded bg-white overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.color, Math.max(1, item.quantity - 1))
                        }
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 font-bold text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec Résumé - ULTRA COMPACT */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-3 space-y-2 bg-white">
            {/* Résumé des Prix - RÉDUIT */}
            <div className="space-y-1 pb-2 border-b border-gray-300">
              <div className="flex justify-between text-xs text-gray-700">
                <span>Sous-total</span>
                <span className="font-semibold">€{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-xs bg-green-50 -mx-1 px-1 py-0.5 rounded">
                  <span className="font-bold text-green-700">Réduction {discount}%</span>
                  <span className="font-bold text-green-600">
                    -€{discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                <span>Total</span>
                <span className="text-[#5E2251] text-base">€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Boutons d'Action - COMPACT */}
            <div className="space-y-1.5">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 px-3 rounded-lg transition duration-300 text-sm"
              >
                Paiement
              </button>
              <button
                onClick={handleClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-1.5 px-3 rounded-lg transition text-sm"
              >
                Continuer
              </button>
            </div>

            {/* ✅ Logos de paiement acceptés */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-2">
                Paiements sécurisés
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {paymentLogos.map((logo) => (
                  <img
                    key={logo.name}
                    src={logo.src}
                    alt={logo.name}
                    title={logo.name}
                    className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Badge de Sécurité */}
            <div className="bg-blue-50 border border-blue-200 rounded p-1.5 text-center">
              <p className="text-xs text-blue-700 font-bold">
                🔒 Paiement 100% Sécurisé
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
