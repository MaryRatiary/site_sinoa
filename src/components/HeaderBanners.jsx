import React from 'react';
import AnimatedBanner from './AnimatedBanner';
import CountdownBanner from './CountdownBanner';

const HeaderBanners = () => {
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="w-full">
      {/* Banderole avec compte à rebours très fin */}
      <CountdownBanner endDate={endDate} />
      
      {/* Banderole animée très fine avec défilement */}
      <AnimatedBanner 
        text="🎉 PROMOTION SPÉCIALE - JUSQU'À 50% DE RÉDUCTION 🎉 LIVRAISON GRATUITE SUR TOUTES LES COMMANDES 🚚"
      />
    </div>
  );
};

export default HeaderBanners;
