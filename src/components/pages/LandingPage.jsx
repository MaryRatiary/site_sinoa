import React from 'react';
import Navbar from '../Header';
import Hero from '../Hero';
import GroupSection from '../section/home/GroupeSection';
import BlogSection from '../section/home/BlogSection';
import { Footer } from '../Footer';
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

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <PercentageReduction />
        <div className="text-center pt-16 pb-10">
          <RevealText>
            <h2 className="text-3xl md:text-4xl text-black font-semibold">
              <span className="italic text-[#5E2251]">Best sellers</span> du moment
            </h2>
          </RevealText>
        </div>
        <BestSellerSection />
        <AnimatedBtn text="Voir tous les produits" />
        <div className="w-full h-[50vh] md:h-[70vh] my-10 relative">
          <img
            src="/fan_kpop.webp"
            alt="Kpop Demon"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="text-center pt-16 pb-10">
          <RevealText>
            <h2 className="text-3xl md:text-4xl text-black font-semibold">
              Groupe <span className="italic text-[#5E2251]">K-pop</span>
            </h2>
          </RevealText>
        </div>
        <GroupSection />
        <HuntrixSection />
        <LightStickCard />
        <SmoothSlider className="justify-center" cards={fashion} />
        <SmoothSlider className="justify-center" cards={beauty} />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;