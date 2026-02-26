import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const CountDownCard = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const ref = useScrollAnimation()

  useEffect(() => {
    // Cible : +3 jours et +3 heures
    const target = new Date()
    target.setDate(target.getDate() + 3)
    target.setHours(target.getHours() + 3)

    const tick = () => {
      const diff = target - new Date()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  const units = [
    { value: timeLeft.days,    label: 'Days' },
    { value: timeLeft.hours,   label: 'Hours' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ]

  return (
    <div 
      ref={ref} 
      className="scroll-animate w-full h-[200px] md:h-[45vh] my-6 relative overflow-hidden bg-black group border-y border-red-900/30"
    >
      
      {/* Background Image avec Parallax léger */}
      <img
        src="/horloge.jpg"
        alt="Kpop Demon Hunter"
        className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[3000ms] group-hover:scale-105"
      />

      {/* Overlays Stylisés */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-90" />
      <div className="absolute inset-0 bg-red-950/10 mix-blend-color-dodge" />
      
      {/* Scanlines Cyberpunk (Effet écran) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white px-4">
        
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8">
            <span className="text-red-500 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase animate-pulse block mb-2">
                Mission Status: Active
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight">
                LIVRAISON <br className="block sm:hidden" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-500">GRATUITE</span>
            </h1>
        </div>

        {/* Timer Row */}
        <div className="flex gap-4 sm:gap-10 md:gap-16 items-center justify-center">
          {units.map(({ value, label }, index) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center group/unit">
                <div className="relative">
                    {/* Shadow Glow effet Néon */}
                    <span className="absolute inset-0 text-red-600/40 blur-lg scale-125 group-hover/unit:text-red-500/60 transition-colors">
                        {pad(value)}
                    </span>
                    <span className="relative text-4xl sm:text-5xl md:text-7xl font-black tabular-nums tracking-tighter">
                        {pad(value)}
                    </span>
                </div>
                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500 mt-2">
                    {label}
                </span>
              </div>
              
              {/* Séparateur stylisé (incliné) */}
              {index < units.length - 1 && (
                <div className="h-8 w-[1px] bg-red-600/40 rotate-12" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Line Decor - Hunter Interface */}
        <div className="mt-8 flex items-center gap-4 opacity-40">
            <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-red-600" />
            <span className="text-[9px] tracking-[0.5em] uppercase font-light whitespace-nowrap">Hunter Interface v.2.0</span>
            <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-red-600" />
        </div>
      </div>

      {/* HUD Corner Elements (Angles d'interface) */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-red-600/30" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-red-600/30" />
      
      {/* Glitch Decorative Element (Petite barre latérale) */}
      <div className="absolute right-0 top-1/4 w-1 h-12 bg-red-600/50 shadow-[0_0_10px_red]" />
    </div>
  )
}

export default CountDownCard