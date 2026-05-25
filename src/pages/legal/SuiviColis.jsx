import React, { useState } from 'react'
import { Package, Truck, Mail, Search, AlertCircle, Clock } from 'lucide-react'
import LegalPage from './LegalPage'

const CARRIERS = [
  {
    name: 'Colissimo',
    url: 'https://www.laposte.fr/outils/suivre-vos-envois',
    info: 'Suivi standard La Poste (France + International). Délai 2 à 5 jours.',
  },
  {
    name: 'Mondial Relay',
    url: 'https://www.mondialrelay.fr/suivi-de-colis/',
    info: 'Livraison en point relais. Délai 3 à 6 jours.',
  },
  {
    name: 'DHL Express',
    url: 'https://www.dhl.com/fr-fr/home/suivi.html',
    info: 'Livraison rapide internationale. Délai 3 à 7 jours.',
  },
  {
    name: 'La Poste',
    url: 'https://www.laposte.fr/outils/suivre-vos-envois',
    info: "Pour les petits colis prioritaires. Délai 2 à 4 jours.",
  },
  {
    name: 'Chronopost',
    url: 'https://www.chronopost.fr/tracking-no-cms/suivi-page',
    info: 'Livraison express 24h-48h en France.',
  },
]

export default function SuiviColis() {
  const [trackingNumber, setTrackingNumber] = useState('')

  const handleTrack = (e) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return
    // On envoie sur le suivi La Poste qui couvre 80% des envois,
    // ils savent rediriger vers le bon transporteur si besoin.
    window.open(
      `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(
        trackingNumber.trim()
      )}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <LegalPage title="Suivi de colis" breadcrumb="Suivi de colis">
      <p className="lead text-gray-600 mb-8">
        Vous avez passé une commande et vous souhaitez la suivre ? Cette page
        vous explique comment, quand et où trouver votre numéro de suivi.
      </p>

      {/* Tracking widget */}
      <div className="not-prose my-8 bg-gradient-to-br from-[#5E2251] to-[#3d1635] text-white rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Search size={22} />
          <h2 className="text-xl font-semibold m-0">
            Suivre votre colis maintenant
          </h2>
        </div>
        <p className="text-white/80 text-sm mb-5">
          Saisissez votre numéro de suivi (reçu par email après expédition)
          pour être redirigé sur le site du transporteur.
        </p>
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Ex: 1Z999AA10123456784"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition"
          />
          <button
            type="submit"
            disabled={!trackingNumber.trim()}
            className="px-6 py-3 bg-white text-[#5E2251] font-bold rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Suivre
          </button>
        </form>
      </div>

      {/* Étapes */}
      <h2>Étape par étape</h2>

      <div className="not-prose space-y-4 my-6">
        <Step
          icon={<Package size={20} />}
          title="1. Confirmation de commande"
          text="Dès que votre commande est passée, vous recevez immédiatement un email de confirmation avec votre numéro de commande."
        />
        <Step
          icon={<Clock size={20} />}
          title="2. Préparation (1 à 3 jours)"
          text="Notre équipe vérifie le stock, emballe vos articles et prépare l'expédition. Aucun numéro de suivi à ce stade."
        />
        <Step
          icon={<Truck size={20} />}
          title="3. Expédition"
          text="Le colis est confié au transporteur. Vous recevez un email avec votre numéro de suivi et le nom du transporteur."
        />
        <Step
          icon={<Mail size={20} />}
          title="4. Suivi en ligne"
          text="Cliquez sur le lien dans l'email, ou utilisez le formulaire ci-dessus avec votre numéro de suivi."
        />
      </div>

      {/* Transporteurs */}
      <h2>Nos transporteurs partenaires</h2>
      <p>
        Selon votre commande et votre adresse, votre colis sera confié à l'un
        de ces transporteurs. Vous pouvez aussi suivre votre colis
        directement sur leur site :
      </p>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
        {CARRIERS.map((c) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-200 rounded-lg p-4 hover:border-[#5E2251] hover:shadow-sm transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900 group-hover:text-[#5E2251]">
                {c.name}
              </span>
              <Truck size={16} className="text-[#5E2251]" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed m-0">
              {c.info}
            </p>
          </a>
        ))}
      </div>

      {/* Problèmes courants */}
      <h2>Problèmes fréquents</h2>

      <h3>Mon numéro de suivi ne fonctionne pas</h3>
      <p>
        Il peut s'écouler 24 à 48h entre le moment où votre colis est confié
        au transporteur et le moment où le suivi apparaît dans leur système.
        Patientez une journée et réessayez.
      </p>

      <h3>Le suivi est bloqué sur "En transit" depuis plusieurs jours</h3>
      <p>
        Pour les commandes internationales, le passage en douane peut prendre
        de 3 à 10 jours sans mise à jour visible du suivi. C'est normal.
        Si plus de 14 jours s'écoulent sans aucune mise à jour, contactez-nous.
      </p>

      <h3>Je n'ai pas reçu de numéro de suivi</h3>
      <p>
        Vérifiez vos spams (l'email vient de <code>no-reply@shopify.com</code>).
        Si rien après 5 jours ouvrés depuis la commande, contactez-nous avec
        votre numéro de commande.
      </p>

      <h3>Mon colis affiche "Livré" mais je ne l'ai pas reçu</h3>
      <ul>
        <li>Vérifiez votre boîte aux lettres et tout autour de votre porte</li>
        <li>Demandez à votre voisinage ou gardien</li>
        <li>Contactez directement le transporteur (preuve de livraison disponible)</li>
        <li>Si rien après 48h, contactez-nous</li>
      </ul>

      <div className="not-prose my-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-amber-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="font-semibold text-amber-900 m-0 mb-1">
              Délai exceptionnel pour un cas urgent ?
            </p>
            <p className="text-sm text-amber-800 m-0">
              Pour les drops K-pop ou les pré-commandes Salon, indiquez-nous votre
              date butoir au moment de la commande dans le champ "Note". Nous
              ferons notre maximum pour expédier en priorité.
            </p>
          </div>
        </div>
      </div>
    </LegalPage>
  )
}

function Step({ icon, title, text }) {
  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5E2251]/10 text-[#5E2251] flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 m-0 mb-1">{title}</h3>
        <p className="text-sm text-gray-700 leading-relaxed m-0">{text}</p>
      </div>
    </div>
  )
}
