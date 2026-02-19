import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">À Propos</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition">Qui sommes-nous ?</a></li>
              <li><a href="#" className="hover:text-white transition">Notre Histoire</a></li>
              <li><a href="#" className="hover:text-white transition">Carrières</a></li>
              <li><a href="#" className="hover:text-white transition">Presse</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Service Client</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Livraison</a></li>
              <li><a href="#" className="hover:text-white transition">Retours & Échanges</a></li>
              <li><a href="#" className="hover:text-white transition">Politique de Confidentialité</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Informations</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition">Conditions Générales</a></li>
              <li><a href="#" className="hover:text-white transition">Mentions Légales</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Newsletter</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-sm mb-4">Abonnez-vous pour recevoir nos dernières actualités K-pop !</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
              <button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Social & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-400">
            <p>&copy; {currentYear} KPOP Boutique. Tous droits réservés.</p>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 mt-6 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition" title="Facebook">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition" title="Instagram">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition" title="Twitter">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition" title="Youtube">
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>Nous acceptons : Carte Bancaire • PayPal • Virement Bancaire • Apple Pay • Google Pay</p>
        </div>
      </div>
    </footer>
  )
}
