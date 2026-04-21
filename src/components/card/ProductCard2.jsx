import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import ProductDetailModal from "../composants/ProductDetailModal";

function Stars({ rating }) {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={`transition-all duration-200 ${
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1.5 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

/**
 * ProductCard2 - Premium Responsive Product Card
 *
 * Expects a product object with:
 *   id            {string|number}
 *   name          {string}
 *   price         {number}        ← Prix RÉDUIT (affiché en couleur)
 *   original_price {number|null}   ← Prix ORIGINAL (affiché barré si solde)
 *   isEstimated   {boolean}
 *   image         {string}
 *   hover_image    {string|null}
 *   rating        {number|null}
 *   isNew         {boolean}
 *   slug          {string|optional}
 */
export function ProductCard2({ product, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    slug,
    name,
    price,
    original_price,
    isEstimated,
    image,
    hover_image,
    rating,
    isNew,
  } = product;

  // ✅ CORRIGÉ: Convertir les prix en nombres
  const numPrice = parseFloat(price) || 0;
  const numOriginalPrice = parseFloat(original_price) || null;

  // ✅ CORRIGÉ: original_price > price = c'est une solde
  const isOnSale = numOriginalPrice !== null && numOriginalPrice > numPrice;
  const hasHoverImage = hover_image && hover_image.trim() !== "";
  const discountPercent = isOnSale 
    ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    setWished(!wished);
  };

  const handleClick = () => {
    if (id) {
      setShowModal(true);
    }
  };

  return (
    <>
      <style>{`
        @keyframes cardHoverFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .product-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover {
          animation: cardHoverFloat 0.5s ease-in-out;
        }

        .image-container {
          aspect-ratio: 1;
          overflow: hidden;
        }

        .badge-new {
          animation: badgePulse 2s ease-in-out infinite;
        }

        /* Mobile: 1 col, Tablet: 2 cols, Desktop: 3-4 cols */
        @media (min-width: 640px) {
          .product-grid {
            gap: 1rem;
          }
        }
        @media (min-width: 768px) {
          .product-grid {
            gap: 1.25rem;
          }
        }
        @media (min-width: 1024px) {
          .product-grid {
            gap: 1.5rem;
          }
        }
      `}</style>

      <div
        className={`product-card group flex flex-col gap-3 cursor-pointer h-full transition-all duration-300 hover:shadow-xl ${className}`}
        onClick={handleClick}
      >
        
        {/* ============ IMAGE CONTAINER ============ */}
        <div
          className="image-container relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl overflow-hidden"
          onMouseEnter={() => hasHoverImage && setHovered(true)}
          onMouseLeave={() => hasHoverImage && setHovered(false)}
        >
          {/* Image principale */}
          <img
            src={image}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              hasHoverImage && hovered
                ? "opacity-0 scale-110"
                : "opacity-100 scale-100"
            }`}
          />

          {/* Image hover */}
          {hasHoverImage && (
            <img
              src={hover_image}
              alt={`${name} vue alternative`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                hovered
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-110"
              }`}
            />
          )}

          {/* Overlay gradient on hover */}
          <div
            className="absolute inset-0 bg-black transition-opacity duration-300"
            style={{ opacity: hovered ? 0.05 : 0 }}
          />

          {/* Badge NEW */}
          {isNew && (
            <div className="badge-new absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide shadow-lg">
              ✨ Nouveau
            </div>
          )}

          {/* Badge SOLDE */}
          {isOnSale && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg">
              -{discountPercent}%
            </div>
          )}


        </div>

        {/* ============ INFO SECTION ============ */}
        <div className="flex flex-col gap-2 px-0.5">
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <Stars rating={rating} />
            </div>
          )}

          {/* Product Name */}
          <p className="font-semibold text-gray-800 text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-[#5E2251] transition-colors duration-200">
            {name}
          </p>

          {/* Price Section */}
          <div className="flex items-center gap-2.5 pt-1 flex-wrap">
            {/* ✅ PRIX RÉDUIT - Toujours affiché en gras et en couleur */}
            <span className={`font-bold text-base sm:text-lg transition-colors ${
              isOnSale ? "text-red-500" : "text-[#5E2251]"
            }`}>
              {isEstimated && (
                <span className="text-xs sm:text-sm font-normal text-gray-600">
                  À partir de{" "}
                </span>
              )}
              {numPrice.toFixed(2).replace(".", ",")}€
            </span>

            {/* ✅ PRIX ORIGINAL BARRÉ - Uniquement si solde */}
            {isOnSale && (
              <span className="text-gray-400 line-through text-xs sm:text-sm font-medium">
                {numOriginalPrice.toFixed(2).replace(".", ",")}€
              </span>
            )}
          </div>

          {/* Estimated indicator */}
          {isEstimated && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-0.5">
              <Zap size={12} className="text-amber-500" />
              <span>Prix estimé</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ProductDetailModal 
          product={product} 
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

/**
 * ProductGrid - Container pour afficher les ProductCard2 en grid responsive
 * Utilise les "magic numbers" pour une adaptation fluide
 */
export function ProductGrid({ products, className = "" }) {
  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {products.map((product) => (
            <ProductCard2 key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard2;