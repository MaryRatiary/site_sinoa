import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GAP = 8;
const ACCENT_COLOR = "#b35fc2";

export default function SmoothSlider({ cards = [], className = "", productType = null }) {
  const [offset, setOffset] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) setVisibleCards(2.4);
      else if (window.innerWidth < 1024) setVisibleCards(2.8);
      else setVisibleCards(3.5);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const maxOffset = Math.max(0, cards.length - Math.floor(visibleCards));

  const go = (next) => {
    if (next < 0 || next > maxOffset) return;
    setOffset(next);
  };

  const handleCardClick = (card) => {
    const target = card.slug || card.id;
    if (target) navigate(`/product/${target}`);
  };

  const cardWidth = `calc((100% - ${(Math.ceil(visibleCards) - 1) * GAP}px) / ${visibleCards})`;
  const translateX = `calc(${offset} * -1 * (${cardWidth} + ${GAP}px))`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Lexend:wght@300;400;500;600;700&display=swap');

        .slider-card { 
          flex: 0 0 ${cardWidth}; 
        }
        
        .scrollbar-hide::-webkit-scrollbar { 
          display: none; 
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .card-image {
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .slider-card:hover .card-image {
          transform: scale(1.06);
        }

        .card-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.65), transparent 65%);
          transition: background 0.35s ease;
        }

        .slider-card:hover .card-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%);
        }

        .card-content {
          transform: translateY(6px);
          transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
          opacity: 0.98;
        }

        .slider-card:hover .card-content {
          transform: translateY(0);
        }

        .nav-button {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          transition: all 0.25s ease;
        }

        .nav-button:hover:not(:disabled) {
          background: ${ACCENT_COLOR};
          border-color: ${ACCENT_COLOR};
          color: #ffffff;
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(179, 95, 194, 0.3);
        }

        .nav-button:active:not(:disabled) {
          transform: scale(0.96);
        }

        .nav-button:disabled {
          opacity: 0;
          pointer-events: none;
        }

        .dot-indicator {
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
        }

        .dot-active {
          background: ${ACCENT_COLOR};
          width: 20px;
          box-shadow: 0 0 8px rgba(179, 95, 194, 0.6);
        }

        .dot-inactive {
          background: #d9d9d9;
          width: 6px;
        }

        .dot-inactive:hover {
          background: ${ACCENT_COLOR};
          box-shadow: 0 0 6px rgba(179, 95, 194, 0.4);
        }

        .slider-card {
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
          position: relative;
        }

        .slider-card:hover {
          border-color: ${ACCENT_COLOR};
          box-shadow: 0 8px 20px rgba(179, 95, 194, 0.15);
        }
      `}</style>

      <div className={`relative w-full group/slider ${className}`}>
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-3 -right-3 md:-left-5 md:-right-5 flex justify-between z-40 pointer-events-none">
          <button
            onClick={() => go(offset - 1)}
            disabled={offset === 0}
            aria-label="Previous cards"
            className="nav-button w-9 h-9 rounded-full flex items-center justify-center pointer-events-auto"
          >
            <svg 
              className="w-4 h-4 text-current" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>

          <button
            onClick={() => go(offset + 1)}
            disabled={offset >= maxOffset}
            aria-label="Next cards"
            className="nav-button w-9 h-9 rounded-full flex items-center justify-center pointer-events-auto"
          >
            <svg 
              className="w-4 h-4 text-current" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>

        {/* Viewport Container */}
        <div className="overflow-hidden px-0.5 py-2">
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ gap: GAP, transform: `translateX(${translateX})` }}
          >
            {cards.map((card, idx) => (
              <div
                key={card.id ?? idx}
                className="slider-card relative aspect-square rounded-sm overflow-hidden cursor-pointer group transition-all duration-300"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(card)}
                style={{
                  boxShadow: hoveredCard === idx 
                    ? '0 8px 20px rgba(179, 95, 194, 0.15)' 
                    : '0 1px 3px rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Image */}
                <img 
                  src={card.url} 
                  alt={card.title} 
                  className="card-image absolute inset-0 w-full h-full object-cover bg-gray-50"
                />

                {/* Overlay Gradient */}
                <div className="card-overlay absolute inset-0" />

                {/* Content - Bottom */}
                <div className="card-content absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1.5">
                  {/* Title */}
                  <p 
                    className="text-white text-xs line-clamp-2 font-semibold"
                    style={{ fontFamily: "'Lexend', sans-serif", letterSpacing: '-0.005em' }}
                  >
                    {card.title}
                  </p>

                  {/* Price */}
                  {card.price && (
                    <div className="flex items-baseline gap-1">
                      <span 
                        className="text-white text-sm font-black"
                        style={{ fontFamily: "'Space Mono', monospace", color: '#ffffff' }}
                      >
                        ${card.price.toFixed(0)}
                      </span>
                      {card.originalPrice && card.originalPrice > card.price && (
                        <span className="text-white/40 text-xs line-through">
                          ${card.originalPrice.toFixed(0)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to group ${i + 1}`}
              className={`dot-indicator h-1.5 rounded-full ${
                Math.round(offset) === i ? "dot-active" : "dot-inactive"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}