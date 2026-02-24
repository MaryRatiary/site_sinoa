import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const CountDownCard = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const ref = useScrollAnimation()

  useEffect(() => {
    // Target = now + 3 days + 3 hours
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

    tick() // run immediately so there's no 1s flash of zeros
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  const units = [
    { value: timeLeft.days,    label: 'Jours' },
    { value: timeLeft.hours,   label: 'Heures' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Secondes' },
  ]

  return (
    <div ref={ref} className="scroll-animate w-full h-64 sm:h-80 md:h-96 lg:h-[70vh] my-6 sm:my-8 md:my-10 relative">
      {/* Background image */}
      <img
        src="/horloge.jpg"
        alt="Kpop Demon - Livraison Gratuite"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-widest mb-6 sm:mb-8 md:mb-10">
          Aujourd'hui Livraison Gratuite
        </h1>

        <div className="flex gap-3 sm:gap-6 md:gap-8 lg:gap-12">
          {units.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tabular-nums">
                {pad(value)}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-white/70">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CountDownCard