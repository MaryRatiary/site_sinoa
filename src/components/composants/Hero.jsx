import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[40vh] md:h-[80vh] overflow-hidden bg-black">
      {/* IMAGE */}
      <img 
        src="/kpoporiginal.jpg" 
        alt="Kpop Demon Team" 
        className="absolute inset-0 object-cover h-full w-full object-[65%_center] animate-slow-zoom"
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

      {/* HAUT GAUCHE */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-20 animate-slide-right">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/70 italic">Official Merch</span>
          <span className="text-4xl md:text-7xl font-black uppercase text-white tracking-tighter leading-none" style={{ color: '#b35fc2' }}>
            Huntrix
          </span>
        </div>
      </div>

      {/* CENTRE */}
      {/* <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
        <h1 className="text-[10rem] md:text-[22rem] font-black uppercase opacity-5 select-none animate-fade-in"
            style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
          DEMON
        </h1>
      </div> */}

      {/* BAS GAUCHE */}
      <div className="absolute bottom-24 left-6 md:bottom-28 md:left-12 z-20 animate-slide-right delay-200">
        <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-[9rem] font-black text-white leading-[0.8] uppercase tracking-[-0.05em]">
          HUNT <span style={{ color: '#8318b3' }}>OR</span> <br/> 
          BE <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white' }}>HUNTED</span>
        </h2>
        <div className="h-2 w-24 mt-4 animate-grow-width" style={{ backgroundColor: '#b35fc2' }}></div>
      </div>

      {/* BAS DROITE — Shop Now */}
      <div className="absolute bottom-10 right-6 md:bottom-12 md:right-12 z-20 animate-slide-left">
        <button
          onClick={() => navigate('/shop')}
          className="group relative flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/20 pl-6 pr-2 py-2 rounded-full transition-all hover:pr-6 hover:border-[#b35fc2] hover:bg-white/10"
        >
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">
            Shop Now
          </span>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45"
               style={{ backgroundColor: '#b35fc2' }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 11.5L11.5 3.5M11.5 3.5H5.5M11.5 3.5V9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>


      <style jsx>{`
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.05; }
        }
        @keyframes growWidth {
          from { width: 0; }
          to { width: 6rem; }
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slide-right { animation: slideRight 0.8s ease-out forwards; }
        .animate-slide-left { animation: slideLeft 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 1.5s ease-out forwards; }
        .animate-grow-width { animation: growWidth 1s ease-out forwards; }
        .animate-slow-zoom { animation: slowZoom 10s linear infinite alternate; }
        .animate-bounce-subtle { animation: bounce 2s infinite; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}