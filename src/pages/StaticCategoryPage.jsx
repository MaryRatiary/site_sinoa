import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductDetail from "../components/ProductDetail";
import Navbar from "../components/Header";
import RespNav from "../components/resp/RespNav";
import Footer from '../components/Footer';
import bestSellersData from '../data/bestSellers';
import groupesData from '../data/groupes';
import huntrixData from '../data/huntrixProducts';
import lightStickData from '../data/lightStick';
import '../assets/animatedButton.css';

const SORT_OPTIONS = [
  { value: 'vedette', label: 'En vedette' },
  { value: 'best-sellers', label: 'Meilleur vente' },
  { value: 'price-desc', label: 'Prix: élevés → bas' },
  { value: 'price-asc', label: 'Prix: bas → élevés' },
];

function applySort(products, sortType) {
  const sorted = [...products];
  
  switch(sortType) {
    case 'vedette':
      return sorted.sort((a, b) => (b.featured || 0) - (a.featured || 0));
    case 'best-sellers':
      return sorted.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceA - priceB;
      });
    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA;
      });
    default:
      return sorted;
  }
}

function getProductsByType(type) {
  switch(type) {
    case 'bestsellers':
      return bestSellersData;
    case 'groupes':
      return groupesData;
    case 'huntrix':
      return huntrixData;
    case 'lightsticks':
      return lightStickData;
    default:
      return [];
  }
}

function getCategoryInfo(type) {
  const info = {
    bestsellers: {
      name: 'Best Sellers du Moment',
      description: 'Nos produits les plus populaires et les plus vendus. Découvrez les favoris des fans KPOP.',
      image: '/boxes/box1.png'
    },
    groupes: {
      name: 'Nos Groupes KPOP',
      description: 'Explorez la collection complète de vos groupes K-pop préférés.',
      image: '/Par groupe/blackpink.jpg'
    },
    huntrix: {
      name: 'Huntrix - K-pop Demon Hunter',
      description: 'Collection exclusive Huntrix avec des produits uniques pour les vrais fans.',
      image: '/figurines/figurine1.png'
    },
    lightsticks: {
      name: 'K-pop Merch & Goodies',
      description: 'Light sticks officiels et merchandises des groupes KPOP les plus populaires.',
      image: '/lightstick/bts-bomb.png'
    }
  };
  return info[type] || { name: 'Produits', description: '', image: '' };
}

export default function StaticCategoryPage() {
  const { categoryType } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [sortBy, setSortBy] = useState('vedette');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const allProducts = getProductsByType(categoryType);
  const categoryInfo = getCategoryInfo(categoryType);
  const sortedProducts = applySort(allProducts, sortBy);

  // Pré-sélectionner le produit depuis le query parameter
  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId && allProducts.length > 0) {
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [searchParams, allProducts]);

  if (!allProducts || allProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-sans">
        Catégorie introuvable
      </div>
    );
  }

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

      {/* Title Section */}
      <div className="w-full bg-white py-8 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          {categoryInfo.image && (
            <div className="flex-shrink-0">
              <img
                src={categoryInfo.image}
                alt={categoryInfo.name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight animate-slide-up">
              {categoryInfo.name}
            </h1>
            {categoryInfo.description && (
              <p className="text-gray-600 mt-2">{categoryInfo.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <a href="/" className="text-[#5E2251] hover:underline">KPOP</a>
          <span>›</span>
          <span>{categoryInfo.name}</span>
        </nav>
      </div>

      {/* Filter & Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-[#5E2251] hover:bg-[#f5f0f2] transition-all duration-300 text-gray-700 hover:text-[#5E2251] font-medium">
            <Filter size={18} />
            <span>Filtrer</span>
          </button>

          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <span className="text-gray-700 font-medium text-sm">Trier par:</span>
            <div className="flex gap-2 flex-wrap">
              {SORT_OPTIONS.map((option) => (
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

      {/* Product Detail or Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {selectedProduct ? (
          <div className="mt-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="mb-6 px-4 py-2 text-[#5E2251] hover:bg-[#f5f0f2] rounded-lg transition-colors"
            >
              ← Retour à la liste
            </button>
            <ProductDetail product={selectedProduct} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => {
              const price = product.price || 0;
              const originalPrice = product.originalPrice || null;
              
              return (
                <div 
                  key={product.id} 
                  className="flex flex-col group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 hover:shadow-lg transition-all duration-300 p-4">
                    <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                      <img
                        src={product.url || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {originalPrice && price < originalPrice && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                          Soldes
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-600 ml-2">({product.reviewCount || 0})</span>
                    </div>

                    {price > 0 && (
                      <div className="flex items-baseline gap-2">
                        {originalPrice && price < originalPrice ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              {price.toFixed(2)}€
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {originalPrice.toFixed(2)}€
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {price.toFixed(2)}€
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-600">
                        {product.stock > 0 ? `${product.stock} en stock` : 'Indisponible'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}
