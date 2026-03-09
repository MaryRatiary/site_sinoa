import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import ProductDetailModal from "../ProductDetailModal";

function Stars({ rating }) {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      <span className="text-[10px] text-gray-400 ml-1">{rating}</span>
    </div>
  );
}

/**
 * ProductCard2
 *
 * Expects a product object with:
 *   id            {string|number}
 *   name          {string}
 *   price         {number}
 *   originalPrice {number|null}
 *   isEstimated   {boolean}
 *   image         {string}
 *   hoverImage    {string|null}
 *   rating        {number|null}
 *   isNew         {boolean}
 */
export function ProductCard2({ product, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    name,
    price,
    originalPrice,
    isEstimated,
    image,
    hoverImage,
    rating,
    isNew,
  } = product;

  // Convertir les prix en nombres
  const numPrice = parseFloat(price) || 0;
  const numOriginalPrice = parseFloat(originalPrice) || null;

  const isOnSale =
    numOriginalPrice !== null && numOriginalPrice !== undefined;

  // ✅ Vérifie si hoverImage existe vraiment
  const hasHoverImage =
    hoverImage && hoverImage.trim() !== "";

  const handleAdd = (e) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleClick = () => {
    if (id) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className={`group flex flex-col gap-3 cursor-pointer ${className}`} onClick={handleClick}>
        
        {/* Image container */}
        <div
          className="relative w-full h-70 aspect-[3/4] overflow-hidden bg-gray-50 rounded-2xl"
          onMouseEnter={() => hasHoverImage && setHovered(true)}
          onMouseLeave={() => hasHoverImage && setHovered(false)}
        >
          {/* Image principale */}
          <img
            src={image}
            alt={name}
            className={`absolute p-4 inset-0 w-full h-auto object-cover transition-all duration-700 ${
              hasHoverImage && hovered
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100"
            }`}
          />

          {/* Image hover seulement si existante */}
          {hasHoverImage && (
            <img
              src={hoverImage}
              alt={`${name} vue alternative`}
              className={`absolute p-4 inset-0 w-full h-full object-cover transition-all duration-700 ${
                hovered
                  ? "opacity-100 scale-105"
                  : "opacity-0 scale-100"
              }`}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 px-1">
          <Stars rating={rating} />

          <p className="font-medium text-gray-800 text-sm leading-snug line-clamp-2">
            {name}
          </p>

          <div className="flex items-center gap-2">
            {isOnSale ? (
              <>
                <span className="font-bold text-red-500 text-sm">
                  {isEstimated && (
                    <span className="font-normal text-xs">
                      À partir de{" "}
                    </span>
                  )}
                  {numPrice.toFixed(2).replace(".", ",")}€
                </span>

                <span className="text-gray-400 line-through text-xs">
                  {numOriginalPrice.toFixed(2).replace(".", ",")}€
                </span>
              </>
            ) : (
              <span className="font-bold text-[#5E2251] text-sm">
                {isEstimated && (
                  <span className="font-normal text-xs">
                    À partir de{" "}
                  </span>
                )}
                {numPrice.toFixed(2).replace(".", ",")}€
              </span>
            )}
          </div>
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