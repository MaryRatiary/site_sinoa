import { useEffect, useState } from 'react'
import { useCartStore } from '../store/cartStore'

export default function ShopifyProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCartStore()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storeName = import.meta.env.VITE_SHOPIFY_STORE_NAME
        const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN

        if (!storeName || !token) {
          throw new Error('Configurez VITE_SHOPIFY_STORE_NAME et VITE_SHOPIFY_STOREFRONT_TOKEN dans .env')
        }

        const query = `
          query {
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  featuredImage {
                    url
                    altText
                  }
                }
              }
            }
          }
        `

        const response = await fetch(`https://${storeName}/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
          },
          body: JSON.stringify({ query }),
        })

        const data = await response.json()

        if (data.errors) {
          throw new Error(data.errors[0].message)
        }

        setProducts(data.data.products.edges)
      } catch (err) {
        setError(err.message)
        console.error('Erreur lors de la récupération des produits:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    addToCart({
      id: product.node.id,
      title: product.node.title,
      price: parseFloat(product.node.priceRange.minVariantPrice.amount),
      image: product.node.featuredImage?.url,
      handle: product.node.handle,
    })
    alert(`${product.node.title} ajouté au panier!`)
  }

  if (loading) return <div className="text-center py-8">Chargement des produits...</div>
  if (error) return <div className="text-center py-8 text-red-500">Erreur: {error}</div>

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-8">Produits Shopify</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map(({ node }) => (
          <div key={node.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            {node.featuredImage && (
              <img
                src={node.featuredImage.url}
                alt={node.featuredImage.altText || node.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{node.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{node.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-[#5E2251]">
                  €{parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart({ node })}
                  className="flex-1 bg-[#5E2251] text-white px-4 py-2 rounded hover:bg-purple-900 transition font-semibold"
                >
                  Ajouter
                </button>
                <a
                  href={`https://${import.meta.env.VITE_SHOPIFY_STORE_NAME}/products/${node.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition font-semibold text-center"
                >
                  Voir
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
