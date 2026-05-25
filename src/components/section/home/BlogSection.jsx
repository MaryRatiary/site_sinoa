import React from 'react'

/**
 * Bande minimaliste de 60px — actualités/promo discrètes.
 * Remplace l'ancien "Mission Log" trop chargé.
 */
const items = [
  { label: 'Nouveau', text: 'Drop K-Fashion automne disponible' },
  { label: 'Live', text: 'Concert BTS Paris — billetterie jeudi' },
  { label: 'Top', text: 'Golden — Huntrix : version française archivée' },
]

export default function BlogSection() {
  return (
    <section
      className="w-full bg-black text-white border-y border-white/10"
      style={{ height: '60px' }}
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-center md:justify-between gap-4 overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.text}
            className={`flex items-center gap-2 min-w-0 ${
              i > 0 ? 'hidden md:flex' : 'flex'
            }`}
          >
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em] text-purple-400 border border-purple-400/40 rounded-sm px-1.5 py-0.5 flex-shrink-0">
              {item.label}
            </span>
            <span className="text-[11px] md:text-xs text-white/85 truncate">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
