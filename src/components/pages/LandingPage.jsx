import React from 'react';
import Navbar from '../Header';
import Hero from '../Hero';
import GroupSection from '../section/home/GroupeSection';
import BlogSection from '../section/home/BlogSection';
import Footer from '../Footer';
import { RevealText } from '../text/RevealText';
import PercentageReduction from '../card/PercentageReduction';
import BestSellerSection from '../section/home/BestSellerSection';
import AnimatedBtn from '../Button/AnimatedBtn';
import HuntrixSection from '../section/home/HuntrixSection';
import SmoothSlider from '../card/SmoothSlider';
import LightStickCard from '../card/LightStickCard';
import { RevealCard } from '../card/RevealCard';
import CountDownCard from '../card/CountDownCard';
import { FilterBar } from '../Button/FilterBar';
import fashion from '../../data/k-fashion';
import beauty from '../../data/k-beauty';
import RespNav from '../resp/RespNav';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="lg:hidden">
        <RespNav />
      </div>
      <main>
        <Hero />
        <PercentageReduction/>
        
        {/* Section Titre Dynamique */}
        <div className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4">
            <RevealText><h2 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold"><span className='italic text-[#5E2251]'>Best sellers</span> du moment</h2></RevealText>
        </div>
        
        <BestSellerSection />
        <AnimatedBtn text="Voir tous les produits"/>
        
        {/* Image plein écran responsive */}
        <div className="w-full h-48 sm:h-64 md:h-96 lg:h-[500px] my-4 sm:my-6 md:my-8 relative">
          <img
            src="/fan_kpop.webp"
            alt="Kpop Demon"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        <div className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4">
            <RevealText><h2 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold">Groupe <span className='italic text-[#5E2251]'>K-pop </span> </h2></RevealText>
        </div>
        
        <GroupSection />
        
        <div className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4">
            <RevealText><h2 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold">Huntrix - <span className='italic text-[#5E2251]'>K-pop Demon Hunter </span> </h2></RevealText>
        </div>
        
        <HuntrixSection/>
        
        <div className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4">
            <RevealText><h2 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold">K-pop <span className='italic text-[#5E2251]'> Merch & Goodies </span> </h2></RevealText>
        </div>
        
        <FilterBar/>
        <LightStickCard/>
        <AnimatedBtn text="Voir tous les produits"/>
        
        <RevealCard image="/bt21.jpg" className=''>
          <AnimatedBtn text="Collection BT21"/>
          <div className="w-3/4 sm:w-2/3 md:w-1/2 mx-auto h-0.5 bg-white"></div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-5 mt-3 sm:mt-4 mx-auto px-4">
            <div className="flex bg-white p-2 sm:p-3 md:p-4 rounded-lg items-center w-full sm:w-fit">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-500/50 rounded-lg flex-shrink-0"></div>
              <div className="flex flex-col ml-2 sm:ml-3">
                <div className="flex flex-col gap-0.5 px-1 text-xs sm:text-sm font-light text-center">
                  <p className="font-medium text-[#5E2251]">Coussin BT21 Peluche</p>
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-[#5E2251] line-through text-xs">$25.00</span>
                    <span className="text-[#5E2251] font-semibold text-gray-900">$49.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex bg-white p-2 sm:p-3 md:p-4 rounded-lg items-center w-full sm:w-fit">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-500/50 rounded-lg flex-shrink-0"></div>
              <div className="flex flex-col ml-2 sm:ml-3">
                <div className="flex flex-col gap-0.5 px-1 text-xs sm:text-sm font-light text-center">
                  <p className="font-medium text-[#5E2251]">Coussin BT21 Peluche</p>
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-[#5E2251] line-through text-xs">$25.00</span>
                    <span className="text-[#5E2251] font-semibold text-gray-900">$49.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealCard>        
        
        <CountDownCard/>
        
        {/* K-Fashion Section - Clean Responsive Layout */}
        <div className="w-full py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              {/* Image - Left side */}
              <div className="w-full md:w-[48%] flex-shrink-0">
                <div className="relative w-full h-64 sm:h-80 md:h-[420px] overflow-hidden rounded-3xl">
                  <img
                    src="/fashion/k-fashion.png"
                    alt="K-Fashion"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content + Slider - Right side */}
              <div className="w-full md:w-[52%] flex flex-col">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl text-black font-bold">K-Fashion</h2>
                  <p className="text-[#5E2251] text-lg md:text-xl font-semibold italic mt-1">Korean Style</p>
                  <p className="text-gray-600 text-sm mt-2">Inspire toi de la mode coréenne pour avoir un look tendance !</p>
                </div>
                <div className="flex-1">
                  <SmoothSlider cards={fashion} className="justify-center md:justify-start"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* K-Beauty Section - Clean Responsive Layout */}
        <div className="w-full py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse gap-8 items-stretch">
              {/* Image - Right side */}
              <div className="w-full md:w-[48%] flex-shrink-0">
                <div className="relative w-full h-64 sm:h-80 md:h-[420px] overflow-hidden rounded-3xl">
                  <img
                    src="/k_beauty_kpop_girl.webp"
                    alt="K-Beauty"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content + Slider - Left side */}
              <div className="w-full md:w-[52%] flex flex-col">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl text-black font-bold">K-Beauty</h2>
                  <p className="text-[#5E2251] text-lg md:text-xl font-semibold italic mt-1">Korean Beauty</p>
                  <p className="text-gray-600 text-sm mt-2">Découvre les meilleurs Produits Skincare de Corée du Sud !</p>
                </div>
                <div className="flex-1">
                  <SmoothSlider cards={beauty} className="justify-center md:justify-end"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <BlogSection />
      </main>
      <Footer/>
      <footer className="bg-black text-white py-4 sm:py-6 md:py-8 text-center text-xs sm:text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
};

export default LandingPage;