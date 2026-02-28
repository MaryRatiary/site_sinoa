import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProductCard({ image, hoverImage, name, price, reducedPrice, isEstimated, id, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const isOnSale = reducedPrice !== undefined && reducedPrice !== null;

  return (
    <div 
      className={`group ${className} flex flex-col w-full cursor-pointer bg-white rounded-2xl p-2 md:p-3 shadow-sm border border-gray-50 hover:shadow-md transition-all duration-300`} 
      onClick={() => id && navigate(`/product/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE CONTAINER : Ratio adaptatif pour s'adapter à tous les types d'images */}
      <div className="relative w-full aspect-auto overflow-hidden bg-[#F9F9F9] rounded-xl min-h-[180px]  min-w-[140px]">
        {isOnSale && (
          <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[9px] md:text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
            Soldes
          </div>
        )}

        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered && hoverImage ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
        />

        {hoverImage && (
          <img
            src={hoverImage}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
            }`}
          />
        )}
      </div>

      {/* TEXT CONTENT : min-h force l'alignement des prix même si le titre est court */}
      <div className="flex flex-col pt-3 px-1 min-h-[80px] md:min-h-[110px]">
        <h3 className="text-[13px] sm:text-sm md:text-base font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">
          {name}
        </h3>

        <div className="mt-auto flex items-baseline gap-2">
          {isOnSale ? (
            <>
              <span className="text-sm md:text-lg font-bold text-red-600">
                {isEstimated && <span className="text-[10px] font-normal italic text-gray-400">Dès </span>}
                {reducedPrice.toFixed(2)}€
              </span>
              <span className="text-[10px] md:text-sm text-gray-400 line-through">
                {price.toFixed(2)}€
              </span>
            </>
          ) : (
            <span className="text-sm md:text-lg font-bold text-gray-900">
              {isEstimated && <span className="text-[10px] font-normal italic text-gray-400">Dès </span>}
              {price.toFixed(2)}€
            </span>
          )}
        </div>
      </div>
    </div>
  );
}