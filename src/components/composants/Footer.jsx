import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Facebook,
  Instagram,
  Youtube,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

/**
 * Footer : design sombre Huntrix (newsletter + 3 cols + paiements)
 * Contenu inspiré de boutique-kpop.fr (Informations + "Notre boutique c'est")
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [openSection, setOpenSection] = useState(null)

  const sections = [
    {
      title: 'Informations',
      links: [
        { label: 'FAQ', to: '/pages/faq' },
        { label: 'Livraisons', to: '/pages/livraisons' },
        { label: 'CGV', to: '/pages/cgv' },
        { label: 'Politique de retours', to: '/pages/retours' },
        { label: 'Politique de confidentialité', to: '/pages/confidentialite' },
        { label: 'Mentions légales', to: '/pages/mentions-legales' },
        { label: 'Suivi de colis', to: '/pages/suivi-colis' },
        { label: 'Plan du site', to: '/pages/plan-du-site' },
      ],
    },
    {
      title: "Notre boutique c'est",
      lines: [
        'Un support client français très réactif',
        'Des livraisons gratuites avec un suivi colis',
        'Des paiements en ligne 100% sécurisés',
        'Une option d\'achat satisfait ou remboursé',
      ],
    },
  ]

  const paymentLogos = [
    { name: 'Visa', src: '/paiement/Visa.svg' },
    { name: 'Mastercard', src: '/paiement/masstercard.svg' },
    { name: 'American Express', src: '/paiement/amex.svg' },
    { name: 'PayPal', src: '/paiement/Shop.svg' },
    { name: 'Apple Pay', src: '/paiement/applepay.svg' },
    { name: 'Google Pay', src: '/paiement/Gpay.svg' },
    { name: 'Bancontact', src: '/paiement/bancontact.svg' },
    { name: 'UnionPay', src: '/paiement/unionPay.svg' },
  ]

  const toggleSection = (title) => {
    if (window.innerWidth < 1024) {
      setOpenSection(openSection === title ? null : title)
    }
  }

  return (
    <footer className="bg-[#1a0b16] text-gray-400 border-t border-white/5">
      {/* Newsletter Bar */}
      <div className="bg-[#2d0f26] py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h3 className="text-white font-black text-2xl tracking-tight uppercase">
              Rejoins la Fanbase
            </h3>
            <p className="text-gray-400 text-sm mt-1 font-light">
              10% de réduction sur ta première commande K-pop.
            </p>
          </div>
          <form className="flex w-full lg:w-auto max-w-md gap-2">
            <input
              type="email"
              placeholder="Ton email secret..."
              className="flex-1 px-5 py-3 bg-black/30 border border-white/10 rounded-full text-white focus:outline-none focus:border-purple-500 text-sm"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full transition-all"
            >
              OK
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Brand */}
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-2xl font-black text-white tracking-tighter mb-4 italic">
              HUNTRIX<span className="text-purple-500">.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-6 font-light max-w-xs mx-auto lg:mx-0">
              Ta destination ultime pour tout l'univers K-pop. Qualité premium.
            </p>
            <SocialIcons />
          </div>

          {/* Informations (liens) */}
          <div className="border-b border-white/5 lg:border-none lg:col-span-1">
            <button
              onClick={() => toggleSection('Informations')}
              className="w-full py-4 lg:py-0 flex items-center justify-between lg:cursor-default"
            >
              <h3 className="text-white font-bold text-sm uppercase tracking-widest lg:mb-6">
                Informations
              </h3>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 lg:hidden ${
                  openSection === 'Informations' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === 'Informations'
                  ? 'max-h-[500px] pb-6'
                  : 'max-h-0 lg:max-h-full'
              }`}
            >
              {sections[0].links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center hover:text-white transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-purple-500 mr-1"
                    />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Notre boutique c'est */}
          <div className="border-b border-white/5 lg:border-none lg:col-span-2">
            <button
              onClick={() => toggleSection("Notre boutique c'est")}
              className="w-full py-4 lg:py-0 flex items-center justify-between lg:cursor-default"
            >
              <h3 className="text-white font-bold text-sm uppercase tracking-widest lg:mb-6">
                Notre boutique c'est
              </h3>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 lg:hidden ${
                  openSection === "Notre boutique c'est" ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === "Notre boutique c'est"
                  ? 'max-h-[500px] pb-6'
                  : 'max-h-0 lg:max-h-full'
              }`}
            >
              {sections[1].lines.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                >
                  <span className="text-purple-500 mt-1.5 w-1 h-1 rounded-full bg-purple-500 flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[11px] uppercase tracking-widest text-gray-500 text-center md:text-left order-3 md:order-1">
            &copy; {currentYear}{' '}
            <Link to="/" className="hover:text-white transition">
              Huntrix Boutique
            </Link>
            . Tous droits réservés.
          </div>

          {/* Devise — visuel only */}
          <div className="text-[11px] uppercase tracking-widest text-gray-500 order-2">
            France (EUR €)
          </div>

          {/* Paiements */}
          <div className="flex flex-col items-center gap-2 order-1 md:order-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Paiements acceptés
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {paymentLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="bg-white/5 rounded-lg p-2 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                  title={logo.name}
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-5 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tagline bottom */}
      <div className="bg-black py-2 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">
          Made for the K-Pop Community
        </p>
      </div>
    </footer>
  )
}

/**
 * Icônes réseaux sociaux — style sombre avec hover violet
 * Liens à personnaliser avec les vrais comptes
 */
function SocialIcons() {
  const socials = [
    { name: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram },
    { name: 'Facebook', href: 'https://www.facebook.com/', Icon: Facebook },
    { name: 'YouTube', href: 'https://www.youtube.com/', Icon: Youtube },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/',
      Icon: ({ size }) => (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex justify-center lg:justify-start gap-4">
      {socials.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  )
}
