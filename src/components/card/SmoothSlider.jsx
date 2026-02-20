import { useState } from "react";

const DEFAULT_CARDS = [
  { id: 1, url: "/fashion/t-shirt.jpg", title: "T-Shirt Coréenne" },
  { id: 2, url: "/fashion/pull.jpg", title: "Pull Coréen" },
  { id: 3, url: "/fashion/jupe.JPG", title: "Jupe Coréenne" },
  { id: 4, url: "/fashion/robe1.jpg", title: "Robe Coréenne" },
  { id: 5, url: "/fashion/robe.jpg", title: "Robe Coréenne Élégante" },
];

const VISIBLE = 4;
const GAP = 16; // px — used in the calc() formula only

export default function SmoothSlider({ cards = DEFAULT_CARDS, className = "" }) {
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);

  const maxOffset = cards.length - VISIBLE;

  const go = (next) => {
    if (animating || next < 0 || next > maxOffset) return;
    setAnimating(true);
    setOffset(next);
    setTimeout(() => setAnimating(false), 460);
  };

  // calc() formula can't be expressed in Tailwind — keep this one style
  const translateX = `calc(${offset} * -1 * ((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE} + ${GAP}px))`;

  return (
    <div
      style={{ fontFamily: "'Sora', sans-serif" }}
      className={`flex items-center p-10 min-h-screen ${className}`}
    >
      {/* Only styles that Tailwind cannot express */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600&display=swap');

        /* Card flex-basis needs the same calc() as translateX */
        .slider-card {
          flex: 0 0 calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE});
        }

        /* Hover-reveal for nav buttons — requires :hover on a parent, not the button itself */
        .slider-outer:hover .nav-prev { opacity: 1; transform: translateY(-50%) translateX(0); }
        .slider-outer:hover .nav-next { opacity: 1; transform: translateY(-50%) translateX(0); }
        .slider-outer:hover .nav-btn:disabled { opacity: 0.18; }

        /* Dot width transition (Tailwind can't animate width like this easily) */
        .dot { width: 5px; transition: background 0.28s, width 0.28s cubic-bezier(0.4,0,0.2,1); }
        .dot.on { width: 20px; }
      `}</style>

      <div className="slider-outer relative z-[99] w-[80%] max-w-[900px]" style={{ isolation: "isolate" }}>

        {/* Prev button */}
        <button
          className="nav-btn nav-prev nav-btn absolute top-1/2 left-[-22px] z-20
                     w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer
                     border border-white/[0.13] bg-black/75 backdrop-blur-md
                     opacity-0 -translate-y-1/2 -translate-x-3.5
                     transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                     hover:bg-white/[0.12] hover:border-white/[0.28]
                     disabled:cursor-default"
          onClick={() => go(offset - 1)}
          disabled={offset === 0}
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next button */}
        <button
          className="nav-btn nav-next nav-btn absolute top-1/2 right-[-22px] z-20
                     w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer
                     border border-white/[0.13] bg-black/75 backdrop-blur-md
                     opacity-0 -translate-y-1/2 translate-x-3.5
                     transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                     hover:bg-white/[0.12] hover:border-white/[0.28]
                     disabled:cursor-default"
          onClick={() => go(offset + 1)}
          disabled={offset >= maxOffset}
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Viewport */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex will-change-transform transition-transform duration-[460ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ gap: GAP, transform: `translateX(${translateX})` }}
          >
            {cards.map((card, idx) => (
            <div
              key={card.id ?? idx}
              className={`slider-card relative h-[200px] border border-gray-500 rounded-[13px] overflow-hidden cursor-pointer bg-gradient-to-br
                          transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                          hover:-translate-y-1.5 hover:scale-[1.014] hover:shadow-[0_22px_44px_rgba(0,0,0,0.05)]`}
            >
              {/* Image background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("${card.url}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Card text (only title) */}
              <div className="absolute bottom-0 left-0 right-0 z-[2] p-5">
                <div className="text-[1.05rem] font-semibold text-white">{card.title}</div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button
              key={i}
              className={`dot h-[5px] rounded-[3px] cursor-pointer border-0 p-0
                          ${i === offset ? "on bg-white/85" : "bg-white/[0.18]"}`}
              onClick={() => go(i)}
              aria-label={`Go to position ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}