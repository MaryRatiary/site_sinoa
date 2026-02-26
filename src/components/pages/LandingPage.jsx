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
        
        {/* BT21 Collection Card */}
                
        
        <CountDownCard/>
        
          {/* Section K-Fashion */}
          <div ref={kFashionRef} className="w-full py-12 md:py-20 px-4 relative overflow-hidden bg-[#f8fdff]">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row gap-10 items-center">
                
                {/* Image de gauche - Plus grande sur desktop */}
                <div className="w-full lg:w-[45%]">
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-200/50 border-8 border-white">
                    <img src="/fashion/k-fashion.png" alt="K-Fashion" className="w-full h-[350px] md:h-[500px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent" />
                  </div>
                </div>

                {/* Contenu + Slider de droite */}
                <div className="w-full lg:w-[75%]">
                  <div className="mb-8 text-center lg:text-left">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">K-FASHION</h2>
                    <p className="text-primary-600 text-xl font-serif italic tracking-wide">The Seoul Trend</p>
                    <div className="h-1 w-20 bg-primary-500 my-4 mx-auto lg:mx-0"></div>
                    <p className="text-gray-600 max-w-md mx-auto lg:mx-0">Inspire-toi de la mode coréenne pour un look tendance et audacieux au quotidien.</p>
                  </div>
                  
                  <SmoothSlider cards={fashion} />
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
                <div className="mb-8 text-center lg:text-left">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Korean Beauty</h2>
                    <p className="text-primary-600 text-xl font-serif italic tracking-wide">Découvre les meilleurs Produits Skincare de Corée du Sud !</p>
                    <div className="h-1 w-20 bg-primary-500 my-4 mx-auto lg:mx-0"></div>
                   
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
     
    </div>
  );
};

export default LandingPage;