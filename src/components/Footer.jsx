import { Facebook, Instagram, Twitter, Youtube, Mail, ChevronRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

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

  return (
    <footer className="bg-[#1a0b16] text-gray-400 border-t border-white/5">
      {/* Newsletter Bar - Mise en avant sur fond contrasté */}
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
              className="flex-1 px-5 py-3 bg-black/30 border border-white/10 rounded-full text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
            />
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-purple-600/20">
              OK
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand/About */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-white tracking-tighter mb-6 italic">HUNTRIX<span className="text-purple-500">.</span></h2>
            <p className="text-sm leading-relaxed mb-6 font-light">
              Ta destination ultime pour tout l'univers K-pop. Qualité premium, style authentique.
            </p>
            <div className="flex justify-center sm:justify-start gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="text-center sm:text-left">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="group flex items-center justify-center sm:justify-start hover:text-white transition-colors duration-200">
                      <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-purple-500 mr-1" />
                      <span className="text-sm">{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[11px] uppercase tracking-widest text-gray-500">
            &copy; {currentYear} Huntrix Boutique. Powered by Passion.
          </div>
          
          {/* Payment Methods - Plus visuels */}
          <div className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
             <div className="px-2 py-1 border border-white/20 rounded text-[10px] font-bold text-white">VISA</div>
             <div className="px-2 py-1 border border-white/20 rounded text-[10px] font-bold text-white">MASTERCARD</div>
             <div className="px-2 py-1 border border-white/20 rounded text-[10px] font-bold text-white">PAYPAL</div>
             <div className="px-2 py-1 border border-white/20 rounded text-[10px] font-bold text-white">APPLE PAY</div>
          </div>
        </div>
      </div>

      {/* Bottom Safety Bar */}
      <div className="bg-black py-2 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">Made with Love for the K-Pop Community</p>
      </div>
    </footer>
  )
}