import { useState, useMemo } from 'react'
import Navbar from '../Header'
import RespNav from '../resp/RespNav'
import  Footer  from '../Footer'
import { ProductCard } from '../card/ProductCard'
import { Star, Filter } from 'lucide-react'
import '../../assets/animatedButton.css'

/**
 * GroupProductPage - Composant générique pour afficher les produits de n'importe quel groupe
 * 
 * Props:
 *  - products {Array} - Liste des produits à afficher
 *  - groupName {string} - Nom du groupe (ex: "BTS – Bangtan Boys")
 *  - groupDescription {string} - Description du groupe (ex: "Vêtements & Accessoires KPOP")
 */
export default function GroupProductPage({ 
  products, 
  groupName = "BTS – Bangtan Boys", 
  groupDescription = "Vêtements & Accessoires KPOP" 
}) {
  const [sortBy, setSortBy] = useState('vedette')

  // Fonction de tri fonctionnelle
  const sortedProducts = useMemo(() => {
    let sorted = [...products]
    
    switch(sortBy) {
      case 'vedette':
        sorted = sorted.sort((a, b) => (b.featured || 0) - (a.featured || 0))
        break
      case 'best-sellers':
        sorted = sorted.sort((a, b) => (b.sales || 0) - (a.sales || 0))
        break
      case 'price-asc':
        sorted = sorted.sort((a, b) => {
          const priceA = a.reducedPrice || a.price
          const priceB = b.reducedPrice || b.price
          return priceA - priceB
        })
        break
      case 'price-desc':
        sorted = sorted.sort((a, b) => {
          const priceA = a.reducedPrice || a.price
          const priceB = b.reducedPrice || b.price
          return priceB - priceA
        })
        break
      default:
        break
    }
    
    return sorted
  }, [sortBy, products])

  const sortOptions = [
    { value: 'vedette', label: 'En vedette' },
    { value: 'best-sellers', label: 'Meilleur vente' },
    { value: 'price-desc', label: 'Prix: élevés → bas' },
    { value: 'price-asc', label: 'Prix: bas → élevés' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="lg:hidden">
        <RespNav />
      </div>
      
      {/* Discount Banner */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">-10%</p>
            <p className="text-sm text-gray-600">dès 2 articles achetés</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">-15%</p>
            <p className="text-sm text-gray-600">dès 3 articles achetés</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">-20%</p>
            <p className="text-sm text-gray-600">dès 4 articles achetés</p>
          </div>
        </div>
      </div>

      {/* Title Section with Animation */}
      <div className="w-full bg-white py-8 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight animate-slide-up">
            {groupName} | {groupDescription}
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <a href="/" className="text-[#5E2251] hover:underline">KPOP</a>
          <span>›</span>
          <span>{groupName} | {groupDescription}</span>
        </nav>
      </div>

      {/* Filter & Sort Bar - Improved Design */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-[#5E2251] hover:bg-[#f5f0f2] transition-all duration-300 text-gray-700 hover:text-[#5E2251] font-medium">
            <Filter size={18} />
            <span>Filtrer</span>
          </button>

          {/* Sort Section */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <span className="text-gray-700 font-medium text-sm">Trier par:</span>
            <div className="flex gap-2 flex-wrap">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    sortBy === option.value
                      ? 'bg-[#5E2251] text-white shadow-lg'
                      : 'border border-gray-300 text-gray-700 hover:border-[#5E2251] hover:bg-[#f5f0f2]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-600 text-sm">{sortedProducts.length} produits</p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              <ProductCard
                id={product.id}
                image={product.url}
                hoverImage={product.urlHover}
                name={product.name}
                price={product.price}
                reducedPrice={product.reducedPrice}
              />
              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.rating) ? "fill-[#5E2251] text-[#5E2251]" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      
      {/* Bottom Footer */}
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  )
}