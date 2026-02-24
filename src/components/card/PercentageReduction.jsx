import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PercentageReduction = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);

    const percentages = [
        { value: 10, reason: "Dès 2 articles" },
        { value: 15, reason: "Dès 3 articles" },
        { value: 20, reason: "Dès 4 articles" },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            itemsRef.current.forEach((item, index) => {
                gsap.fromTo(item,
                    { y: 20, opacity: 0 },
                    {
                        y: 0, opacity: 1,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 90%',
                        }
                    }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full py-6 px-4">
            <div className="max-w-4xl mx-auto"> {/* Largeur max réduite */}
                
                {/* Header plus compact */}
                <div className="text-center mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                        Offres <span style={{ color: '#8318b3' }}>Dégressives</span>
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">
                        Économisez davantage en ajoutant plus d'articles.
                    </p>
                </div>

                {/* Grid plus serré */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {percentages.map((p, index) => (
                        <div
                            key={p.value}
                            ref={(el) => (itemsRef.current[index] = el)}
                            className="relative group p-4 rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-md overflow-hidden"
                            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                        >
                            {/* Barre de couleur discrète en haut */}
                            <div 
                                className="absolute top-0 left-0 w-full h-1"
                                style={{ background: `linear-gradient(90deg, #b35fc2, #8318b3)` }}
                            ></div>

                            <div className="flex flex-col items-center text-center">
                                {/* Valeur de réduction plus petite */}
                                <div className="flex items-baseline mb-1">
                                    <span 
                                        className="text-3xl font-black tracking-tight"
                                        style={{ color: '#8318b3' }}
                                    >
                                        -{p.value}
                                    </span>
                                    <span className="text-lg font-bold ml-0.5" style={{ color: '#b35fc2' }}>%</span>
                                </div>

                                {/* Condition sur une seule ligne */}
                                <p className="text-[11px] md:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    {p.reason}
                                </p>

                                {/* Indicateur de palier visuel */}
                                <div className="mt-3 flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div 
                                            key={i}
                                            className="h-1 w-4 rounded-full"
                                            style={{ 
                                                backgroundColor: i <= index ? '#b35fc2' : '#f3f4f6',
                                                opacity: i <= index ? 1 : 0.5
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            {/* Effet discret au hover */}
                            <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none"
                                style={{ backgroundColor: '#8318b3' }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Info bas de page réduite */}
                <p className="text-center mt-5 text-[10px] text-gray-400 font-medium">
                    * Appliqué au panier
                </p>
            </div>
        </section>
    );
};

export default PercentageReduction;