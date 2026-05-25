import React from 'react'
import { Truck, Globe, Clock, MapPin } from 'lucide-react'
import LegalPage from './LegalPage'

export default function Livraisons() {
  return (
    <LegalPage title="Livraisons" breadcrumb="Livraisons">
      <p>
        Notre boutique travaille en étroite collaboration avec les producteurs
        et créateurs, ce qui nous permet de vous proposer des tarifs avantageux
        sur l'ensemble de notre catalogue K-Pop.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-8">
        <InfoCard
          icon={<Globe size={22} />}
          title="Livraison internationale"
          text="Nous expédions partout dans le monde. La France métropolitaine, les DROM-COM et tous les pays d'Europe sont desservis."
        />
        <InfoCard
          icon={<Clock size={22} />}
          title="Délais"
          text="Les délais moyens sont de 2 à 3 semaines, traitement de commande inclus (1 à 3 jours)."
        />
        <InfoCard
          icon={<Truck size={22} />}
          title="Suivi de colis"
          text="Un numéro de suivi vous est envoyé par email dès l'expédition de votre commande."
        />
        <InfoCard
          icon={<MapPin size={22} />}
          title="Origine"
          text="Nos bureaux sont en France. Notre entrepôt international se trouve en Asie pour pouvoir vous proposer un choix très large."
        />
      </div>

      <h2>Modes d'expédition</h2>
      <p>
        Nous utilisons des transporteurs partenaires de confiance (Colissimo,
        Mondial Relay, DHL, La Poste) selon la destination et le poids du colis.
        Le mode d'expédition optimal est sélectionné automatiquement à la
        validation de la commande.
      </p>

      <h2>Frais de livraison</h2>
      <p>
        La livraison standard est <strong>offerte</strong> pour toute commande supérieure
        à un certain montant — vous voyez le montant exact dans votre panier au
        moment de la validation. Pour les commandes plus petites, un forfait
        unique s'applique, affiché lors du checkout.
      </p>

      <h2>Une question ?</h2>
      <p>
        Vous pouvez nous contacter par email pour toute question sur votre
        livraison ou pour un suivi de colis.
      </p>
    </LegalPage>
  )
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:border-[#5E2251] transition-colors">
      <div className="text-[#5E2251] mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  )
}
