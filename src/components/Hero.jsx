export default function Hero() {
  return (
    <div className="relative w-full h-[95vh] md:h-[95vh] overflow-hidden bg-black">
      {/* IMAGE : Focus équipe à droite */}
      <img 
        src="/kpoporiginal.jpg" 
        alt="Kpop Demon Team" 
        className="absolute inset-0 object-cover h-full w-full object-[65%_center]"
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

      {/* --- TEXTES --- */}
      
      {/* HAUT GAUCHE : Badge */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-20">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/70 italic">Official Merch</span>
          <span className="text-4xl md:text-7xl font-black uppercase text-white tracking-tighter leading-none" style={{ color: '#b35fc2' }}>
            Huntrix
          </span>
        </div>
      </div>

      {/* CENTRE : Titre Fantôme (Agrandissement max) */}
      <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
        <h1 className="text-[10rem] md:text-[22rem] font-black uppercase opacity-5 select-none"
            style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
          DEMON
        </h1>
      </div>

      {/* BAS GAUCHE : Hunt Or Be Hunted (Remonté et Agrandi) */}
      <div className="absolute bottom-24 left-6 md:bottom-28 md:left-12 z-20">
        <h2 className="text-5xl sm:text-7xl md:text-[9rem] font-black text-white leading-[0.8] uppercase tracking-[ -0.05em]">
          HUNT <span style={{ color: '#8318b3' }}>OR</span> <br/> 
          BE <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white' }}>HUNTED</span>
        </h2>
        <div className="h-2 w-24 mt-4" style={{ backgroundColor: '#b35fc2' }}></div>
      </div>

      {/* BAS DROITE : Bouton Shop Now (Compact & Stylé) */}
      <div className="absolute bottom-10 right-6 md:bottom-12 md:right-12 z-20">
        <button className="group relative flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/20 pl-6 pr-2 py-2 rounded-full transition-all hover:pr-6 hover:border-[#b35fc2]">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">
            Shop Now
          </span>
          {/* Cercle fléché stylé */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45"
               style={{ backgroundColor: '#b35fc2' }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 11.5L11.5 3.5M11.5 3.5H5.5M11.5 3.5V9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-4 left-6 z-20 flex items-center gap-3">
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/40 rotate-90 origin-left">Scroll</span>
        <div className="w-12 h-[1px] bg-white/20"></div>
      </div>
    </div>
  );
}