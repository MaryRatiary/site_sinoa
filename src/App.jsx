import React from 'react';
import Navbar from './components/Header';
import Hero from './components/Hero';
import GroupSection from './components/GroupeSection';
import BlogSection from './components/BlogSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <main>
        <Hero />
        
        {/* Section Titre Dynamique */}
        <div className="text-center py-16">
            <h2 className="text-3xl font-black uppercase tracking-widest">Nos Groupes K-Pop</h2>
            <div className="w-20 h-1 bg-black mx-auto mt-4"></div>
        </div>

        <GroupSection />
        
        <BlogSection />
      </main>
      
      {/* Footer simple */}
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
};

export default LandingPage;