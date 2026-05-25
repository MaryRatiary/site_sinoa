import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const transmissions = [
  {
    id: "TX-001",
    code: "BTS_PARIS_2026",
    tag: "LIVE EVENT",
    korean: "공연 알림",
    threatLevel: 87,
    eta: "03d 02h",
    title: "BTS // Paris Drop Confirmed",
    excerpt:
      "Phase 02 // Stade de France lockdown. Hunter pass required. Ticketing window opens this thursday — fanbase extraction imminent.",
    slug: "bts-stade-de-france-2026",
    image: "/menu/blog/paris-concert.webp",
    accent: "#b35fc2",
    status: "ACTIVE",
  },
  {
    id: "TX-002",
    code: "ORELSAN_X_FF",
    tag: "DECODED",
    korean: "가사 해독",
    threatLevel: 64,
    eta: "STREAM",
    title: "Oualalala // OrelSan × FIFTY FIFTY",
    excerpt:
      "Signal intercepted. Cross-genre crossover decoded — lyric archives synced to the Hunter database. Replay authorized.",
    slug: "orelsan-fifty-fifty-oualalala",
    image: "/menu/blog/orlesan-lyrics.webp",
    accent: "#5fc2b3",
    status: "DECODED",
  },
  {
    id: "TX-003",
    code: "GOLDEN_BRILLER",
    tag: "ARCHIVE",
    korean: "헌트릭스",
    threatLevel: 99,
    eta: "ETERNAL",
    title: "Golden // 'Briller' — Huntrix",
    excerpt:
      "Anthem locked. French translation archived. Threat resonance: maximum. Play loud, hunt harder.",
    slug: "huntrix-briller-paroles-fr",
    image: "/menu/blog/golden.png",
    accent: "#ffb84d",
    status: "LEGENDARY",
  },
];

const BlogSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const countersRef = useRef([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 80, opacity: 0, rotateX: 12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      countersRef.current.forEach((el, i) => {
        if (!el) return;
        const target = transmissions[i].threatLevel;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toString().padStart(3, "0");
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const timeStr = now.toTimeString().slice(0, 8);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(179,95,194,0.12) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(0,28,102,0.18) 0%, transparent 50%), #0a0a14",
      }}
    >
      {/* Scanlines overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, #fff 2px, #fff 3px)",
        }}
      />
      {/* Grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="relative flex h-2.5 w-2.5"
                aria-hidden
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <p
                className="text-[10px] tracking-[0.4em] uppercase text-red-400"
                style={{ fontFamily: "monospace" }}
              >
                LIVE FEED · 실시간
              </p>
            </div>
            <h2
              className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              Mission <span style={{ color: "#b35fc2" }}>Log</span>
              <span className="inline-block w-2 h-8 md:h-10 ml-2 align-middle bg-white animate-pulse" />
            </h2>
            <p
              className="text-xs text-white/40 mt-2 tracking-widest uppercase"
              style={{ fontFamily: "monospace" }}
            >
              헌트릭스 작전 기록 // Latest Transmissions
            </p>
          </div>
          <div
            className="text-right text-[11px] text-white/50 leading-relaxed"
            style={{ fontFamily: "monospace" }}
          >
            <div>SYS::CLK <span className="text-white">{timeStr}</span></div>
            <div>NET::<span className="text-green-400">ONLINE</span></div>
            <div>CH::<span className="text-[#b35fc2]">HUNTRIX-01</span></div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {transmissions.map((t, i) => (
            <a
              key={t.id}
              href={`/blog/${t.slug}`}
              ref={(el) => (cardsRef.current[i] = el)}
              className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:border-white/40 hover:-translate-y-2"
              style={{ perspective: "1000px" }}
            >
              {/* Accent glow */}
              <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${t.accent} 0%, transparent 60%)`,
                  filter: "blur(20px)",
                }}
              />

              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={t.image}
                  alt={t.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div
                  className="absolute inset-0 mix-blend-overlay"
                  style={{
                    background: `linear-gradient(180deg, transparent 30%, ${t.accent}40 100%)`,
                  }}
                />
                {/* HUD corner brackets */}
                <span
                  className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2"
                  style={{ borderColor: t.accent }}
                  aria-hidden
                />
                <span
                  className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2"
                  style={{ borderColor: t.accent }}
                  aria-hidden
                />
                <span
                  className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2"
                  style={{ borderColor: t.accent }}
                  aria-hidden
                />
                <span
                  className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2"
                  style={{ borderColor: t.accent }}
                  aria-hidden
                />

                {/* Glitch scan bar */}
                <div
                  aria-hidden
                  className="absolute left-0 right-0 h-px opacity-0 group-hover:opacity-100"
                  style={{
                    background: t.accent,
                    boxShadow: `0 0 12px ${t.accent}`,
                    animation: "hunter-scan 1.8s linear infinite",
                  }}
                />

                {/* Tag */}
                <div className="absolute top-3 right-3">
                  <span
                    className="text-[9px] font-bold tracking-[0.2em] px-2 py-1 rounded-sm backdrop-blur-md"
                    style={{
                      background: `${t.accent}30`,
                      color: t.accent,
                      border: `1px solid ${t.accent}80`,
                      fontFamily: "monospace",
                    }}
                  >
                    {t.tag}
                  </span>
                </div>

                {/* ID */}
                <div
                  className="absolute bottom-3 left-3 text-[10px] text-white/80 tracking-widest"
                  style={{ fontFamily: "monospace" }}
                >
                  {t.id} · {t.korean}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: "monospace" }}>
                  <span>{t.code}</span>
                  <span style={{ color: t.accent }}>● {t.status}</span>
                </div>

                <h3
                  className="text-lg font-bold text-white leading-tight transition-colors duration-300"
                  style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                  {t.title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                  {t.excerpt}
                </p>

                {/* Stats row */}
                <div className="pt-3 mt-3 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <div
                      className="text-[9px] uppercase tracking-[0.25em] text-white/40 mb-1"
                      style={{ fontFamily: "monospace" }}
                    >
                      Threat Lvl
                    </div>
                    <div
                      ref={(el) => (countersRef.current[i] = el)}
                      className="text-2xl font-black tabular-nums"
                      style={{
                        color: t.accent,
                        fontFamily: "'Archivo Black', sans-serif",
                        textShadow: `0 0 20px ${t.accent}80`,
                      }}
                    >
                      000
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[9px] uppercase tracking-[0.25em] text-white/40 mb-1"
                      style={{ fontFamily: "monospace" }}
                    >
                      ETA
                    </div>
                    <div
                      className="text-sm text-white/90 font-bold"
                      style={{ fontFamily: "monospace" }}
                    >
                      {t.eta}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div
                  className="flex items-center justify-between pt-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 group-hover:translate-x-1"
                  style={{ fontFamily: "monospace", color: t.accent }}
                >
                  <span>Decode Signal</span>
                  <span className="text-base">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer marquee */}
        <div className="mt-10 overflow-hidden border-t border-b border-white/10 py-3">
          <div
            className="flex gap-12 whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-white/40"
            style={{
              fontFamily: "monospace",
              animation: "hunter-marquee 30s linear infinite",
            }}
          >
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0">
                <span>● Hunt or be hunted</span>
                <span style={{ color: "#b35fc2" }}>◆ 헌트릭스 작전 진행 중</span>
                <span>● Demon archives synced</span>
                <span style={{ color: "#5fc2b3" }}>◆ Signal strength 99%</span>
                <span>● Stay sharp, hunter</span>
                <span style={{ color: "#ffb84d" }}>◆ Phase 02 active</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hunter-scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes hunter-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default BlogSection;
