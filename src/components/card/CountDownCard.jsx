import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const CountDownCard = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const ref = useScrollAnimation()

  const fontTitle = "'Archivo Black', sans-serif";
  const fontHunter = "'Cinzel', serif";

  useEffect(() => {
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
    { value: timeLeft.days,    label: 'DAYS' },
    { value: timeLeft.hours,   label: 'HOURS' },
    { value: timeLeft.minutes, label: 'MIN' },
    { value: timeLeft.seconds, label: 'SEC' },
  ]

  return (
    <div 
      ref={ref} 
      className="scroll-animate w-full relative overflow-hidden bg-white- border-y border-gray-100 flex items-center"
      style={{ height: '130px' }}
    >
      
      {/* Background Image (Filigrane très léger) */}
      <img
        src="/horloge.jpg"
        alt="Kpop Demon Hunter"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.03] grayscale"
      />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between z-10">
        
        {/* Titre Mission - Style Huntrix Light */}
        <div className="flex flex-col items-center md:items-start mb-2 md:mb-0">
            <span className="text-[#b35fc2] text-[10px] font-black tracking-[0.3em] uppercase block mb-1" style={{ fontFamily: fontHunter }}>
                Free Extraction Delivery
            </span>
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase text-gray-900 leading-none" style={{ fontFamily: fontTitle }}>
                HUNTRIX <span style={{ color: '#b35fc2' }}>STATUS</span>
            </h1>
        </div>

        {/* Timer Row - Design Compact et Médical */}
        <div className="flex gap-4 sm:gap-8 md:gap-12 items-center">
          {units.map(({ value, label }, index) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-black tabular-nums text-gray-900 leading-none" style={{ fontFamily: fontTitle }}>
                    {pad(value)}
                </span>
                <span className="text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-gray-400 mt-1" style={{ fontFamily: fontHunter }}>
                    {label}
                </span>
              </div>
              
              {index < units.length - 1 && (
                <div className="h-6 w-[1.5px] bg-gray-100 rotate-[20deg]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Status Badge (Desktop only) */}
        <div className="hidden lg:flex items-center gap-3 border-l border-gray-100 pl-8">
            <div className="text-right">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Voucher</p>
                <p className="text-[10px] font-black text-[#b35fc2] uppercase">Applied</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b35fc2] shadow-[0_0_8px_#b35fc2]" />
            </div>
        </div>
      </div>

      {/* Barre tactique violette fine en bas */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#b35fc2] to-transparent opacity-20" />
    </div>
  )
}

export default CountDownCard