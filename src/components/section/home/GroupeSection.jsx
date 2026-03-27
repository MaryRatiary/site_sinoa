import { useRef, useEffect, useState } from 'react';
import groupes from "../../../data/groupes";
import { useNavigate } from "react-router-dom";

const GroupSection = () => {
  const scrollContainerRef = useRef(null);
  const headerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const navigate = useNavigate();
  // Intersection Observer pour déclencher l'animation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Déclenche l'animation une seule fois quand l'élément devient visible
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 } // Se déclenche quand 20% de l'élément est visible
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  // Fonction pour faire défiler le carrousel (clic sur boutons)
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8; // Défile de 80% de la largeur visible
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
        
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-slate-50 to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section avec Animation et Centrage */}
        <div 
          ref={headerRef}
          className={`mb-10 md:mb-14 text-center transform transition-all duration-700 ${
            isHeaderVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translateY-5'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Nos Groupes <span className="text-pink-600">KPOP</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg">
            Découvrez nos produits exclusifs pour vos groupes préférés
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="relative group/carousel">
          <div 
            ref={scrollContainerRef}
            className="flex flex-nowrap overflow-x-auto gap-5 sm:gap-6 pb-6 -mb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {groupes.map((group) => (
              <div 
              key={group.id} 
              onClick={() => navigate(`/staticcategory/groupes?product=${group.id}`)}
              className="flex-none w-[160px] sm:w-[200px] md:w-[220px] group flex flex-col gap-3 cursor-pointer transform transition-all duration-300 hover:scale-105 snap-start"
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden flex items-center justify-center rounded-2xl shadow-md border border-gray-100 bg-white">
                  {/* Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  
                  {/* Image */}
                  <div className="w-full h-full overflow-hidden">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  </div>
                </div>

                {/* Text Label - Centered */}
                <div className="flex flex-col gap-1 px-1 text-center">
                  <span className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 truncate px-1">
                    {group.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Indicators (Mobile Only) */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-10">
          <button 
            onClick={() => scroll('left')}
            className="p-3 rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Groupe précédent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Groupe suivant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default GroupSection;