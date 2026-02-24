import React, { useState, useEffect } from 'react';

const AnimatedBanner = ({ 
  text = "✨ PROMOTION SPÉCIALE - JUSQU'À 50% DE RÉDUCTION ✨                    ⭐ LIVRAISON GRATUITE SUR TOUTES LES COMMANDES ⭐                    🎁 NOUVELLE COLLECTION K-FASHION DISPONIBLE 🎁                    💫 EXCLUSIVITÉS K-BEAUTY 💫                    🌟 FIGURINES LIMITÉES EN STOCK 🌟                    🛍️ CLIENT VIP - AVANTAGES EXCLUSIFS 🛍️" 
}) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let currentOffset = 0;

    const animate = () => {
      currentOffset = (currentOffset + 1) % (text.length * 8);
      setOffset(currentOffset);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [text]);

  return (
    <div className="w-full overflow-hidden shadow-lg relative" style={{background: 'linear-gradient(90deg, #001c66 0%, #1ccfe7 50%, #001c66 100%)'}}>
      {/* Bandes décoratives */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
      
      {/* Texte défilant */}
      <div className="relative h-6 sm:h-7 flex items-center whitespace-nowrap px-4">
        <div
          className="text-white text-[10px] sm:text-xs font-bold tracking-wider drop-shadow-lg"
          style={{
            transform: `translateX(${-offset}px)`,
            transition: 'transform 0.05s linear',
            letterSpacing: '0.15em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(28, 207, 231, 0.4)',
            wordSpacing: '15px',
          }}
        >
          {text}                    {text}
        </div>
      </div>
    </div>
  );
};

export default AnimatedBanner;
