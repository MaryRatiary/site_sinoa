import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GAP = 8; 

export default function SmoothSlider({ cards = [], className = "", productType = null }) {
  const [offset, setOffset] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const navigate = useNavigate();

  // Gestion du nombre de cartes selon la largeur de l'écran
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) setVisibleCards(2.4);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
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
    if (productType) {
      // Redirection vers la page statique
      navigate(`/static/${productType}?product=${card.id}`);
    } else if (card.id) {
      // Redirection vers la page produit standard
      navigate(`/product/${card.id}`);
    }
  };

  const cardWidth = `calc((100% - ${(Math.ceil(visibleCards) - 1) * GAP}px) / ${visibleCards})`;
  const translateX = `calc(${offset} * -1 * (${cardWidth} + ${GAP}px))`;

  return (
    <div className={`relative w-full group/slider ${className}`}>
      <style>{`
        .slider-card { flex: 0 0 ${cardWidth}; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Navigation - Plus visible sur mobile, élégante sur desktop */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-2 -right-2 flex justify-between z-20 pointer-events-none">
        <button
          onClick={() => go(offset - 1)}
          disabled={offset === 0}
          className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center pointer-events-auto transition-all disabled:opacity-0 hover:bg-white active:scale-90"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={() => go(offset + 1)}
          disabled={offset >= maxOffset}
          className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center pointer-events-auto transition-all disabled:opacity-0 hover:bg-white active:scale-90"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Viewport */}
      <div className="overflow-hidden px-1 py-2">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ gap: GAP, transform: `translateX(${translateX})` }}
        >
          {cards.map((card, idx) => (
            <div
              key={card.id ?? idx}
              className="slider-card group relative aspect-[4/4] rounded-2xl overflow-hidden shadow-sm border border-white/20 bg-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleCardClick(card)}
            >
              <img 
                src={card.url} 
                alt={card.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-bold leading-tight uppercase tracking-wide">
                  {card.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateur (Dots) - Plus fin */}
      <div className="flex justify-center gap-1.5 mt-2">
        {Array.from({ length: maxOffset + 1 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              Math.round(offset) === i ? "w-6 bg-primary-500" : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
