import React from 'react';
import Header from './Header';
import RespNav from './resp/RespNav';

/**
 * LayoutWrapper - Composant qui affiche automatiquement :
 * - Header en mode desktop (lg et plus)
 * - RespNav en mode mobile (moins de lg)
 * 
 * Utilisation :
 * <LayoutWrapper>
 *   <YourPage />
 * </LayoutWrapper>
 */
export default function LayoutWrapper({ children }) {
  return (
    <>
      {/* Header - Desktop only */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* RespNav - Mobile only */}
      <div className="lg:hidden">
        <RespNav />
      </div>

      {/* Contenu principal */}
      {children}
    </>
  );
}
