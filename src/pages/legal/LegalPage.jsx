import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Footer from '../../components/composants/Footer'

/**
 * Layout réutilisable pour les pages "statiques" (CGV, FAQ, etc.)
 * Inspiré de la mise en page boutique-kpop.fr : breadcrumb + titre + contenu RTE.
 */
export default function LegalPage({ title, breadcrumb, children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Breadcrumb */}
      <nav
        className="bg-[#f2f2f2] py-3 text-sm"
        aria-label="Fil d'Ariane"
      >
        <div className="max-w-5xl mx-auto px-5 md:px-8 flex items-center gap-2 text-gray-700">
          <Link to="/" className="hover:underline">Accueil</Link>
          <ChevronRight size={14} />
          <span className="font-medium">{breadcrumb || title}</span>
        </div>
      </nav>

      {/* Contenu */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 md:px-8 py-10 md:py-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-[#5E2251]">
          {title}
        </h1>
        <div className="legal-content text-gray-800 leading-relaxed">
          {children}
        </div>
        <style>{`
          .legal-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #5E2251;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
          }
          .legal-content h3 {
            font-size: 1.15rem;
            font-weight: 600;
            color: #5E2251;
            margin-top: 1.75rem;
            margin-bottom: 0.75rem;
          }
          .legal-content p {
            margin-bottom: 1rem;
          }
          .legal-content ul, .legal-content ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
            list-style: disc outside;
          }
          .legal-content ol { list-style: decimal outside; }
          .legal-content li {
            margin-bottom: 0.35rem;
          }
          .legal-content a {
            color: #5E2251;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .legal-content a:hover {
            color: #3d1635;
          }
          .legal-content strong {
            color: #111827;
            font-weight: 600;
          }
          .legal-content code {
            background: #f3f4f6;
            padding: 0.1rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.9em;
            color: #5E2251;
          }
          .legal-content .lead {
            font-size: 1.1rem;
            color: #6b7280;
            margin-bottom: 2rem;
          }
        `}</style>
      </main>

      <Footer />
    </div>
  )
}
