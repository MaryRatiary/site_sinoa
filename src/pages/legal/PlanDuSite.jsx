import React from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  ShoppingBag,
  TrendingUp,
  Search,
  User,
  Package,
  FileText,
  Mail,
} from 'lucide-react'
import LegalPage from './LegalPage'

const sitemap = [
  {
    icon: <Home size={18} />,
    title: 'Boutique',
    description: 'Explorez notre catalogue K-pop complet',
    links: [
      { label: "Page d'accueil", to: '/' },
      { label: 'Toute la boutique', to: '/shop' },
      { label: 'Best-sellers du moment', to: '/best-sellers' },
      { label: 'Recherche', to: '/search' },
    ],
  },
  {
    icon: <ShoppingBag size={18} />,
    title: 'Catégories',
    description: 'Naviguez par univers K-pop',
    links: [
      { label: 'Lightsticks', to: '/staticcategory/lightstick' },
      { label: 'Huntrix', to: '/staticcategory/huntrix' },
      { label: 'K-Beauty', to: '/staticcategory/k-beauty' },
      { label: 'K-Fashion', to: '/staticcategory/k-fashion' },
      { label: 'K-Style', to: '/staticcategory/k-style' },
      { label: 'Groupes', to: '/staticcategory/groupes' },
    ],
  },
  {
    icon: <User size={18} />,
    title: 'Mon compte',
    description: 'Accédez à votre espace personnel',
    links: [
      { label: 'Se connecter', to: '/login' },
      { label: 'Créer un compte', to: '/register' },
      { label: 'Mes commandes', to: '/orders' },
    ],
  },
  {
    icon: <Package size={18} />,
    title: 'Commandes & livraison',
    description: 'Tout sur vos achats',
    links: [
      { label: 'Suivi de colis', to: '/pages/suivi-colis' },
      { label: 'Informations livraison', to: '/pages/livraisons' },
      { label: 'Politique de retours', to: '/pages/retours' },
    ],
  },
  {
    icon: <FileText size={18} />,
    title: 'Informations légales',
    description: 'Documents officiels & confidentialité',
    links: [
      { label: 'Conditions générales de vente', to: '/pages/cgv' },
      { label: 'Mentions légales', to: '/pages/mentions-legales' },
      { label: 'Politique de confidentialité', to: '/pages/confidentialite' },
    ],
  },
  {
    icon: <Mail size={18} />,
    title: 'Service client',
    description: 'On répond à vos questions',
    links: [
      { label: 'Foire aux questions', to: '/pages/faq' },
      { label: 'Suivi de colis', to: '/pages/suivi-colis' },
    ],
  },
]

export default function PlanDuSite() {
  return (
    <LegalPage title="Plan du site" breadcrumb="Plan du site">
      <p className="lead text-gray-600 mb-8">
        Retrouvez ici toutes les pages de la boutique Huntrix organisées par
        thématique. Utile pour naviguer rapidement ou pour les moteurs de
        recherche.
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
        {sitemap.map((section) => (
          <section
            key={section.title}
            className="border border-gray-200 rounded-xl p-5 hover:border-[#5E2251]/30 hover:shadow-sm transition"
          >
            <header className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-[#5E2251]/10 text-[#5E2251] flex items-center justify-center flex-shrink-0">
                {section.icon}
              </div>
              <h2 className="text-base font-semibold text-gray-900 m-0">
                {section.title}
              </h2>
            </header>
            <p className="text-xs text-gray-500 mb-4 ml-12">
              {section.description}
            </p>
            <ul className="space-y-2 ml-12">
              {section.links.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-700 hover:text-[#5E2251] hover:underline underline-offset-2 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2>Vous ne trouvez pas ce que vous cherchez ?</h2>
      <p>
        La <Link to="/search">recherche</Link> vous permet de retrouver un
        produit par nom de groupe (BTS, BLACKPINK, Huntrix…) ou par type
        (lightstick, photocard, poster).
      </p>
      <p>
        Pour toute autre question, consultez notre{' '}
        <Link to="/pages/faq">FAQ</Link> ou contactez-nous via l'email
        affiché en pied de page.
      </p>

      <h2>Pour les moteurs de recherche</h2>
      <p className="text-sm text-gray-600">
        Un sitemap XML automatique est disponible à l'adresse{' '}
        <code>/sitemap.xml</code>, généré par Shopify et mis à jour à chaque
        nouvelle commande ou produit.
      </p>
    </LegalPage>
  )
}
