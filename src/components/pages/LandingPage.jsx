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
        <PercentageReduction/>
        {/* Section Titre Dynamique */}
        <div className="text-center pt-16 pb-10">
            <RevealText><h2 className="text-3xl text-black font-semibold"><span className='italic text-[#5E2251]'>Best sellers</span> du moment</h2></RevealText>
        </div>
        <BestSellerSection />
        <AnimatedBtn text="Voir tous les produits"/>
        
        <div className="w-screen h-screen my-10 relative">
          {/* Background image */}
          <img
            src="/fan_kpop.webp"
            alt="Kpop Demon"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="text-center pt-16 pb-10">
            <RevealText><h2 className="text-3xl text-black font-semibold">Groupe <span className='italic text-[#5E2251]'>K-pop </span> </h2></RevealText>
        </div>
        <GroupSection />
        <div className="text-center pt-16 pb-10">
            <RevealText><h2 className="text-3xl text-black font-semibold">Huntrix - <span className='italic text-[#5E2251]'>K-pop Demon Hunter </span> </h2></RevealText>
        </div>
        <HuntrixSection/>
        <div className="text-center pt-16 pb-10">
            <RevealText><h2 className="text-3xl text-black font-semibold">K-pop <span className='italic text-[#5E2251]'> Merch & Goodies </span> </h2></RevealText>
        </div>
        <FilterBar></FilterBar>
        <LightStickCard/>
        <AnimatedBtn text="Voir tous les produits"/>
        <RevealCard image="/bt21.jpg" className=''>
          <AnimatedBtn text="Collection BT21"/>
          <div className="w-1/2 mx-auto h-0.5 bg-white"></div>
          <div className="flex gap-5 mt-5 mx-auto">
            <div className="flex bg-white p-4 rounded-lg items-center w-fit">
            <div className="w-10 h-10 bg-gray-500/50 rounded-lg"></div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-1 px-1 text-sm mt-5 font-light text-center">
                <p className=" font-medium text-[#5E2251]">Coussin BT21 Peluche</p>

                <div className="flex items-center gap-2 justify-center">
                      <span className="text-[#5E2251] line-through">
                        $25.00
                      </span>
                    <span className="text-[#5E2251] font-semibold text-gray-900">
                      $49.00
                    </span>
                </div>
              </div>
            </div>
            </div>
            <div className="flex bg-white p-4 rounded-lg items-center w-fit">
              <div className="w-10 h-10 bg-gray-500/50 rounded-lg"></div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-1 px-1 text-sm mt-5 font-light text-center">
                  <p className=" font-medium text-[#5E2251]">Coussin BT21 Peluche</p>

                  <div className="flex items-center gap-2 justify-center">
                        <span className="text-[#5E2251] line-through">
                          $25.00
                        </span>
                      <span className="text-[#5E2251] font-semibold text-gray-900">
                        $49.00
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealCard>        
        <CountDownCard/>
        <div className="relative w-full">
          <SmoothSlider className=' justify-end' cards={fashion}/>
          <div className="absolute -top-10 right-1/3 translate-x-1/2 text-center pt-16 pb-10">
            <RevealText><h2 className="text-3xl text-black font-semibold">K-Fashion <span className='italic text-[#5E2251]'> Korean Style </span> </h2></RevealText>
            <p className='text-gray-600'>Inspire toi de la mode coréenne pour avoir un look tendance !</p>
          </div>
          <div className="absolute left-10 top-1/2 -translate-y-1/2 mt-3 left w-[500px] h-[500px] overflow-hidden rounded-2xl">
            <img
              src="/fashion/k-fashion.png"
              alt="Kpop Demon"
              className="object-cover h-full w-full"
            />
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute right-20 top-1/2 -translate-y-1/2 mt-3 left w-[500px] h-[500px] overflow-hidden rounded-2xl">
            <img
              src="/k_beauty_kpop_girl.webp"
              alt="Kpop Beauty"
              className="object-cover h-full w-full"
            />
          </div>
          <SmoothSlider className='justify-start' cards={beauty}/>
          <div className="text-center pt-16 pb-10 absolute left-1/3 -translate-x-1/2 -top-10">
            <RevealText><h2 className="text-3xl text-black font-semibold">K-beauty <span className='italic text-[#5E2251]'> Korean Beauty </span> </h2></RevealText>
            <p className='text-gray-600'>Découvre les meilleurs Produits Skincare de Corée du Sud !</p>
          </div>
        </div>
        
        <BlogSection />
      </main>
      <Footer/>
      {/* Footer simple */}
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
};

export default LandingPage;