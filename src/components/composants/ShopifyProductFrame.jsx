import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from './Header'
import RespNav from '../resp/RespNav'
import Footer from './Footer'
import { useCart } from '../../context/CartContext'
import { SHOPIFY_STORE, storeOrigin, productEmbedUrl } from '../../lib/shopifyConfig'
import { isAllowedOrigin, parseAddToCartMessage, parseHeightMessage } from '../../lib/shopifyBridge'

const MIN_HEIGHT = 600

export default function ShopifyProductFrame() {
  const { slug } = useParams()
  const { addToCart, openCart } = useCart()
  const [height, setHeight] = useState(MIN_HEIGHT)
  const [loaded, setLoaded] = useState(false)

  const src = productEmbedUrl(SHOPIFY_STORE, slug)
  const allowedOrigin = storeOrigin(SHOPIFY_STORE)

  useEffect(() => {
    const handler = (event) => {
      if (!isAllowedOrigin(event.origin, allowedOrigin)) return

      const h = parseHeightMessage(event.data)
      if (h) {
        setHeight(Math.max(MIN_HEIGHT, h))
        return
      }

      const add = parseAddToCartMessage(event.data)
      if (add) {
        addToCart(add.product, add.quantity, add.size, add.color, add.variantId, add.model)
        openCart()
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [allowedOrigin, addToCart, openCart])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="hidden lg:block"><Navbar /></div>
      <div className="lg:hidden"><RespNav /></div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-2 md:px-4">
        {!src && (
          <div className="py-20 text-center text-red-500">
            Configuration Shopify manquante (VITE_SHOPIFY_STORE).
          </div>
        )}

        {src && (
          <>
            {!loaded && (
              <div className="py-20 text-center text-gray-500">Chargement du produit…</div>
            )}
            <iframe
              src={src}
              title="Fiche produit"
              onLoad={() => setLoaded(true)}
              scrolling="no"
              style={{ width: '100%', height: `${height}px`, border: 'none', display: 'block' }}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
