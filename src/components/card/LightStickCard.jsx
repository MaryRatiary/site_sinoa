import lightStick from "../../data/lightStick"
import { ProductCard } from "../card/ProductCard";

const LightStickCard = () => {
  return (
    <section className="w-full py-6 md:py-10 px-4">
      {/* Container de défilement / Grille */}
      <div className="flex flex-nowrap overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 pb-6 md:pb-0 snap-x snap-mandatory scrollbar-hide">
        {lightStick.map((b) => (
          <div
            key={b.name}
            className="flex-shrink-0 w-[55vw] sm:w-[35vw] md:w-full snap-center group"
          >
          {/* Conteneur avec dégradé au survol */}
          <div className="relative p-0.5 md:p-1 rounded-xl md:rounded-2xl transition-all duration-500 group-hover:bg-gradient-to-b from-[#b35fc2] to-[#001c66]">
            
            {/* Le contenu de la carte avec hauteur contrôlée */}
            <div className="bg-white rounded-[calc(0.75rem-2px)] md:rounded-[calc(1rem-1px)] overflow-hidden">
              <div className="max-h-[200px] md:max-h-[280px] overflow-hidden aspect-[4/5]"> 
                <ProductCard
                  className="w-full h-full object-cover"
                  image={b.url}
                  hoverImage={b.urlHover}
                  name={b.name}
                  price={b.realPrice}
                  reducedPrice={b.reducedPrice}
                  isEstimated={b.isEstimated}
                />
              </div>
            </div>

                        
              {/* Petit badge "Édition Limitée" ou Glow discret au hover */}
              <div className="absolute top-2 md:top-3 right-2 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[8px] md:text-[10px] font-bold text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded-full shadow-lg" style={{ backgroundColor: '#8318b3' }}>
                  Premium
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de progression stylisée pour le mobile */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-3">
        <div className="h-1 w-10 rounded-full" style={{ background: 'linear-gradient(90deg, #b35fc2, #001c66)' }}></div>
        <div className="h-1 w-1 rounded-full bg-gray-200"></div>
        <div className="h-1 w-1 rounded-full bg-gray-200"></div>
      </div>
    </section>
  );
};

export default LightStickCard;