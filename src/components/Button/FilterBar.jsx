import { useState } from "react";

const filters = [
  "Lightstick KPOP",
  "Box - Coffret KPOP",
  "Bijoux KPOP",
  "Photocards KPOP",
  "Sweat KPOP - Pull KPOP",
];

export function FilterBar({ onFilterChange }) {
  const [active, setActive] = useState("Lightstick KPOP");

  const handleClick = (filter) => {
    setActive(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex flex-wrap gap-2 px-4 justify-center">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleClick(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${
              active === filter
                ? "bg-gray-600/50 text-gray-900"
                : "bg-gray-600/10 text-gray-700 border-gray-300 hover:border-black hover:text-black"
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}