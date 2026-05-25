import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

/**
 * Footer inspiré du design de boutique-kpop.fr
 * - Palette violet aubergine #5E2251
 * - 3 colonnes desktop, accordéons mobile
 * - Bottom bar : devise + copyright + paiements
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
      content: (
        <ul className="space-y-4 text-sm leading-relaxed">
          <li>Un support client français très réactif</li>
          <li>Des livraisons gratuites avec un suivi colis</li>
          <li>Des paiements en ligne 100% sécurisés</li>
          <li>Une option d'achat satisfait ou remboursé</li>
        </ul>
      ),
    },
    {
      title: 'Suivez-nous',
      content: <SocialIcons />,
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

  const toggle = (title) => {
    if (window.innerWidth < 768) {
      setOpenSection(openSection === title ? null : title)
    }
  }

  return (
    <footer
      className="text-white"
      style={{ backgroundColor: 'rgb(94, 34, 81)' }}
    >
      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-6 md:pt-14 pb-4 md:pb-7 md:border-b md:border-white/10">
        <div className="flex flex-wrap md:gap-x-10">
          {sections.map((section) => {
            const isOpen = openSection === section.title
            return (
              <div
                key={section.title}
                className="w-full md:w-1/3 md:pr-5 md:mb-6 border-b border-white/15 md:border-none py-4 md:py-0"
              >
                {/* Titre (cliquable sur mobile) */}
                <button
                  type="button"
                  onClick={() => toggle(section.title)}
                  className="w-full flex items-center justify-between md:cursor-default"
                  aria-expanded={isOpen}
                >
                  <h2 className="text-[1.05rem] md:text-base font-semibold tracking-wide">
                    {section.title}
                  </h2>
                  <ChevronDown
                    size={18}
                    className={`md:hidden transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Contenu : visible desktop, accordéon mobile */}
                <div
                  className={`md:block md:mt-6 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] mt-6' : 'max-h-0 md:max-h-none'
                  }`}
                >
                  {section.links ? (
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.to}
                            className="text-sm text-white/85 hover:text-white hover:underline underline-offset-4 transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    section.content
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* BOTTOM BAR : devise, copyright, paiements */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Devise (placeholder, non fonctionnel pour l'instant) */}
        <div className="text-sm text-white/85 order-2 md:order-1">
          France (EUR €)
        </div>

        {/* Copyright */}
        <div className="text-sm text-center order-3 md:order-2">
          &copy; {currentYear},{' '}
          <Link to="/" className="hover:underline underline-offset-4">
            Huntrix Boutique
          </Link>
          .
        </div>

        {/* Logos de paiement */}
        <ul className="flex flex-wrap justify-center gap-1.5 order-1 md:order-3">
          {paymentLogos.map((logo) => (
            <li key={logo.name} className="bg-white/10 rounded-md p-1">
              <img
                src={logo.src}
                alt={logo.name}
                title={logo.name}
                className="h-5 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

/**
 * Icônes réseaux sociaux — links à adapter (Instagram/TikTok/YouTube en priorité K-pop)
 */
function SocialIcons() {
  const socials = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/',
      path: (
        <>
          <path d="M12.0059 3.80184C14.6793 3.80184 14.9959 3.81356 16.0473 3.86046C17.0244 3.90346 17.5521 4.06762 17.9038 4.20442C18.369 4.38421 18.7051 4.60309 19.053 4.95095C19.4047 5.30272 19.6197 5.63494 19.7995 6.10006C19.9363 6.45183 20.1004 6.98339 20.1434 7.95661C20.1903 9.01192 20.2021 9.32851 20.2021 11.998C20.2021 14.6715 20.1903 14.9881 20.1434 16.0395C20.1004 17.0166 19.9363 17.5443 19.7995 17.896C19.6197 18.3612 19.4008 18.6973 19.053 19.0451C18.7012 19.3969 18.369 19.6119 17.9038 19.7917C17.5521 19.9285 17.0205 20.0926 16.0473 20.1356C14.992 20.1825 14.6754 20.1943 12.0059 20.1943C9.33242 20.1943 9.01583 20.1825 7.96443 20.1356C6.9873 20.0926 6.45964 19.9285 6.10788 19.7917C5.64276 19.6119 5.30662 19.393 4.95876 19.0451C4.607 18.6934 4.39203 18.3612 4.21223 17.896C4.07543 17.5443 3.91128 17.0127 3.86828 16.0395C3.82138 14.9842 3.80965 14.6676 3.80965 11.998C3.80965 9.3246 3.82138 9.00801 3.86828 7.95661C3.91128 6.97948 4.07543 6.45183 4.21223 6.10006C4.39203 5.63494 4.6109 5.29881 4.95876 4.95095C5.31053 4.59918 5.64276 4.38421 6.10788 4.20442C6.45964 4.06762 6.99121 3.90346 7.96443 3.86046C9.01583 3.81356 9.33242 3.80184 12.0059 3.80184ZM12.0059 2C9.28943 2 8.94938 2.01173 7.88235 2.05863C6.81923 2.10553 6.08833 2.27751 5.45515 2.52374C4.79461 2.78171 4.23569 3.12175 3.68067 3.68067C3.12175 4.23568 2.78171 4.79461 2.52374 5.45124C2.27751 6.08833 2.10553 6.81532 2.05863 7.87844C2.01173 8.94938 2 9.28943 2 12.0059C2 14.7223 2.01173 15.0623 2.05863 16.1294C2.10553 17.1925 2.27751 17.9234 2.52374 18.5566C2.78171 19.2171 3.12175 19.776 3.68067 20.3311C4.23569 20.8861 4.79461 21.23 5.45124 21.4841C6.08833 21.7303 6.81532 21.9023 7.87844 21.9492C8.94548 21.9961 9.28552 22.0078 12.002 22.0078C14.7184 22.0078 15.0584 21.9961 16.1255 21.9492C17.1886 21.9023 17.9195 21.7303 18.5527 21.4841C19.2093 21.23 19.7682 20.8861 20.3232 20.3311C20.8782 19.776 21.2222 19.2171 21.4763 18.5605C21.7225 17.9234 21.8945 17.1964 21.9414 16.1333C21.9883 15.0663 22 14.7262 22 12.0098C22 9.29334 21.9883 8.95329 21.9414 7.88626C21.8945 6.82314 21.7225 6.09224 21.4763 5.45906C21.23 4.79461 20.89 4.23568 20.3311 3.68067C19.776 3.12566 19.2171 2.78171 18.5605 2.52765C17.9234 2.28141 17.1964 2.10944 16.1333 2.06254C15.0623 2.01173 14.7223 2 12.0059 2Z" fill="currentColor"/>
          <path d="M12.0058 6.86618C9.16822 6.86618 6.86609 9.16831 6.86609 12.0059C6.86609 14.8435 9.16822 17.1456 12.0058 17.1456C14.8434 17.1456 17.1455 14.8435 17.1455 12.0059C17.1455 9.16831 14.8434 6.86618 12.0058 6.86618ZM12.0058 15.3399C10.1649 15.3399 8.67183 13.8468 8.67183 12.0059C8.67183 10.165 10.1649 8.67193 12.0058 8.67193C13.8467 8.67193 15.3398 10.165 15.3398 12.0059C15.3398 13.8468 13.8467 15.3399 12.0058 15.3399Z" fill="currentColor"/>
          <path d="M18.5488 6.66291C18.5488 7.32736 18.0094 7.86283 17.3488 7.86283C16.6844 7.86283 16.1489 7.32345 16.1489 6.66291C16.1489 5.99845 16.6883 5.46298 17.3488 5.46298C18.0094 5.46298 18.5488 6.00236 18.5488 6.66291Z" fill="currentColor"/>
        </>
      ),
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/',
      path: (
        <path
          d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"
          fill="currentColor"
        />
      ),
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/',
      path: (
        <path
          d="M23.0226 7.45237C23.0226 7.45237 22.8005 5.88392 22.1162 5.19522C21.2498 4.28881 20.2812 4.28437 19.8369 4.23105C16.6555 4 11.8791 4 11.8791 4H11.8702C11.8702 4 7.09372 4 3.91239 4.23105C3.46806 4.28437 2.49944 4.28881 1.63302 5.19522C0.948764 5.88392 0.731047 7.45237 0.731047 7.45237C0.731047 7.45237 0.5 9.29631 0.5 11.1358V12.8598C0.5 14.6992 0.726604 16.5432 0.726604 16.5432C0.726604 16.5432 0.948764 18.1116 1.62858 18.8003C2.495 19.7067 3.63246 19.6756 4.13899 19.7734C5.96071 19.9467 11.8746 20 11.8746 20C11.8746 20 16.6555 19.9911 19.8369 19.7645C20.2812 19.7112 21.2498 19.7067 22.1162 18.8003C22.8005 18.1116 23.0226 16.5432 23.0226 16.5432C23.0226 16.5432 23.2492 14.7037 23.2492 12.8598V11.1358C23.2492 9.29631 23.0226 7.45237 23.0226 7.45237ZM9.52416 14.9525V8.55873L15.6691 11.7667L9.52416 14.9525Z"
          fill="currentColor"
        />
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/',
      path: (
        <path
          d="M17.2788 13.2489L17.8494 9.63111H14.2846V7.28444C14.2846 6.29333 14.7822 5.32889 16.3797 5.32889H18V2.24444C18 2.24444 16.5303 2 15.1199 2C12.1851 2 10.2635 3.73333 10.2635 6.87111V9.63111H7V13.2489H10.2635V22H14.2801V13.2489H17.2788Z"
          fill="currentColor"
        />
      ),
    },
    {
      name: 'Twitter',
      href: 'https://x.com/',
      path: (
        <path
          d="M17.7512 3H20.818L14.1179 10.6246L22 21H15.8284L10.9946 14.7074L5.46359 21H2.39494L9.5613 12.8446L2 3H8.32828L12.6976 8.75169L17.7512 3ZM16.6748 19.1723H18.3742L7.4049 4.73169H5.58133L16.6748 19.1723Z"
          fill="currentColor"
        />
      ),
    },
  ]

  return (
    <ul className="flex flex-wrap gap-2.5">
      {socials.map((social) => (
        <li key={social.name}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="flex w-10 h-10 items-center justify-center rounded-full border border-white/40 hover:bg-white hover:text-[#5E2251] transition-all"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {social.path}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
