import { useCartStore } from '../../store/cartStore'
import { ArrowRight, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const { items, getTotal, user } = useCartStore()
  const total = getTotal()

  const handleCheckout = () => {
    // Rediriger vers Shopify Cart
    window.location.href = 'https://shopingkpop.myshopify.com/cart'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour procéder au paiement</p>
          <a
            href="/login"
            className="inline-block bg-[#5E2251] text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-900 transition"
          >
            Se connecter
          </a>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier pour continuer</p>
          <a
            href="/"
            className="inline-block bg-[#5E2251] text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-900 transition"
          >
            Continuer vos achats
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Récapitulatif de la commande</h1>
          <p className="text-gray-600">Bienvenue, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Vos articles</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#5E2251]">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        €{item.price?.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Résumé</h2>

              {/* Shipping & Tax */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-semibold text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold">€{(total * 0.2).toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-[#5E2251]">
                  €{(total * 1.2).toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#5E2251] text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-900 transition flex items-center justify-center gap-2"
              >
                <Lock size={20} />
                Procéder au paiement sécurisé
                <ArrowRight size={20} />
              </button>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 flex items-center gap-2">
                  <Lock size={16} />
                  Paiement sécurisé par Shopify
                </p>
              </div>

              {/* Return Policy */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  ✓ Satisfait ou remboursé <br />
                  ✓ Livraison gratuite <br />
                  ✓ Support client 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
