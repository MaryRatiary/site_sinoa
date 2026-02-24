import groupes from "../../../data/groupes";

const GroupSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Nos Groupes KPOP
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Découvrez nos produits exclusifs pour vos groupes préférés</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {groupes.map((group) => (
            <div 
              key={group.url} 
              className="group flex flex-col gap-2.5 cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center p-4 sm:p-6">
                {/* Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                {/* Image */}
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={group.url}
                    alt={group.name}
                    className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text Label */}
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-sm md:text-base font-bold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                  {group.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GroupSection;