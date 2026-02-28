import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PercentageReduction = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);
    const scrollingTextRef = useRef(null);

    const fontTitle = "'Archivo Black', sans-serif";
    const fontHunter = "'Cinzel', serif";

    const percentages = [
        { value: 10, label: "SCOUT", reason: "2+ Items" },
        { value: 15, label: "ELITE", reason: "3+ Items" },
        { value: 20, label: "SLAYER", reason: "4+ Items" },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            itemsRef.current.forEach((item, index) => {
                gsap.fromTo(item,
                    { y: 20, opacity: 0 },
                    {
                        y: 0, opacity: 1,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: 'power4.out',
                        scrollTrigger: { trigger: item, start: 'top 95%' }
                    }
                );
            });

            gsap.to(scrollingTextRef.current, {
                xPercent: -50,
                ease: "none",
                duration: 25,
                repeat: -1
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section 
            ref={containerRef} 
            className="w-full h-auto lg:h-[10vw] bg-white border-y border-gray-100 relative overflow-hidden flex items-center py-6 md:py-0"
        >
            {/* TEXTE FANTÔME DÉFILANT */}
            <div className="absolute inset-0 flex items-center z-0 pointer-events-none opacity-[0.03] whitespace-nowrap">
                <h2 ref={scrollingTextRef} className="text-[15vw] lg:text-[12vw] font-black uppercase inline-block"
                    style={{ WebkitTextStroke: '1px black', color: 'transparent', fontFamily: fontTitle }}>
                    HUNTER DEALS • EXTRACTION REWARDS • LEVEL UP • HUNTER DEALS • EXTRACTION REWARDS • LEVEL UP •&nbsp;
                </h2>
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0">
                    
                    {/* BLOC TITRE GAUCHE (Masqué ou réduit sur mobile très petit si besoin, ici optimisé) */}
                    <div className="flex items-center gap-4 md:gap-6 group">
                        <div className="h-8 md:h-12 w-1 md:w-1.5 bg-[#b35fc2] shadow-[0_0_15px_rgba(179,95,194,0.3)]"></div>
                        <div>
                            <h3 className="text-2xl md:text-5xl font-black uppercase text-gray-900 leading-none tracking-tighter" style={{ fontFamily: fontTitle }}>
                                LEVEL <span style={{ color: '#b35fc2' }}>UP</span>
                            </h3>
                            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase" style={{ fontFamily: fontHunter }}>
                                Supply Drop Active
                            </span>
                        </div>
                    </div>

                    {/* GRILLE DE RÉDUCTION : Changement ici pour grid-cols-3 et no-wrap */}
                    <div className="grid grid-cols-3 w-full lg:w-auto gap-2 md:gap-16">
                        {percentages.map((p, index) => (
                            <div
                                key={p.value}
                                ref={(el) => (itemsRef.current[index] = el)}
                                className="flex flex-row items-center justify-center lg:justify-start gap-2 md:gap-4 group"
                            >
                                {/* Chiffre (Taille réduite sur mobile pour tenir sur une ligne) */}
                                <div className="relative">
                                    <span className="text-3xl sm:text-4xl md:text-7xl font-black text-gray-900 leading-none" style={{ fontFamily: fontTitle }}>
                                        -{p.value}
                                    </span>
                                    <span className="absolute -top-1 -right-3 md:-right-4 text-xs md:text-xl font-black text-[#b35fc2]" style={{ fontFamily: fontTitle }}>%</span>
                                </div>

                                {/* Label & Reason (Caché ou très réduit sur mobile si l'écran est minuscule) */}
                                <div className="flex flex-col border-l border-gray-200 pl-2 md:pl-4">
                                    <span className="text-[#b35fc2] text-[7px] md:text-xs font-black tracking-widest leading-none" style={{ fontFamily: fontHunter }}>
                                        {p.label}
                                    </span>
                                    <span className="text-gray-500 text-[6px] md:text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap">
                                        {p.reason}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* BADGE DE FIN (Masqué sur mobile pour gagner de la place) */}
                    <div className="hidden lg:flex items-center gap-3 opacity-40 group hover:opacity-100 transition-opacity">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-gray-900 uppercase tracking-widest leading-none">Status</p>
                            <p className="text-[10px] font-black text-[#b35fc2] uppercase tracking-tighter">Verified</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#b35fc2] rounded-full animate-pulse shadow-[0_0_8px_#b35fc2]"></div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.02)_50%)] bg-[length:100%_4px]"></div>
        </section>
    );
};

export default PercentageReduction;