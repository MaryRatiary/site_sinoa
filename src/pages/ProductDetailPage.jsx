import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import ReviewsSection from "../components/ReviewsSection";
import Navbar from "../components/Header";
import RespNav from "../components/resp/RespNav";
import Footer from '../components/Footer';
import lightStickData from '../data/lightStick';
import huntrixData from '../data/huntrixProducts';
import bestSellersData from '../data/bestSellers';
import groupesData from '../data/groupes';
import '../assets/animatedButton.css';

// Fonction pour rechercher un produit dans toutes les données statiques
function findProductById(productId) {
  const allProducts = [
    ...lightStickData,
    ...huntrixData,
    ...bestSellersData,
    ...groupesData
  ];
  
  return allProducts.find(p => p.id === productId);
}

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const foundProduct = findProductById(productId);
    if (foundProduct) {
      setProduct(foundProduct);
      // Pré-sélectionner la première couleur
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
      // Pré-sélectionner la première taille
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Produit introuvable</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#5E2251] text-white rounded-lg hover:bg-[#4a1a3e] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name || product.title,
      price: product.price || product.realPrice || 0,
      quantity: quantity,
      image: product.url || product.image,
      color: selectedColor,
      size: selectedSize
    };
    addToCart(cartItem);
  };

  const price = product.price || product.realPrice || 0;
  const originalPrice = product.originalPrice || product.reducedPrice || null;
  const hasDiscount = originalPrice && price < originalPrice;

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="lg:hidden">
        <RespNav />
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#5E2251] hover:text-[#4a1a3e] transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Retour
        </button>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={product.url || product.image}
                alt={product.name || product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-6">
            {/* Title and Badge */}
            <div>
              {hasDiscount && (
                <div className="inline-block mb-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  SOLDES
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                {product.name || product.title}
              </h1>
              <p className="text-gray-600">{product.brand}</p>
            </div>

            {/* Rating */}
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
              <span className="text-sm text-gray-600">({product.reviewCount || 0} avis)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {price.toFixed(2)}€
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {originalPrice.toFixed(2)}€
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Couleur
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedColor?.colorName === color.colorName
                          ? 'bg-[#5E2251] text-white shadow-lg'
                          : 'border border-gray-300 text-gray-700 hover:border-[#5E2251]'
                      }`}
                    >
                      {color.colorName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Taille
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedSize?.size === size.size
                          ? 'bg-[#5E2251] text-white shadow-lg'
                          : 'border border-gray-300 text-gray-700 hover:border-[#5E2251]'
                      }`}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantité
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
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

            {/* Stock Info */}
            <div className="text-sm">
              {product.inStock ? (
                <p className="text-green-600 font-medium">✓ En stock ({product.stock} disponible)</p>
              ) : (
                <p className="text-red-600 font-medium">Indisponible</p>
              )}
            </div>

            {/* Add to Cart Button */}
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

            {/* Product Details */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Détails du produit</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold text-gray-900">Marque:</span> {product.brand}</p>
                <p><span className="font-semibold text-gray-900">Matériau:</span> {product.material}</p>
                <p><span className="font-semibold text-gray-900">Catégorie:</span> {product.category}</p>
                {product.careInstructions && (
                  <p><span className="font-semibold text-gray-900">Entretien:</span> {product.careInstructions}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 py-0">
        <ReviewsSection />
      </div>

      <Footer />
      
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}
