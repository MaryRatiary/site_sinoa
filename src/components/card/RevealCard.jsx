// RevealCard.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * RevealCard
 *
 * Props:
 *  - image       {string}  background image src
 *  - children    {node}    card content
 *  - direction   {"left"|"right"}  which side the card slides in from (default: "left")
 *  - className   {string}  extra classes on the outer wrapper
 */
export function RevealCard({ image, children, direction = "left", className = "" }) {
    const sectionRef = useRef(null);   // scroll trigger anchor
    const clipRef = useRef(null);   // overflow-hidden clipper
    const cardRef = useRef(null);   // the card itself
    const imgRef = useRef(null);   // background image

    useEffect(() => {
        const ctx = gsap.context(() => {
            const xStart = direction === "left" ? "-100%" : "100%";

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none",
                },
            });

            // Card slides in from the side (clipped by parent overflow-hidden)
            tl.fromTo(
                cardRef.current,
                { x: xStart },
                { x: "0%", duration: 0.9, ease: "power3.out" }
            );

            // Image zooms out simultaneously
            tl.fromTo(
                imgRef.current,
                { scale: 1.2 },
                { scale: 1, duration: 1.1, ease: "power2.out" },
                "<" // start at the same time as the card
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [direction]);

    return (
        <div ref={sectionRef} className={`relative w-full h-[500px] rounded-2xl overflow-hidden ${className}`}>

            {/* Background image — zooms out */}
            <img
                ref={imgRef}
                src={image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Clip wrapper — hides the card until it slides in */}
            <div
                ref={clipRef}
                className={`absolute inset-y-0 ${direction === "left" ? "left-0" : "right-0"} w-full overflow-hidden pointer-events-none`}
            >
                {/* Card — slides in from outside */}
                <div
                    ref={cardRef}
                    className="absolute inset-y-0 left-0 w-full flex items-center pointer-events-auto"
                >
                    <div className={`m-8 rounded-xl p-6 shadow-xl flex flex-col justify-center w-full ${direction === "right" ? "ml-auto" : ""}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}