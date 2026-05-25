import React from 'react'
import LegalPage from './LegalPage'

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" breadcrumb="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>kpopshopnetflix.fr</strong> est édité par Huntrix
        Boutique.
      </p>

      <h2>Hébergement</h2>
      <p>
        Shopify Inc.<br />
        126 York St., Ottawa, Ontario, K1N 5T5, Canada.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute information, vous pouvez nous contacter par email via les
        coordonnées indiquées en pied de page, ou via notre page de contact.
      </p>

      <h2>Engagement éditorial</h2>
      <p>
        Huntrix Boutique met tout en œuvre pour offrir à ses utilisateurs la
        meilleure expérience de navigation possible, ainsi que des informations
        complètes et pertinentes. Si vous remarquez un contenu inapproprié ou
        illicite, nous vous invitons à nous le signaler.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble du contenu du site (textes, images, logo, charte graphique,
        photographies de produits) est protégé par le droit d'auteur. Toute
        reproduction, même partielle, est interdite sans autorisation écrite
        préalable.
      </p>

      <h2>Conditions générales de vente</h2>
      <p>
        Nos conditions générales de vente sont accessibles à tout moment depuis
        le pied de page, sous le lien <em>CGV</em>, ou via la page{' '}
        <em>Mentions légales</em>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise des cookies pour assurer son fonctionnement et mesurer
        l'audience. Vous pouvez consulter le détail dans notre Politique de
        confidentialité.
      </p>

      <h2>Loi applicable</h2>
      <p>
        Le présent site et les présentes mentions légales sont soumis au droit
        français. En cas de litige, les tribunaux français seront seuls
        compétents.
      </p>
    </LegalPage>
  )
}
