import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProductCard({ image, hoverImage, name, price, reducedPrice, isEstimated, id, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const isOnSale = reducedPrice !== undefined && reducedPrice !== null;

  const handleClick = () => {
    if (id) navigate(`/product/${id}`);
  };

  return (
    <div 
      className={`group ${className} flex flex-col gap-2 cursor-pointer transition-all duration-300`} 
      onClick={handleClick}
    >
      
      {/* Image container */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden bg-[#F9F9F9] rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-500"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Badge Promotion */}
        {isOnSale && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Soldes
          </div>
        )}

        {/* Default image */}
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            hovered ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
        />

        {/* Hover image */}
        <img
          src={hoverImage}
          alt={`${name} alternate view`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            hovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
          }`}
        />
      </div>

      {/* Info Section - Alignée à gauche pour un look plus moderne sur mobile/desktop */}
      <div className="flex flex-col pt-2 px-1">
        {/* Nom du produit */}
        <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-1 group-hover:text-black transition-colors">
          {name}
        </h3>

        {/* Section Prix */}
        <div className="flex flex-wrap items-baseline gap-2 mt-1">
          {isOnSale ? (
            <>
              <span className="text-base md:text-lg font-bold text-red-600">
                {isEstimated && <span className="text-[10px] font-normal mr-1 italic">Dès</span>}
                {reducedPrice.toFixed(2)}€
              </span>
              <span className="text-xs md:text-sm text-gray-400 line-through decoration-gray-400">
                {price.toFixed(2)}€
              </span>
            </>
          ) : (
            <span className="text-base md:text-lg font-bold text-gray-900">
              {isEstimated && <span className="text-[10px] font-normal mr-1 italic">Dès</span>}
              {price.toFixed(2)}€
            </span>
          )}
        </div>
      </div>
    </div>
  );
}