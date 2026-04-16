import React, { useState, useEffect } from 'react';

const AnimatedBanner = ({ 
  text = "HUNTRIX SPECIAL OPS: UP TO 50% EXTRACTION DISCOUNT • FREE GLOBAL SHIPPING ON ALL ORDERS • NEW K-FASHION GEAR AVAILABLE • EXCLUSIVE K-BEAUTY HUNTER CARE • LIMITED STOCK FIGURES • JOIN THE VIP SLAYER PROGRAM •" 
}) => {
  const [offset, setOffset] = useState(0);

  // Palette Huntrix
  const colors = {
    primary: "#b35fc2", // Violet Huntrix
    dark: "#0a0a0a",    // Noir Profond
    accent: "#8318b3"   // Violet Foncé
  };

  useEffect(() => {
    let animationFrameId;
    let currentOffset = 0;

    const animate = () => {
      // Ajuste la vitesse ici (0.8 est plus fluide pour du texte tactique)
      currentOffset = (currentOffset + 0.8) % (text.length * 10);
      setOffset(currentOffset);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [text]);

  return (
    <div className="w-full overflow-hidden shadow-2xl relative border-y border-white/5" 
         style={{ backgroundColor: colors.dark }}>
      
      {/* Lignes de scan horizontales (Effet Cyber) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(179,95,194,0.05)_50%,transparent_50%)] bg-[length:100%_2px] z-10"></div>

      {/* Barre de bordure supérieure animée */}
      <div className="absolute top-0 left-0 right-0 h-[1px] opacity-50" 
           style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` }}></div>
      
      {/* Texte défilant */}
      <div className="relative h-7 sm:h-9 flex items-center whitespace-nowrap px-4 overflow-hidden">
        <div
          className="text-white flex items-center gap-4"
          style={{
            transform: `translateX(${-offset}px)`,
            fontFamily: "'Cinzel', serif",
            fontSize: '10px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            textShadow: `0 0 10px ${colors.primary}66`, // Glow violet subtil
          }}
        >
          {/* On répète le texte pour le défilement infini */}
          <span className="flex items-center">
            {text.split('•').map((segment, i) => (
              <React.Fragment key={i}>
                <span className="mx-4">{segment}</span>
                {i !== text.split('•').length - 1 && (
                  <span style={{ color: colors.primary }}>•</span>
                )}
              </React.Fragment>
            ))}
          </span>
          <span className="flex items-center">
            {text.split('•').map((segment, i) => (
              <React.Fragment key={`copy-${i}`}>
                <span className="mx-4">{segment}</span>
                {i !== text.split('•').length - 1 && (
                  <span style={{ color: colors.primary }}>•</span>
                )}
              </React.Fragment>
            ))}
          </span>
        </div>
      </div>

      {/* Barre de bordure inférieure */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-30" 
           style={{ backgroundColor: colors.primary }}></div>
    </div>
  );
};

export default AnimatedBanner;