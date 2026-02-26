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
        <section ref={containerRef} className="w-full py-4 md:py-6 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Header compact */}
                <div className="text-center mb-4 md:mb-6">
                    <h3 className="text-lg md:text-2xl text-center font-bold text-gray-900">
                        Offres Dégressives
                    </h3>
                    <p className="text-gray-500 text-[11px] md:text-sm mt-1">
                        Économisez davantage en ajoutant plus d'articles.
                    </p>
                </div>

                {/* Grid - côte à côte même sur mobile */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4">
                    {percentages.map((p, index) => (
                        <div
                            key={p.value}
                            ref={(el) => (itemsRef.current[index] = el)}
                            className="group relative p-2 md:p-4 rounded-lg md:rounded-2xl border border-primary-300/40 bg-secondary-50 transition-all duration-300 hover:shadow-md hover:border-primary-400/60 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(28, 207, 231, 0.05) 0%, rgba(179, 95, 194, 0.05) 100%)',
                                boxShadow: '0 2px 8px rgba(82, 108, 111, 0.1)',
                            }}
                        >
                            {/* Barre colorée en haut */}
                            <div 
                                className="absolute top-0 left-0 w-full h-0.5 md:h-1"
                                style={{ background: ` #b35fc2` }}
                            ></div>

                            <div className="flex flex-col items-center text-center">
                                {/* Valeur de réduction */}
                                <div className="flex items-baseline mb-1 md:mb-2">
                                    <span 
                                        className="text-2xl md:text-4xl font-black tracking-tight"
                                        style={{ color: 'rgba(1, 1, 1, 0.82)' }}
                                    >
                                        -{p.value}
                                    </span>
                                    <span className="text-sm md:text-lg font-bold ml-0.5" style={{ color: 'rgba(0, 0, 0, 0.82)' }}>%</span>
                                </div>

                                {/* Condition compacte */}
                                <p className="text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider leading-tight line-clamp-2">
                                    {p.reason}
                                </p>

                                {/* Indicateur de palier */}
                                <div className="mt-2 md:mt-3 flex gap-0.5 md:gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div 
                                            key={i}
                                            className="h-1 w-2 md:w-4 rounded-full transition-all"
                                            style={{ 
                                                backgroundColor: i <= index ? '#1ccfe7' : '#e5e7eb',
                                                opacity: i <= index ? 1 : 0.4
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            {/* Effet au hover */}
                            <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity pointer-events-none"
                                style={{ backgroundColor: '#1ccfe7' }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Info bas compact */}
                <p className="text-center mt-3 md:mt-5 text-[9px] md:text-[10px] text-gray-400 font-medium">
                    * Appliqué au panier
                </p>
            </div>
        </section>
    );
};

export default PercentageReduction;