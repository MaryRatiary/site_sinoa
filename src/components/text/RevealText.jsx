// RevealText.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RevealText({ children, className = "", delay = 0 }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    const container = containerRef.current;

    gsap.fromTo(
      el,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%", // fires when top of container hits 85% down viewport
          toggleActions: "play none none none", // play once
        },
      }
    );
  }, [delay]);

  return (
    // overflow-hidden clips the text animating up from below
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <span ref={textRef} className="block will-change-transform">
        {children}
      </span>
    </div>
  );
}