import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import LegalPage from './LegalPage'

const QA = [
  {
    q: 'Combien de temps prend le traitement de ma commande ?',
    a: "Nous prenons 1 à 3 jours pour traiter votre commande, puis 2 à 3 semaines pour acheminer le colis jusqu'à chez vous.",
  },
  {
    q: 'Expédiez-vous partout dans le monde ?',
    a: 'Oui, absolument. Nous livrons dans le monde entier.',
  },
  {
    q: "D'où sont expédiés vos produits ?",
    a: "Nos bureaux sont situés en France. Notre entrepôt international est situé en Asie.",
  },
  {
    q: 'Puis-je suivre ma commande ?',
    a: "Oui — quelques jours après votre commande, vous recevrez un email avec votre numéro de suivi. Cela peut prendre un peu de temps avant que les premières informations apparaissent.",
  },
  {
    q: 'Il manque certains articles dans ma commande, est-ce normal ?',
    a: "Nos produits sont expédiés séparément selon votre commande. Si celle-ci contient des articles de plusieurs entrepôts, il y aura plusieurs livraisons. Il est donc normal qu'un produit puisse arriver avant les autres.",
  },
  {
    q: "J'ai reçu un article endommagé, que puis-je faire ?",
    a: "Nous en sommes désolés. Envoyez-nous une photo de l'article endommagé à notre service client et nous vous enverrons un produit de remplacement aussi vite que possible.",
  },
  {
    q: 'Où êtes-vous situés ?',
    a: 'Nous sommes basés en France.',
  },
  {
    q: "Je n'ai toujours pas reçu ma commande, que faire ?",
    a: "L'expédition internationale peut parfois prendre plus de temps que prévu, notamment à cause des douanes. Vous pouvez suivre votre commande à tout moment depuis le lien envoyé par email. Si besoin, contactez notre service client.",
  },
  {
    q: 'Avez-vous une politique de remboursement ?',
    a: "Oui, nous proposons un remboursement dans les 14 jours suivant la réception de votre colis, hors articles soldés. Voir notre Politique de retours pour plus de détails.",
  },
]

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <LegalPage title="FAQ" breadcrumb="FAQ">
      <p className="lead text-gray-600 mb-8">
        Retrouvez ici les réponses aux questions les plus fréquentes. Si vous ne
        trouvez pas votre réponse, contactez notre service client.
      </p>

      <div className="space-y-3 not-prose">
        {QA.map((item, idx) => {
          const open = openIdx === idx
          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(open ? -1 : idx)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={open}
              >
                <span className="font-medium text-gray-900">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#5E2251] transition-transform duration-300 flex-shrink-0 ml-3 ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  open ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-4 md:p-5 pt-0 text-gray-700 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </LegalPage>
  )
}
