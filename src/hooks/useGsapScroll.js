import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGsapScroll = (config = {}) => {
  const ref = useRef(null);
  const {
    duration = 0.8,
    delay = 0,
    yFrom = 60,
    opacityFrom = 0,
    stagger = 0.1,
    ease = 'power3.out',
    markers = false,
  } = config;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Animation d'apparition au scroll
    gsap.fromTo(
      element,
      {
        y: yFrom,
        opacity: opacityFrom,
      },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 50%',
          scrub: false,
          markers,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [duration, delay, yFrom, opacityFrom, ease, markers]);

  return ref;
};
