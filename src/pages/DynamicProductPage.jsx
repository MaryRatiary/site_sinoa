import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Filter, X, ShoppingBag, Star, ArrowLeft } from "lucide-react";
import { useProductsByCategory } from "../hooks/useProducts";
import { useCategoryWithDetails } from "../hooks/useCategories";
import { useCart } from "../context/CartContext";
import { ProductCard2 } from "../components/card/ProductCard2";
import Navbar from "../components/Header";
import RespNav from "../components/resp/RespNav";
import Footer from '../components/Footer';
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

export default function DynamicProductPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [sortBy, setSortBy] = useState('vedette');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  
  // Récupérer les produits et la catégorie
  const { products, loading: productsLoading } = useProductsByCategory(categoryId);
  const { category, loading: categoryLoading } = useCategoryWithDetails(categoryId);

  const sortedProducts = applySort(products, sortBy);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Optionnel: afficher une notification
    alert(`${product.name} ajouté au panier!`);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  if (categoryLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!category) {
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

      {showProductDetail && selectedProduct ? (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setShowProductDetail(false)}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <>
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
              {/* Category Image */}
              {category.image && (
                <div className="flex-shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}
              
              {/* Title and Description */}
              <div className="flex-1">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight animate-slide-up">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-gray-600 mt-2">{category.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <a href="/" className="text-[#5E2251] hover:underline">KPOP</a>
              <span>›</span>
              <span>{category.name}</span>
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

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-4 pb-16">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="flex flex-col group">
                    {/* Product Card */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3 cursor-pointer"
                      onClick={() => handleViewDetails(product)}>
                      <img
                        src={product.image || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      
                      {/* Add to Cart Button - appears on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="absolute bottom-2 left-2 right-2 bg-[#5E2251] text-white py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 font-medium text-sm hover:bg-[#4a1a3f]"
                      >
                        <ShoppingBag size={16} />
                        Ajouter
                      </button>
                    </div>

                    {/* Product Info */}
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-[#5E2251] transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(product)}>
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-900">
                        {parseFloat(product.price).toFixed(2)}€
                      </span>
                      {product.originalprice && (
                        <span className="text-sm text-gray-500 line-through">
                          {parseFloat(product.originalprice).toFixed(2)}€
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {product.rating && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.round(parseFloat(product.rating)) ? "fill-[#5E2251] text-[#5E2251]" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.reviews || 0})</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">Aucun produit trouvé dans cette catégorie</p>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
      
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}

/**
 * Composant modal pour afficher les détails d'un produit
 */
function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <img
              src={product.image || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="w-full rounded-lg object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {parseFloat(product.price).toFixed(2)}€
            </p>
            {product.originalprice && (
              <p className="text-lg text-gray-500 line-through mb-4">
                {parseFloat(product.originalprice).toFixed(2)}€
              </p>
            )}

            <p className="text-gray-700 mb-4">{product.description}</p>

            {product.composition && (
              <div className="mb-4">
                <p className="font-semibold text-gray-900">Composition</p>
                <p className="text-gray-600">{product.composition}</p>
              </div>
            )}

            {product.careinstructions && (
              <div className="mb-4">
                <p className="font-semibold text-gray-900">Instructions de soin</p>
                <p className="text-gray-600">{product.careinstructions}</p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <label className="block font-semibold text-gray-900 mb-2">Quantité</label>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#5E2251] text-white py-3 rounded-lg font-semibold hover:bg-[#4a1a3f] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
