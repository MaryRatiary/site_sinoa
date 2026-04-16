import React, { useState } from 'react'
import { Facebook, Instagram, Twitter, Youtube, ChevronDown, ChevronRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [openSection, setOpenSection] = useState(null)

  const footerLinks = [
    {
      title: "À Propos",
      links: ["Qui sommes-nous ?", "Notre Histoire", "Carrières", "Presse"]
    },
    {
      title: "Service Client",
      links: ["Contact", "FAQ", "Livraison", "Retours & Échanges", "Confidentialité"]
    },
    {
      title: "Informations",
      links: ["Conditions Générales", "Mentions Légales", "Blog", "Newsletter"]
    }
  ]

  const toggleSection = (title) => {
    // On ne toggle que sur mobile (en dessous de 1024px par exemple)
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
            <h3 className="text-white font-black text-2xl tracking-tight uppercase">Rejoins la Fanbase</h3>
            <p className="text-gray-400 text-sm mt-1 font-light">10% de réduction sur ta première commande K-pop.</p>
          </div>
          <form className="flex w-full lg:w-auto max-w-md gap-2">
            <input 
              type="email" 
              placeholder="Ton email secret..." 
              className="flex-1 px-5 py-3 bg-black/30 border border-white/10 rounded-full text-white focus:outline-none focus:border-purple-500 text-sm"
            />
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full transition-all">
              OK
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          
          {/* Brand/About - Toujours visible */}
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-2xl font-black text-white tracking-tighter mb-4 italic">HUNTRIX<span className="text-purple-500">.</span></h2>
            <p className="text-sm leading-relaxed mb-6 font-light max-w-xs mx-auto lg:mx-0">
              Ta destination ultime pour tout l'univers K-pop. Qualité premium.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Menus Déroulants (Accordéons sur Mobile) */}
          {footerLinks.map((section) => (
            <div key={section.title} className="border-b border-white/5 lg:border-none">
              <button 
                onClick={() => toggleSection(section.title)}
                className="w-full py-4 lg:py-0 flex items-center justify-between lg:cursor-default"
              >
                <h3 className="text-white font-bold text-sm uppercase tracking-widest lg:mb-6">
                  {section.title}
                </h3>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 lg:hidden ${openSection === section.title ? 'rotate-180' : ''}`} 
                />
              </button>

              <ul className={`
                space-y-4 overflow-hidden transition-all duration-300 ease-in-out
                ${openSection === section.title ? 'max-h-60 pb-6' : 'max-h-0 lg:max-h-full'}
              `}>
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="group flex items-center hover:text-white transition-colors">
                      <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-purple-500 mr-1" />
                      <span className="text-sm">{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center">
          <div className="text-[11px] uppercase tracking-widest text-gray-500">
            &copy; {currentYear} Huntrix Boutique.
          </div>
          <div className="flex items-center gap-3 grayscale opacity-40">
             <div className="px-2 py-1 border border-white/20 rounded text-[10px] font-bold text-white">VISA</div>
             <div className="px-2 py-1 border border-white/20 rounded text-[10px] font-bold text-white">PAYPAL</div>
          </div>
        </div>
      </div>

      <div className="bg-black py-2 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">Made for the K-Pop Community</p>
      </div>
    </footer>
  )
}