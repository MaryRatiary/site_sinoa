import React, { useState, useEffect } from 'react'

const CountDownCard = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

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
    <div className="w-screen h-[70vh] my-10 relative">
      {/* Background image */}
      <img
        src="/huntrix/livraison.jpg"
        alt="Kpop Demon"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white text-center px-4">
        <h1 className="text-5xl font-semibold tracking-widest mb-10">
          Aujourd'hui Livraison Gratuite
        </h1>

        <div className="flex gap-6 sm:gap-12">
          {units.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-5xl sm:text-6xl font-bold tabular-nums">
                {pad(value)}
              </span>
              <span className="text-xs sm:text-sm uppercase tracking-widest text-white/70">
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