import lightStick from "../../data/lightStick"
import { ProductCard } from "../card/ProductCard";

const LightStickCard = () => {
  return (
    <section className="w-full py-10 md:py-16">
      {/* Container de défilement / Grille */}
      <div className="flex flex-nowrap overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide">
        {lightStick.map((b) => (
          <div
            key={b.name}
            className="flex-shrink-0 w-[75vw] sm:w-[50vw] md:w-full snap-center group"
          >
            <div className="relative p-1 rounded-2xl transition-all duration-500 group-hover:bg-gradient-to-b from-[#b35fc2] to-[#001c66]">
              {/* Le contenu de la carte */}
              <div className="bg-white rounded-[calc(1rem-1px)] overflow-hidden">
                <ProductCard
                  className="w-full"
                  image={b.url}
                  hoverImage={b.urlHover}
                  name={b.name}
                  price={b.realPrice}
                  reducedPrice={b.reducedPrice}
                  isEstimated={b.isEstimated}
                />
              </div>
              
              {/* Petit badge "Édition Limitée" ou Glow discret au hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-bold text-white px-2 py-1 rounded-full shadow-lg" style={{ backgroundColor: '#8318b3' }}>
                  Premium
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de progression stylisée pour le mobile */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-4">
        <div className="h-1.5 w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #b35fc2, #001c66)' }}></div>
        <div className="h-1.5 w-1.5 rounded-full bg-gray-200"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-gray-200"></div>
      </div>
    </section>
  );
};

export default LightStickCard;