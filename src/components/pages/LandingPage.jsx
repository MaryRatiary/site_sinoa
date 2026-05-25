import React, { useRef, useEffect } from 'react';
import Navbar from '../composants/Header';
import Hero from '../composants/Hero';
import GroupSection from '../section/home/GroupeSection';
import BlogSection from '../section/home/BlogSection';
import Footer from '../composants/Footer';
import { RevealText } from '../text/RevealText';
import PercentageReduction from '../card/PercentageReduction';
import BestSellerSection from '../section/home/BestSellerSection';
import AnimatedBtn from '../Button/AnimatedBtn';
import HuntrixSection from '../section/home/HuntrixSection';
import LightStickCard from '../card/LightStickCard';
import { RevealCard } from '../card/RevealCard';
import CountDownCard from '../card/CountDownCard';
import { FilterBar } from '../Button/FilterBar';
import CollectiblesSection from '../section/home/CollectiblesSection';
import RespNav from '../resp/RespNav';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const bestSellersTitleRef = useRef(null);
  const groupSectionRef = useRef(null);
  const huntrixSectionRef = useRef(null);
  const merchSectionRef = useRef(null);
  const collectiblesRef = useRef(null);

  const fontTitle = "'Archivo Black', sans-serif";
  const fontHunter = "'Cinzel', serif";

  useEffect(() => {
    const animateElement = (ref, delay = 0) => {
      if (!ref.current) return;
      
      gsap.fromTo(
        ref.current,
        { y: 50, opacity: 0 },
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

    animateElement(bestSellersTitleRef);
    animateElement(groupSectionRef, 0.1);
    animateElement(huntrixSectionRef, 0.2);
    animateElement(merchSectionRef, 0.1);
    animateElement(collectiblesRef, 0.1);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-primary-50 to-secondary-50 text-gray-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Cinzel:wght@700;900&display=swap');`}
      </style>

      <div className="hidden lg:block">
        <Navbar />
      </div>
      <div className="lg:hidden">
        <RespNav />
      </div>
      
      <main>
        <Hero />
        
        <div ref={bestSellersTitleRef} className="text-center pt-6 sm:pt-8 md:pt-5 px-0 relative z-10">
            <RevealText>
              <h2 className="text-2xl sm:text-4xl md:text-3xl uppercase tracking-tighter" style={{color: '#001c66',fontFamily:  fontTitle }}>
                <span className='italic text-secondary-500 drop-shadow-lg '>Best sellers</span> 
                <span className='italic text-accent-500' style={{color: '#8318b3', }}> du moment</span>
              </h2>
            </RevealText>
        </div>
        <BestSellerSection />
        
        <div className="w-full sm:h-64 md:h-96 lg:h-70 my-1 sm:my-6 md:my-4 relative shadow-2xl overflow-hidden group" 
            style={{boxShadow: '0 0 30px rgba(28, 207, 231, 0.4)'}}>
          
          <img
            src="horloge.jpg"
            alt="Kpop Demon"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
          />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

          <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-white/70 italic" style={{ fontFamily: "'Cinzel', serif" }}>
                Limited Edition
              </span>
              <span className="text-2xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none" 
                    style={{ color: '#b35fc2', fontFamily: "'Archivo Black', sans-serif" }}>
                CHRONOS
              </span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
            <h1 className="text-7xl md:text-[15rem] font-black uppercase opacity-10 select-none"
                style={{ WebkitTextStroke: '1.5px white', color: 'transparent', fontFamily: "'Archivo Black', sans-serif" }}>
              DEMON
            </h1>
          </div>

          <div className="absolute bottom-6 left-4 md:bottom-10 md:left-8 z-20">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-[0.8] uppercase tracking-[-0.05em]" 
                style={{ fontFamily: "'Archivo Black', sans-serif" }}>
              TIME <span style={{ color: '#8318b3' }}>TO</span> <br/> 
              <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>STRIKE</span>
            </h2>
            <div className="h-1 w-12 md:w-20 mt-3" style={{ backgroundColor: '#b35fc2' }}></div>
          </div>

          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
            <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 backdrop-blur-md bg-white/5">
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/80" style={{ fontFamily: "'Cinzel', serif" }}>
                Phase 02
              </span>
            </div>
          </div>
        </div>

        <GroupSection />
        
        <div ref={huntrixSectionRef} className="w-full py-6 md:py-10 px-4 relative overflow-hidden bg-white">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{backgroundImage: 'radial-gradient(circle at 10% 20%, #b35fc2 0%, transparent 40%), radial-gradient(circle at 90% 80%, #001c66 0%, transparent 40%)'}}>
            </div>
            
            <div className="text-center mb-4 md:mb-6 relative z-10">
                <RevealText>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl uppercase tracking-tight" style={{ color: '#001c66', fontFamily: fontTitle }}>
                    Huntrix - 
                    <span className='italic ml-2' style={{ color: '#8318b3', fontFamily: fontHunter }}> K-pop Demon Hunter </span>
                  </h2>
                </RevealText>
                <div className="h-2 w-16 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg, #b35fc2, #8318b3)' }}></div>
            </div>
            
            <div className="relative z-10 max-w-full mx-auto">
              <HuntrixSection/>
            </div>
        </div>
        <PercentageReduction/>
        
        <div ref={merchSectionRef} className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4 relative z-10">
            <RevealText>
              <h2 className="text-1xl sm:text-2xl md:text-3xl uppercase" style={{ fontFamily: fontTitle }}>
                Vetements & Accessoires -
                <span className='italic text-primary-500 drop-shadow-lg' style={{ fontFamily: fontHunter }}> Merch & Goodies </span>
              </h2>
            </RevealText>
        </div>

        <LightStickCard/>
        <CountDownCard/>
        
        {/* Section Collectibles & Fun - DYNAMIQUE DE LA BASE DE DONNEES */}
        <div ref={collectiblesRef}>
          <CollectiblesSection />
        </div>
        
        <BlogSection />
      </main>
      <Footer/>
    </div>
  );
};

export default LandingPage;
