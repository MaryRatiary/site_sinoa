# Design — Page produit native Shopify embarquée (site_sinoa)

**Date :** 2026-06-03
**Statut :** Validé (en attente de relecture utilisateur avant le plan d'implémentation)
**Approche retenue :** A — Template Shopify « embed » dédié + snippet pont + iframe côté React

---

## Contexte

`site_sinoa` est une SPA **React 18 + Vite + React Router** servie depuis Netlify
(`kpopshop.netlify.app`) et **embarquée dans une iframe** à l'intérieur d'une page du thème
Shopify (cf. `shopify-url-sync-snippet.html`). Une synchro d'URL bidirectionnelle
(`src/hooks/useUrlSync.js` ↔ snippet parent, via `postMessage`) maintient l'URL du navigateur
Shopify alignée avec la route React (`/#/product/xxx` côté Shopify → `/product/xxx` côté iframe).

Le catalogue principal vient d'une **API custom** (`src/services/api.js`, `productsAPI`,
base `VITE_API_URL`), les produits étant identifiés par un `slug`. Le checkout passe par
`checkoutAPI.createShopifyCheckout` (`src/services/api.js:202`) qui **filtre tout article sans
`variantId` Shopify** et n'envoie au backend `/shopify-checkout` que `{ variantId, quantity }`.

### Besoin métier

Le patron veut pouvoir **modifier la page produit directement dans Shopify** (ajouter des
**bundles**, des sections, des blocs d'app) **manuellement**, sans toucher au code React. La page
produit actuelle est codée en React (`src/pages/ProductDetailPage.jsx`, ~850 lignes) et n'est donc
pas manipulable depuis l'admin Shopify.

### Objectif

Remplacer le **contenu** de la page produit par la **vraie page produit native du thème Shopify**
(`/products/{handle}`), **embarquée dans une iframe** à l'intérieur de l'app React — tout en
**conservant le panier React** (`CartModal` + `CartContext`).

### Décisions cadrées (brainstorming)

- Page produit = page Shopify native **embarquée dans l'iframe** (pas de sortie d'iframe, pas de Buy Button SDK).
- **slug = handle** Shopify → l'URL produit se construit directement : `/products/{slug}`.
- **Panier React conservé** : la page Shopify embarquée renvoie l'ajout au panier vers le `CartModal` via `postMessage`.
- L'utilisateur **a accès au thème Shopify** ; ce design fournit le code React **et** le Liquid.

---

## 1. Architecture & couches

```
┌─ Fenêtre Shopify (thème, page hôte) ───────────────────────┐
│  snippet url-sync existant (shopify-url-sync-snippet.html)  │
│  ┌─ iframe React (Netlify) ────────────────────────────┐   │
│  │  Route /product/:slug → <ShopifyProductFrame/>        │   │
│  │  Header / RespNav / Footer React autour               │   │
│  │  ┌─ iframe interne (Shopify) ───────────────────┐     │   │
│  │  │  /products/{slug}?view=embed                  │     │   │
│  │  │  = template produit allégé + snippet "pont"   │     │   │
│  │  └───────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Flux d'ajout au panier :** clic « Ajouter au panier » dans l'iframe interne Shopify → le snippet
pont fait `preventDefault` + `postMessage` vers React (`window.parent`) → `ShopifyProductFrame`
reçoit (avec vérification d'origine) → `addToCart(...)` → `openCart()`. Le checkout existant
(`createShopifyCheckout` → backend Storefront) fonctionne tel quel car on transmet le `variantId`.

---

## 2. Côté React (ce repo)

### Nouveau composant `src/components/composants/ShopifyProductFrame.jsx`

- Lit `:slug` via `useParams`, construit l'URL `https://{STORE}/products/{slug}?view=embed`.
- Rend l'iframe interne, **entourée du `Header` / `RespNav` / `Footer` React** existants pour la cohérence visuelle du site.
- Écoute l'événement `message` du `window` avec **contrôle strict de l'origine** (= domaine Shopify configuré) :
  - `sinoa:add-to-cart` → `addToCart(payload)` puis `openCart()`.
  - `sinoa:product-height` → ajuste la hauteur de l'iframe (auto-resize, pas de double scroll).
- Nettoie le listener au démontage.
- Gère un état de chargement (skeleton/spinner) tant que l'iframe n'a pas signalé qu'elle est prête.

### Route

- `src/App.jsx` : `/product/:slug` → `<ShopifyProductFrame />` au lieu de `<ProductDetailPage />`.
- **`ProductDetailPage.jsx` est conservé** (non supprimé) pour rollback/repli rapide.

### Configuration d'environnement

- **Unifier** la variable du domaine Shopify. Le code mélange aujourd'hui `VITE_SHOPIFY_STORE`
  (`src/services/shopify.js`), `VITE_SHOPIFY_STORE_URL` (`.env.example`) et
  `VITE_SHOPIFY_STORE_NAME` (`src/components/composants/ShopifyProducts.jsx:115`).
- Standardiser sur **`VITE_SHOPIFY_STORE`** (format `votre-boutique.myshopify.com` ou domaine
  custom) et documenter dans `.env.example` / `.env.shopify`.

### Inchangé

- Les ~12 appels `navigate('/product/'+slug)` (`ProductCard`, `ShopPage`, `SearchPage`,
  `BestSellersPage`, `DynamicProductPage`, `StaticCategoryPage`, `LightStickCard`, `GroupeSection`,
  `RelatedProduct`, `SmoothSlider`, …) restent identiques — même route.
- `useUrlSync` et la synchro `/#/product/slug` continuent de fonctionner.

---

## 3. Côté Shopify (thème — Liquid fourni à coller)

### `layout/theme.embed.liquid`

Layout minimal : pas de header/footer/menu du thème, uniquement `{{ content_for_layout }}`,
`{{ content_for_header }}` et les styles produit nécessaires.

### `templates/product.embed.liquid` (ou section produit dédiée)

Rend le produit et monte le snippet pont. Activé via `?view=embed` (paramètre `view` de Shopify
qui sélectionne le suffixe de template/layout alternatif).

### `snippets/sinoa-react-bridge.liquid`

- Intercepte le `submit` du formulaire produit / le clic « Ajouter au panier » (`preventDefault`).
- Récupère : `variant_id` Shopify sélectionné, quantité, options (taille/couleur/modèle), titre, prix, image.
- `window.parent.postMessage({ type:'sinoa:add-to-cart', ...payload }, '<origine Netlify>')`.
- Envoie la hauteur du contenu via `ResizeObserver` → `sinoa:product-height` (auto-resize).
- **Vérifie/cible l'origine Netlify** (pas de `'*'`) pour la sécurité.

---

## 4. Contrat du message (`payload`)

Calé sur la signature existante
`addToCart(product, quantity = 1, size = null, color = null, variantId = null, model = null)`
(`src/context/CartContext.jsx`) :

```js
{
  type: 'sinoa:add-to-cart',
  product: {
    id,                 // identifiant produit (handle/slug ou id Shopify)
    name,               // titre produit
    price,              // prix unitaire (number)
    image,              // URL image principale
    variants: [         // optionnel, pour image/prix par variant
      { id, price, image_url }
    ]
  },
  quantity,             // number >= 1
  size,                 // option Shopify ou null
  color,                // option Shopify ou null
  model,                // option Shopify ou null
  variantId             // ID de variant Shopify — OBLIGATOIRE (sinon checkout rejette l'article)
}
```

> **Contrainte dure :** sans `variantId`, `createShopifyCheckout` (`src/services/api.js:204-208`)
> rejette l'article (« variantId Shopify manquant »). Le snippet **doit** toujours le fournir.

Message complémentaire : `{ type: 'sinoa:product-height', height: <px> }`.

---

## 5. Panier & bundles (point fragile assumé)

| Cas | Comportement | Statut |
|-----|--------------|--------|
| Produit simple / 1 variant | 1 message → 1 ligne panier → checkout OK | ✅ supporté |
| Bundle = 1 variant Shopify dédié | Traité comme un produit simple | ✅ supporté |
| Bundle multi-lignes (app / cart-transform) | Le snippet envoie **plusieurs** items (1 message par variant) ; le panier React affiche plusieurs lignes | ⚠️ limite (voir ci-dessous) |

**Limite des bundles multi-lignes :** la **remise bundle** appliquée par Shopify (cart transform /
app) **n'apparaît pas** dans le calcul de prix du panier React (`getTotalPrice`) → le total juste
n'est garanti qu'à l'étape **checkout Shopify**.

**Repli proposé (à confirmer selon l'app de bundle utilisée par le patron) :** pour les bundles
« complexes », soit basculer le bouton vers le **checkout Shopify direct**, soit afficher un avis
« prix final calculé au panier », plutôt que de fausser le total côté React. Décision reportée
jusqu'à connaître l'app de bundle réellement utilisée.

---

## 6. Risques & cas limites

- **Format du `variantId`** attendu par le backend `/shopify-checkout` (GID `gid://shopify/...`
  vs ID numérique) : à **vérifier à l'implémentation** ; le snippet émettra le format attendu.
- **Cross-origin** Netlify ↔ Shopify : `postMessage` avec **vérification d'origine stricte des
  deux côtés** (jamais `'*'` en réception ; origine ciblée en émission).
- **CSP / `frame-ancestors`** : autoriser le domaine Netlify à embarquer `/products/...?view=embed`.
  Le **checkout** Shopify reste **top-level** via `redirectToCheckout` existant
  (`src/components/cart/CartModal.jsx:104-117`), car le checkout interdit l'iframe.
- **Auto-resize** : sans `ResizeObserver` fiable, risque de double scroll → prévoir un fallback de
  hauteur min.
- **SEO / refresh** : la synchro `/#/product/slug` existante reste fonctionnelle.

---

## 7. Tests & validation

- Produit simple : ajout → bonne ligne, bon prix, bon `variantId`, **checkout passe**.
- Produit à variantes (taille/couleur/modèle) : le bon `variantId` remonte selon la sélection.
- Auto-resize de l'iframe : pas de double scroll, hauteur correcte au changement de variante.
- **Sécurité** : un `message` d'origine non autorisée est **ignoré**.
- Régression : la navigation `/product/:slug` depuis les ~12 points d'entrée fonctionne toujours.
- Synchro URL parent (`/#/product/slug`) toujours fonctionnelle au refresh.

---

## 8. Hors périmètre

- Refonte visuelle de la page produit (désormais pilotée par le thème Shopify).
- Migration du catalogue de l'API custom vers la Storefront API.
- Implémentation réelle des bundles (faite par le patron dans l'admin Shopify).
- Suppression de `ProductDetailPage.jsx` (conservé comme repli).

---

## Récapitulatif des livrables

**React (ce repo) :**
1. `src/components/composants/ShopifyProductFrame.jsx` (nouveau).
2. `src/App.jsx` — route `/product/:slug` pointée sur le nouveau composant.
3. Unification de la variable d'env `VITE_SHOPIFY_STORE` (+ `.env.example`).

**Shopify (thème, fourni à coller) :**
4. `layout/theme.embed.liquid`.
5. `templates/product.embed.liquid` (ou section dédiée).
6. `snippets/sinoa-react-bridge.liquid`.
