import { useState } from "react";

/**
 * ProductCard
 *
 * Props:
 *  - image        {string}  default image src
 *  - hoverImage   {string}  image shown on hover
 *  - name         {string}  product name
 *  - price        {number}  original price
 *  - reducedPrice {number}  (optional) sale price — if provided, original is shown struck-through
 */
export function ProductCard({ image, hoverImage, name, price, reducedPrice, isEstimated, className = "" }) {
  const [hovered, setHovered] = useState(false);

  const isOnSale = reducedPrice !== undefined && reducedPrice !== null;

  return (
    <div className={`group ${className} flex flex-col gap-3 cursor-pointer`}>
      
      {/* Image container */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-xl"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Default image */}
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Hover image */}
        <img
          src={hoverImage}
          alt={`${name} alternate view`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-1 text-xl mt-5 font-light text-center">
        <p className=" font-medium text-gray-900">{name}</p>

        <div className="flex items-center gap-2 justify-center">
          {isOnSale ? (
            <>
              <span className="font-semibold text-red-500">
                {isEstimated ? "A partir de" : ""} ${reducedPrice.toFixed(2)} $
              </span>
              <span className="text-[#5E2251] line-through">
                ${price.toFixed(2)} $
              </span>
            </>
          ) : (
            <span className="text-[#5E2251] font-semibold text-gray-900">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}