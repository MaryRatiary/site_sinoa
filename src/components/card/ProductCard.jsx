import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProductCard({ image, hoverImage, name, price, originalPrice, isEstimated, id, slug, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const isOnSale = originalPrice !== undefined && originalPrice !== null;

  return (
    <div 
      className={`group ${className} flex flex-col w-full cursor-pointer bg-white rounded-2xl p-2 md:p-3 shadow-sm hover:shadow-md transition-all duration-300`} 
      onClick={() => {
        const target = slug || id;
        if (target) navigate(`/product/${target}`);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-[#F9F9F9] rounded-xl">
        {isOnSale && (
          <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[9px] md:text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
            Soldes
          </div>
        )}

        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ${
            hovered && hoverImage ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
        />

        {hoverImage && (
          <img
            src={hoverImage}
            alt={name}
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ${
              hovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
            }`}
          />
        )}
      </div>

      <div className="flex flex-col pt-3 px-1 min-h-[80px] md:min-h-[110px]">
        <h3 className="text-[13px] sm:text-sm md:text-base font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">
          {name}
        </h3>

        <div className="mt-auto flex items-baseline gap-2">
          {isOnSale ? (
            <>
              <span className="text-sm md:text-lg font-bold text-red-600">
                {isEstimated && <span className="text-[10px] font-normal italic text-gray-400">Dès </span>}
                {price ? price.toFixed(2) : "N/A"}€
              </span>
              <span className="text-[10px] md:text-sm text-gray-400 line-through">
                {originalPrice ? originalPrice.toFixed(2) : "N/A"}€
              </span>
            </>
          ) : (
            <span className="text-sm md:text-lg font-bold text-gray-900">
              {isEstimated && <span className="text-[10px] font-normal italic text-gray-400">Dès </span>}
              {price ? price.toFixed(2) : "N/A"}€
            </span>
          )}
        </div>
      </div>
    </div>
  );
}