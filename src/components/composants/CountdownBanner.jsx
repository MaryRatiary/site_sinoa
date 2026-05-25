import React, { useState, useEffect } from 'react';

const CountdownBanner = ({ endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(endDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60))),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const fontTitle = "'Archivo Black', sans-serif";
  const fontHunter = "'Cinzel', serif";

  return (
    <div className="w-full bg-white border-y border-gray-100 relative overflow-hidden flex items-center shadow-sm" style={{ height: '70px' }}>
      
      {/* Texture de fond discrète (Lignes de données) */}
      <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none bg-[linear-gradient(90deg,rgba(179,95,194,0.05)_1px,transparent_1px)] bg-[length:10px_100%] opacity-50"></div>

      <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between relative z-10">
        
        {/* SECTION GAUCHE : TITRE COMPACT */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-1 h-8 bg-[#b35fc2] rounded-full"></div>
          <div className="flex flex-col">
            <h2 className="text-xs md:text-sm font-black text-gray-900 uppercase leading-none tracking-tighter" style={{ fontFamily: fontTitle }}>
              Édition <span className="text-[#b35fc2]">Limitée</span>
            </h2>
            <span className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]" style={{ fontFamily: fontHunter }}>
              Offre en cours
            </span>
          </div>
        </div>

        {/* SECTION CENTRALE : COMPTEUR HORIZONTAL */}
        <div className="flex items-center gap-4 md:gap-10">
          {[
            { label: 'h', value: timeLeft.hours },
            { label: 'min', value: timeLeft.minutes },
            { label: 's', value: timeLeft.seconds }
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-baseline gap-1">
              <span className="text-xl md:text-3xl font-black text-gray-900 leading-none tabular-nums" style={{ fontFamily: fontTitle }}>
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] md:text-[11px] font-black text-[#b35fc2]" style={{ fontFamily: fontTitle }}>
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* SECTION DROITE : STATUS (Caché sur mobile très petit) */}
        <div className="hidden sm:flex items-center gap-2">
            <div className="text-right">
                <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">Statut</p>
                <p className="text-[9px] font-black text-gray-900 uppercase">Sécurisé</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#b35fc2] animate-pulse"></div>
        </div>

      </div>

      {/* Liseré de finition en bas */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#b35fc2]/20 to-transparent"></div>
    </div>
  );
};

export default CountdownBanner;