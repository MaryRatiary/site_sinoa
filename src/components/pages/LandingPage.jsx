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
import SmoothSlider from '../card/SmoothSlider';
import LightStickCard from '../card/LightStickCard';
import { RevealCard } from '../card/RevealCard';
import CountDownCard from '../card/CountDownCard';
import { FilterBar } from '../Button/FilterBar';
import fashion from '../../data/k-fashion';
import beauty from '../../data/k-beauty';
import RespNav from '../resp/RespNav';
import HeaderBanners from '../composants/HeaderBanners';
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

  // Configuration des polices Demon Huntrix
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
    animateElement(kFashionRef, 0.1);
    animateElement(kBeautyRef, 0.1);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-primary-50 to-secondary-50 text-gray-900">
      {/* Chargement des polices via URL */}
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
        
        {/* Section Titre Dynamique - Best Sellers */}
        <div ref={bestSellersTitleRef} className="text-center pt-6 sm:pt-8 md:pt-5  px-0 relative z-10">
            <RevealText>
              <h2 className="text-2xl sm:text-4xl md:text-3xl uppercase tracking-tighter" style={{color: '#001c66',fontFamily:  fontTitle }}>
                <span className='italic text-secondary-500 drop-shadow-lg '>Best sellers</span> 
                <span className='italic text-accent-500' style={{color: '#8318b3', }}> du moment</span>
              </h2>
            </RevealText>
        </div>
        <BestSellerSection />
        
                    {/* Image Section Intermédiaire avec styles Hero */}
              <div className="w-full sm:h-64 md:h-96 lg:h-70 my-1 sm:my-6 md:my-4 relative shadow-2xl overflow-hidden group" 
                  style={{boxShadow: '0 0 30px rgba(28, 207, 231, 0.4)'}}>
                
                {/* IMAGE */}
                <img
                  src="horloge.jpg"
                  alt="Kpop Demon"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                />

                {/* OVERLAYS : Dégradés pour la lisibilité */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

                {/* --- TEXTES STYLE HERO --- */}
                
                {/* HAUT GAUCHE : Badge */}
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

                {/* CENTRE : Titre Fantôme DEMON */}
                <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
                  <h1 className="text-7xl md:text-[15rem] font-black uppercase opacity-10 select-none"
                      style={{ WebkitTextStroke: '1.5px white', color: 'transparent', fontFamily: "'Archivo Black', sans-serif" }}>
                    DEMON
                  </h1>
                </div>

                {/* BAS GAUCHE : Slogan accrocheur */}
                <div className="absolute bottom-6 left-4 md:bottom-10 md:left-8 z-20">
                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-[0.8] uppercase tracking-[-0.05em]" 
                      style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                    TIME <span style={{ color: '#8318b3' }}>TO</span> <br/> 
                    <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>STRIKE</span>
                  </h2>
                  <div className="h-1 w-12 md:w-20 mt-3" style={{ backgroundColor: '#b35fc2' }}></div>
                </div>

                {/* BAS DROITE : Petit indicateur ou bouton discret */}
                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
                  <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 backdrop-blur-md bg-white/5">
                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/80" style={{ fontFamily: "'Cinzel', serif" }}>
                      Phase 02
                    </span>
                  </div>
                </div>
              </div>

       

        
        <GroupSection />
        
        {/* Section Huntrix */}
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
        {/* Section Merch & Goodies */}
        <div ref={merchSectionRef} className="text-center pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 px-4 relative z-10">
            <RevealText>
              <h2 className="text-2xl sm:text-4xl md:text-5xl uppercase" style={{ fontFamily: fontTitle }}>
                K-pop 
                <span className='italic text-primary-500 drop-shadow-lg' style={{ fontFamily: fontHunter }}> Merch & Goodies </span>
              </h2>
            </RevealText>
        </div>

        <LightStickCard/>
        <CountDownCard/>
        
        {/* Section K-Fashion */}
        <div ref={kFashionRef} className="w-full py-12 md:py-10 px-4 relative overflow-hidden bg-[#f8fdff]">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="w-full lg:w-[45%]">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-200/50 border-8 border-white">
                  <img src="/fashion/k-fashion.png" alt="K-Fashion" className="w-full h-[350px] md:h-[400px] object-cover" />
                </div>
              </div>

              <div className="w-full lg:w-[75%]">
                <div className="mb-8 text-center lg:text-left">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: fontTitle }}>K-FASHION</h2>
                  <p className="max-w-md mx-auto lg:mx-0 font-medium italic">Inspire-toi de la mode coréenne pour un look tendance et audacieux au quotidien.</p>
                </div>
                <SmoothSlider cards={fashion} productType="fashion" className="justify-center md:justify-end"/>
              </div>
            </div>
          </div>
        </div>

        {/* K-Beauty Section */}
        <div ref={kBeautyRef} className="w-full py-8 md:py-12 px-4 relative overflow-hidden bg-gradient-to-r from-secondary-100 via-accent-100 to-secondary-50">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row-reverse gap-8 items-stretch">
              <div className="w-full md:w-[48%] flex-shrink-0">
                <div className="relative w-full h-64 sm:h-80 md:h-[420px] overflow-hidden rounded-3xl" style={{boxShadow: '0 0 30px rgba(179, 95, 194, 0.5)'}}>
                  <img src="/k_beauty_kpop_girl.webp" alt="K-Beauty" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="w-full md:w-[70%] flex flex-col justify-center">
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: fontTitle }}>Korean Beauty</h2>
                    <p className="text-primary-600 text-1xl italic tracking-wide" >Découvre les meilleurs Produits Skincare de Corée du Sud !</p>
                    <div className="h-1.5 w-24 bg-primary-500 my-0 mx-auto md:mx-0"></div>
                </div>
                <div className="flex-1">
                  <SmoothSlider cards={beauty} productType="beauty" className="justify-center md:justify-end"/>
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
