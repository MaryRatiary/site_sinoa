import React, { useRef, useEffect } from 'react';
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
import HeaderBanners from '../HeaderBanners';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const bestSellersTitleRef = useRef(null);
  const groupSectionRef = useRef(null);
  const huntrixSectionRef = useRef(null);
  const merchSectionRef = useRef(null);
  const kFashionRef = useRef(null);
  const kBeautyRef = useRef(null);

  useEffect(() => {
    // Animation pour les titres au scroll
    const animateElement = (ref, delay = 0) => {
      if (!ref.current) return;
      
      gsap.fromTo(
        ref.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            end: 'top 50%',
            scrub: false,
          },
        }
      );
    };

    // Animer tous les éléments
    animateElement(bestSellersTitleRef);
    animateElement(groupSectionRef, 0.1);
    animateElement(huntrixSectionRef, 0.2);
    animateElement(merchSectionRef, 0.1);
    animateElement(kFashionRef, 0.1);
    animateElement(kBeautyRef, 0.1);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-primary-50 to-secondary-50 font-sans text-gray-900">
      {/* Bandeaux animés avec compte à rebours */}
  
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="lg:hidden">
        <RespNav />
      </div>
      <main>
        <Hero />
        
        
        {/* Section Titre Dynamique - Best Sellers */}
        <div ref={bestSellersTitleRef} className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4 relative z-10">
            <RevealText>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                <span className='italic text-secondary-500 drop-shadow-lg'>Best sellers</span> 
                <span className='italic text-accent-500'> du moment</span>
              </h2>
            </RevealText>
        </div>
        
        <BestSellerSection />
        <AnimatedBtn text="Voir tous les produits"/>
        
        {/* Image plein écran responsive */}
        <div className="w-full h-48 sm:h-64 md:h-96 lg:h-[500px] my-4 sm:my-6 md:my-8 relative shadow-2xl" style={{boxShadow: '0 0 30px rgba(28, 207, 231, 0.4)'}}>
          <img
            src="/fan_kpop.webp"
            alt="Kpop Demon"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-400/30 via-transparent to-transparent"></div>
        </div>
        <PercentageReduction/>
        {/* Section Groupe K-pop */}
        <div ref={groupSectionRef} className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4 relative z-10">
            <RevealText>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                Groupe 
                <span className='italic text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-accent-500 to-secondary-500'> K-pop </span>
              </h2>
            </RevealText>
        </div>
        
        <GroupSection />
        
        <div ref={huntrixSectionRef} className="w-full py-6 md:py-10 px-4 relative overflow-hidden bg-white">
            {/* Accents de fond subtils */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{backgroundImage: 'radial-gradient(circle at 10% 20%, #b35fc2 0%, transparent 40%), radial-gradient(circle at 90% 80%, #001c66 0%, transparent 40%)'}}>
            </div>
            
            <div className="text-center mb-4 md:mb-6 relative z-10">
                <RevealText>
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-bold" style={{ color: '#001c66' }}>
                    Huntrix - 
                    <span className='italic ml-2' style={{ color: '#8318b3' }}> K-pop Demon Hunter </span>
                  </h2>
                </RevealText>
                <div className="h-1 w-12 mx-auto mt-2 rounded-full" style={{ background: 'linear-gradient(90deg, #b35fc2, #8318b3)' }}></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto">
              <HuntrixSection/>
            </div>
          </div>
        {/* Section Merch & Goodies */}
        <div ref={merchSectionRef} className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4 relative z-10">
            <RevealText>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                K-pop 
                <span className='italic text-primary-500 drop-shadow-lg'> Merch & Goodies </span>
              </h2>
            </RevealText>
        </div>
        
        <FilterBar/>
        <LightStickCard/>
        <AnimatedBtn text="Voir tous les produits"/>
        
        {/* BT21 Collection Card */}
        <RevealCard image="/collection.jpg" className='relative overflow-hidden' style={{boxShadow: '0 0 40px rgba(179, 95, 194, 0.3)'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-300/30 via-transparent to-primary-300/30"></div>
          <div className="relative z-10">
            <AnimatedBtn text="Collection BT21"/>
            <div className="w-3/4 sm:w-2/3 md:w-1/2 mx-auto h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-5 mt-3 sm:mt-4 mx-auto px-4">
              <div className="flex bg-white/90 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg items-center w-full sm:w-fit border border-primary-400/60 hover:border-secondary-500 transition" style={{boxShadow: '0 0 20px rgba(28, 207, 231, 0.3)'}}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex-shrink-0"></div>
                <div className="flex flex-col ml-2 sm:ml-3">
                  <div className="flex flex-col gap-0.5 px-1 text-xs sm:text-sm font-light text-center">
                    <p className="font-medium text-secondary-600">Coussin BT21 Peluche</p>
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-secondary-500 line-through text-xs">$25.00</span>
                      <span className="text-primary-600 font-semibold">$49.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex bg-white/90 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg items-center w-full sm:w-fit border border-primary-400/60 hover:border-secondary-500 transition" style={{boxShadow: '0 0 20px rgba(28, 207, 231, 0.3)'}}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex-shrink-0"></div>
                <div className="flex flex-col ml-2 sm:ml-3">
                  <div className="flex flex-col gap-0.5 px-1 text-xs sm:text-sm font-light text-center">
                    <p className="font-medium text-secondary-600">Coussin BT21 Peluche</p>
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-secondary-500 line-through text-xs">$25.00</span>
                      <span className="text-primary-600 font-semibold">$49.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealCard>        
        
        <CountDownCard/>
        
        {/* K-Fashion Section - Cyberpunk Style */}
        <div ref={kFashionRef} className="w-full py-8 md:py-12 px-4 relative overflow-hidden bg-gradient-to-r from-dark-100 via-primary-100 to-primary-50">
          <div className="absolute inset-0 opacity-40" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(28, 207, 231, 0.15) 0%, transparent 50%)'}}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              {/* Image - Left side */}
              <div className="w-full md:w-[48%] flex-shrink-0">
                <div className="relative w-full h-64 sm:h-80 md:h-[420px] overflow-hidden rounded-3xl" style={{boxShadow: '0 0 30px rgba(28, 207, 231, 0.5)'}}>
                  <img
                    src="/fashion/k-fashion.png"
                    alt="K-Fashion"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-200/40 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Content + Slider - Right side */}
              <div className="w-full md:w-[52%] flex flex-col justify-center">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">K-Fashion</h2>
                  <p className="text-primary-600 text-lg md:text-xl font-semibold italic mt-1">Korean Style</p>
                  <p className="text-gray-700 text-sm mt-2">Inspire toi de la mode coréenne pour avoir un look tendance !</p>
                </div>
                <div className="flex-1">
                  <SmoothSlider cards={fashion} className="justify-center md:justify-start"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* K-Beauty Section - Cyberpunk Style */}
        <div ref={kBeautyRef} className="w-full py-8 md:py-12 px-4 relative overflow-hidden bg-gradient-to-r from-secondary-100 via-accent-100 to-secondary-50">
          <div className="absolute inset-0 opacity-35" style={{backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(179, 95, 194, 0.2) 0%, transparent 50%)'}}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row-reverse gap-8 items-stretch">
              {/* Image - Right side */}
              <div className="w-full md:w-[48%] flex-shrink-0">
                <div className="relative w-full h-64 sm:h-80 md:h-[420px] overflow-hidden rounded-3xl" style={{boxShadow: '0 0 30px rgba(179, 95, 194, 0.5)'}}>
                  <img
                    src="/k_beauty_kpop_girl.webp"
                    alt="K-Beauty"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-200/40 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Content + Slider - Left side */}
              <div className="w-full md:w-[52%] flex flex-col justify-center">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-accent-600">K-Beauty</h2>
                  <p className="text-secondary-600 text-lg md:text-xl font-semibold italic mt-1">Korean Beauty</p>
                  <p className="text-gray-700 text-sm mt-2">Découvre les meilleurs Produits Skincare de Corée du Sud !</p>
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
      <footer className="bg-gradient-to-r from-dark-100 to-primary-100 text-gray-900 py-4 sm:py-6 md:py-8 text-center text-xs sm:text-sm border-t border-primary-400/50" style={{boxShadow: '0 -10px 30px rgba(28, 207, 231, 0.15)'}}>
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
};

export default LandingPage;