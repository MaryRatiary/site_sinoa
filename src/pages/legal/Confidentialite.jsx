import React from 'react'
import LegalPage from './LegalPage'

export default function Confidentialite() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      breadcrumb="Politique de confidentialité"
    >
      <h2>Article 1 — Renseignements personnels recueillis</h2>
      <p>
        Lorsque vous effectuez un achat sur notre boutique, dans le cadre de
        notre processus d'achat et de vente, nous recueillons les renseignements
        personnels que vous nous fournissez : nom, adresse, adresse e-mail.
      </p>
      <p>
        Lorsque vous naviguez sur la boutique, nous recevons automatiquement
        l'adresse IP de votre ordinateur, qui nous permet d'obtenir plus de
        détails sur le navigateur et le système d'exploitation que vous
        utilisez.
      </p>
      <p>
        <strong>Marketing email :</strong> avec votre permission, nous pourrions
        vous envoyer des emails au sujet de nouveaux produits ou de nos
        actualités.
      </p>

      <h2>Article 2 — Consentement</h2>
      <h3>Comment obtenez-vous mon consentement ?</h3>
      <p>
        Lorsque vous nous fournissez vos renseignements personnels pour conclure
        une transaction, vérifier votre carte de crédit, passer une commande,
        planifier une livraison ou retourner un achat, nous présumons que vous
        consentez à ce que nous recueillions vos renseignements et à ce que
        nous les utilisions à cette fin uniquement.
      </p>
      <p>
        Pour toute autre utilisation (marketing par exemple), nous vous
        demanderons votre consentement explicite ou vous donnerons la
        possibilité de refuser.
      </p>
      <h3>Comment retirer mon consentement ?</h3>
      <p>
        Si après nous avoir donné votre consentement vous changez d'avis, vous
        pouvez nous en aviser à tout moment en nous contactant par email.
      </p>

      <h2>Article 3 — Divulgation</h2>
      <p>
        Nous pouvons divulguer vos renseignements personnels si la loi nous y
        oblige ou si vous violez nos Conditions Générales de Vente.
      </p>

      <h2>Article 4 — Hébergement Shopify</h2>
      <p>
        Notre boutique est hébergée sur Shopify Inc. Ils nous fournissent la
        plate-forme e-commerce qui nous permet de vous vendre nos services et
        produits.
      </p>
      <p>
        Vos données sont stockées sur les serveurs de Shopify, sur un serveur
        sécurisé protégé par un pare-feu.
      </p>
      <p>
        <strong>Paiement :</strong> si vous payez via une passerelle de paiement
        direct, Shopify stocke vos données de carte. Ces données sont chiffrées
        conformément à la norme PCI-DSS et supprimées une fois la commande
        finalisée.
      </p>

      <h2>Article 5 — Services fournis par des tiers</h2>
      <p>
        Les fournisseurs tiers que nous utilisons recueillent, utilisent et
        divulguent vos renseignements uniquement dans la mesure nécessaire pour
        réaliser les services qu'ils nous fournissent.
      </p>
      <p>
        Certains tiers (passerelles de paiement, processeurs) possèdent leurs
        propres politiques de confidentialité. Nous vous recommandons de les
        consulter avant d'effectuer une transaction.
      </p>

      <h2>Article 6 — Sécurité</h2>
      <p>
        Pour protéger vos données personnelles, nous prenons des précautions
        raisonnables et suivons les meilleures pratiques de l'industrie.
      </p>
      <p>
        Vos informations de carte bancaire sont chiffrées via SSL et stockées
        avec un chiffrement AES-256. Aucune méthode de transmission Internet
        n'est sûre à 100 %, mais nous respectons l'ensemble des exigences
        PCI-DSS.
      </p>

      <h2>Cookies</h2>
      <p>Voici les principaux cookies que nous utilisons :</p>
      <ul>
        <li><code>_session_id</code> — identifiant unique de session Shopify.</li>
        <li><code>_shopify_visit</code> — comptabilise les visites (persistance 30 min).</li>
        <li><code>_shopify_uniq</code> — calcule le nombre de visites uniques.</li>
        <li><code>cart</code> — stocke votre panier (persistance 2 semaines).</li>
        <li><code>_secure_session_id</code> — identifiant sécurisé de session.</li>
      </ul>

      <h2>Article 7 — Âge de consentement</h2>
      <p>
        En utilisant ce site, vous déclarez avoir au moins l'âge de la majorité
        dans votre pays de résidence.
      </p>

      <h2>Article 8 — Modifications</h2>
      <p>
        Nous nous réservons le droit de modifier cette politique à tout moment.
        Les changements prendront effet dès leur publication sur le site.
      </p>

      <h2>Questions & contact</h2>
      <p>
        Pour accéder, corriger, modifier ou supprimer vos données personnelles,
        ou pour toute question, contactez-nous par email à l'adresse indiquée
        en pied de page.
      </p>
    </LegalPage>
  )
}
