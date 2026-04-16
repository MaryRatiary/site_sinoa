import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductDescriptionRenderer } from '../components/ProductDescriptionRenderer';
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from '../components/composants/Footer';
import fashionData from '../data/k-fashion';
import beautyData from '../data/k-beauty';
import '../assets/animatedButton.css';

function getProductsByType(type) {
  switch(type) {
    case 'fashion':
      return fashionData;
    case 'beauty':
      return beautyData;
    default:
      return [];
  }
}

function getCategoryInfo(type) {
  const info = {
    fashion: {
      name: 'K-Fashion',
      description: 'Découvrez notre collection de vêtements et accessoires inspirés de la mode coréenne.',
      image: '/fashion/k-fashion.png'
    },
    beauty: {
      name: 'Korean Beauty',
      description: 'Explorez les meilleurs produits de skincare et beauté de Corée du Sud.',
      image: '/k_beauty_kpop_girl.webp'
    }
  };
  return info[type] || { name: 'Produits', description: '', image: '' };
}

export default function StaticProductDetailPage() {
  const { productType, productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const allProducts = getProductsByType(productType);
        const foundProduct = allProducts.find(p => p.id === productId || p.id === parseInt(productId));

        if (foundProduct) {
          const normalizedProduct = {
            ...foundProduct,
            price: parseFloat(foundProduct.price || 0),
            originalPrice: foundProduct.originalPrice ? parseFloat(foundProduct.originalPrice) : null,
            
            images: foundProduct.images && Array.isArray(foundProduct.images) && foundProduct.images.filter(Boolean) ? 
                    foundProduct.images : 
                    foundProduct.url ? [foundProduct.url, foundProduct.urlHover].filter(Boolean) : 
                    foundProduct.image ? [foundProduct.image] : [],
            
            url: foundProduct.url || foundProduct.image || '',
            stock: foundProduct.stock || 0,
            inStock: foundProduct.inStock !== false && (foundProduct.stock || 0) > 0,
            
            brand: foundProduct.brand || '',
            material: foundProduct.material || '',
            careInstructions: foundProduct.careInstructions || '',
            category: foundProduct.category || foundProduct.categoryName || '',
            
            rating: foundProduct.rating || 0,
            reviewCount: foundProduct.reviewCount || 0,
            
            title: foundProduct.title || foundProduct.name || 'Produit',
            description: foundProduct.description || ''
          };

          setProduct(normalizedProduct);
        } else {
          setError("Produit introuvable");
        }
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productType, productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement du produit...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">{error || "Produit introuvable"}</p>
          <button
            onClick={() => navigate(`/static/${productType}`)}
            className="px-6 py-2 bg-[#5E2251] text-white rounded-lg hover:bg-[#4a1a3e] transition-colors"
          >
            Retour à la catégorie
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.title,
      price: product.price || 0,
      quantity: quantity,
      image: product.url,
    };
    addToCart(cartItem);
    alert('Produit ajouté au panier!');
  };

  const price = product.price || 0;
  const originalPrice = product.originalPrice;
  const hasDiscount = originalPrice && price < originalPrice;

  const images = product.images && product.images.length > 0 ? product.images : [product.url].filter(Boolean);
  const currentImage = images.length > 0 ? images[currentImageIndex] : null;

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const categoryInfo = getCategoryInfo(productType);

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="lg:hidden">
        <RespNav />
      </div>

      {/* Discount Banner - RESPONSIVE */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4">
          <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 text-center">
            <div>
              <p className="text-xs sm:text-base md:text-lg font-bold text-gray-900">-10%</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">dès 2 articles</p>
            </div>
            <div>
              <p className="text-xs sm:text-base md:text-lg font-bold text-gray-900">-15%</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">dès 3 articles</p>
            </div>
            <div>
              <p className="text-xs sm:text-base md:text-lg font-bold text-gray-900">-20%</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">dès 4 articles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Title Section - RESPONSIVE */}
      <div className="w-full bg-white py-3 sm:py-4 md:py-6 px-3 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-2 sm:gap-3">
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight animate-slide-up">
              {categoryInfo.name}
            </h1>
            {categoryInfo.description && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{categoryInfo.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1 sm:py-2">
        <nav className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-gray-600">
          <a href="/" className="text-[#5E2251] hover:underline">KPOP</a>
          <span>›</span>
          <a href={`/static/${productType}`} className="text-[#5E2251] hover:underline">{categoryInfo.name}</a>
          <span>›</span>
          <span className="truncate">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(`/static/${productType}`)}
          className="flex items-center gap-2 text-[#5E2251] hover:text-[#4a1a3e] transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Retour à la catégorie
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="flex flex-col gap-4 md:sticky md:top-8 md:h-fit">
            {currentImage ? (
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center group">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500?text=Image+non+disponible';
                  }}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={24} className="text-gray-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={24} className="text-gray-900" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500">Pas d'image disponible</p>
              </div>
            )}

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      currentImageIndex === idx ? 'border-[#5E2251]' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Vue ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-6">
            <div>
              {hasDiscount && (
                <div className="inline-block mb-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  SOLDES
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                {product.title}
              </h1>
              {product.brand && (
                <p className="text-gray-600">{product.brand}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviewCount} avis)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {price.toFixed(2)}€
              </span>
              {hasDiscount && originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {originalPrice.toFixed(2)}€
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantité
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-sm">
              {product.inStock ? (
                <p className="text-green-600 font-medium">✓ En stock ({product.stock} disponible)</p>
              ) : (
                <p className="text-red-600 font-medium">Indisponible</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-[#5E2251] text-white py-3 rounded-lg font-bold hover:bg-[#4a1a3e] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Ajouter au panier
              </button>
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                  isFavorited
                    ? 'bg-red-50 border-red-600 text-red-600'
                    : 'border-gray-300 text-gray-600 hover:border-red-600'
                }`}
              >
                <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Détails du produit</h3>
              <div className="space-y-3 text-sm">
                {product.category && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Catégorie:</span>
                    <span className="text-gray-600">{product.category}</span>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Marque:</span>
                    <span className="text-gray-600">{product.brand}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Matériau:</span>
                    <span className="text-gray-600">{product.material}</span>
                  </div>
                )}
                {product.careInstructions && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Entretien:</span>
                    <span className="text-gray-600">{product.careInstructions}</span>
                  </div>
                )}
              </div>
            </div>

            {product.description && (
              <div className="border-t pt-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-4">Description du produit</h3>
                <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                  <ProductDescriptionRenderer description={product.description} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}
