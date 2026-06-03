# Page produit Shopify embarquée — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer la page produit React (`/product/:slug` → `ProductDetailPage`) par la vraie page produit native du thème Shopify, embarquée dans une iframe interne, tout en conservant le panier React via un pont `postMessage`.

**Architecture:** L'app React (iframe Netlify dans le thème Shopify) rend, sur `/product/:slug`, une iframe interne vers `https://{store}/products/{slug}?view=embed` — un template Shopify allégé qui intercepte l'ajout au panier et le renvoie à React via `postMessage`. React valide l'origine, alimente son `CartContext` et ouvre le `CartModal`. Le checkout existant (Storefront via backend) fonctionne car le pont transmet le `variantId` Shopify.

**Tech Stack:** React 18, Vite 4, React Router 6, Tailwind, Vitest (ajouté pour la logique pure), Liquid (thème Shopify).

---

## Structure des fichiers

**React (ce repo `site_sinoa`) :**
- Create `src/lib/shopifyConfig.js` — résolution du domaine/URL Shopify (fonctions pures).
- Create `src/lib/shopifyConfig.test.js` — tests Vitest.
- Create `src/lib/shopifyBridge.js` — validation d'origine + parsing des messages (fonctions pures).
- Create `src/lib/shopifyBridge.test.js` — tests Vitest.
- Create `src/components/composants/ShopifyProductFrame.jsx` — composant page : iframe + écoute messages + layout React.
- Modify `src/App.jsx:23,88` — route `/product/:slug` → nouveau composant.
- Modify `src/components/composants/ShopifyProducts.jsx:115` — unifier la variable d'env.
- Modify `vite.config.js` — config Vitest.
- Modify `package.json` — devDep `vitest` + script `test`.
- Modify `.env.example` / `.env.shopify` — documenter `VITE_SHOPIFY_STORE`.

**Shopify (thème — code fourni, à coller dans le thème) :** versionnés ici sous `shopify-theme/` pour référence.
- Create `shopify-theme/layout/theme.embed.liquid`
- Create `shopify-theme/templates/product.embed.liquid`
- Create `shopify-theme/sections/sinoa-product-embed.liquid`
- Create `shopify-theme/snippets/sinoa-react-bridge.liquid`

---

## Task 1: Installer Vitest (infra de test)

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Installer la dépendance**

Run:
```bash
npm install -D vitest
```
Expected: `vitest` ajouté à `devDependencies`, pas d'erreur.

- [ ] **Step 2: Ajouter le script de test dans `package.json`**

Dans la section `"scripts"`, ajouter la ligne `"test"` :
```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Configurer Vitest dans `vite.config.js`**

Remplacer tout le contenu de `vite.config.js` par :
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
```

- [ ] **Step 4: Vérifier que le runner démarre (aucun test pour l'instant)**

Run:
```bash
npx vitest run
```
Expected: Vitest démarre et affiche « No test files found » (ou 0 test) sans crasher.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.js
git commit -m "chore: ajout de Vitest pour la logique pure"
```

---

## Task 2: Module de config Shopify (`shopifyConfig.js`) — TDD

**Files:**
- Create: `src/lib/shopifyConfig.js`
- Test: `src/lib/shopifyConfig.test.js`

- [ ] **Step 1: Écrire les tests qui échouent**

Créer `src/lib/shopifyConfig.test.js` :
```js
import { describe, it, expect } from 'vitest'
import { normalizeStore, storeOrigin, productEmbedUrl } from './shopifyConfig'

describe('normalizeStore', () => {
  it('retire le scheme et le slash final', () => {
    expect(normalizeStore('https://boutique.myshopify.com/')).toBe('boutique.myshopify.com')
    expect(normalizeStore('http://boutique.myshopify.com')).toBe('boutique.myshopify.com')
    expect(normalizeStore('boutique.myshopify.com')).toBe('boutique.myshopify.com')
  })
  it('gère le vide', () => {
    expect(normalizeStore('')).toBe('')
    expect(normalizeStore(undefined)).toBe('')
  })
})

describe('storeOrigin', () => {
  it('construit une origine https', () => {
    expect(storeOrigin('boutique.myshopify.com')).toBe('https://boutique.myshopify.com')
    expect(storeOrigin('https://boutique.myshopify.com/')).toBe('https://boutique.myshopify.com')
  })
  it('renvoie une chaîne vide si pas de store', () => {
    expect(storeOrigin('')).toBe('')
  })
})

describe('productEmbedUrl', () => {
  it('construit l’URL produit embed', () => {
    expect(productEmbedUrl('boutique.myshopify.com', 'mon-produit'))
      .toBe('https://boutique.myshopify.com/products/mon-produit?view=embed')
  })
  it('encode le slug', () => {
    expect(productEmbedUrl('boutique.myshopify.com', 'a b'))
      .toBe('https://boutique.myshopify.com/products/a%20b?view=embed')
  })
  it('renvoie une chaîne vide si store ou slug manquant', () => {
    expect(productEmbedUrl('', 'x')).toBe('')
    expect(productEmbedUrl('boutique.myshopify.com', '')).toBe('')
  })
})
```

- [ ] **Step 2: Lancer les tests pour vérifier l'échec**

Run:
```bash
npx vitest run src/lib/shopifyConfig.test.js
```
Expected: FAIL — « Failed to resolve import './shopifyConfig' » (le module n'existe pas encore).

- [ ] **Step 3: Écrire l'implémentation minimale**

Créer `src/lib/shopifyConfig.js` :
```js
// Résolution du domaine Shopify et des URLs produit (fonctions pures, testables).

export function normalizeStore(raw) {
  return (raw || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')
}

export function storeOrigin(raw) {
  const s = normalizeStore(raw)
  return s ? `https://${s}` : ''
}

export function productEmbedUrl(raw, slug) {
  const origin = storeOrigin(raw)
  if (!origin || !slug) return ''
  return `${origin}/products/${encodeURIComponent(slug)}?view=embed`
}

// Domaine Shopify configuré (format "boutique.myshopify.com" ou domaine custom servant /products).
export const SHOPIFY_STORE = import.meta.env.VITE_SHOPIFY_STORE
```

- [ ] **Step 4: Lancer les tests pour vérifier le succès**

Run:
```bash
npx vitest run src/lib/shopifyConfig.test.js
```
Expected: PASS — 7 tests verts.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shopifyConfig.js src/lib/shopifyConfig.test.js
git commit -m "feat: module de config Shopify (domaine + URL embed)"
```

---

## Task 3: Module pont (`shopifyBridge.js`) — TDD

**Files:**
- Create: `src/lib/shopifyBridge.js`
- Test: `src/lib/shopifyBridge.test.js`

- [ ] **Step 1: Écrire les tests qui échouent**

Créer `src/lib/shopifyBridge.test.js` :
```js
import { describe, it, expect } from 'vitest'
import { isAllowedOrigin, parseAddToCartMessage, parseHeightMessage } from './shopifyBridge'

describe('isAllowedOrigin', () => {
  it('accepte une origine identique', () => {
    expect(isAllowedOrigin('https://boutique.myshopify.com', 'https://boutique.myshopify.com')).toBe(true)
  })
  it('refuse une origine différente ou vide', () => {
    expect(isAllowedOrigin('https://evil.com', 'https://boutique.myshopify.com')).toBe(false)
    expect(isAllowedOrigin('', 'https://boutique.myshopify.com')).toBe(false)
    expect(isAllowedOrigin('https://boutique.myshopify.com', '')).toBe(false)
  })
})

describe('parseAddToCartMessage', () => {
  const base = {
    type: 'sinoa:add-to-cart',
    product: { id: 123, name: 'Lightstick', price: 29.9, image: 'img.jpg' },
    quantity: 2, size: 'M', color: 'Rose', model: null,
    variantId: 'gid://shopify/ProductVariant/999',
  }
  it('parse un message valide', () => {
    expect(parseAddToCartMessage(base)).toEqual({
      product: base.product, quantity: 2, size: 'M', color: 'Rose',
      variantId: 'gid://shopify/ProductVariant/999', model: null,
    })
  })
  it('rejette un mauvais type', () => {
    expect(parseAddToCartMessage({ ...base, type: 'autre' })).toBeNull()
    expect(parseAddToCartMessage(null)).toBeNull()
  })
  it('rejette si variantId manquant (checkout l’exige)', () => {
    expect(parseAddToCartMessage({ ...base, variantId: undefined })).toBeNull()
  })
  it('rejette si product.id manquant', () => {
    expect(parseAddToCartMessage({ ...base, product: { name: 'X' } })).toBeNull()
  })
  it('normalise une quantité invalide à 1', () => {
    expect(parseAddToCartMessage({ ...base, quantity: 0 }).quantity).toBe(1)
    expect(parseAddToCartMessage({ ...base, quantity: 'abc' }).quantity).toBe(1)
  })
})

describe('parseHeightMessage', () => {
  it('parse une hauteur valide', () => {
    expect(parseHeightMessage({ type: 'sinoa:product-height', height: 800 })).toBe(800)
  })
  it('rejette type/valeur invalides', () => {
    expect(parseHeightMessage({ type: 'autre', height: 800 })).toBeNull()
    expect(parseHeightMessage({ type: 'sinoa:product-height', height: 0 })).toBeNull()
    expect(parseHeightMessage({ type: 'sinoa:product-height', height: 'x' })).toBeNull()
    expect(parseHeightMessage(null)).toBeNull()
  })
})
```

- [ ] **Step 2: Lancer les tests pour vérifier l'échec**

Run:
```bash
npx vitest run src/lib/shopifyBridge.test.js
```
Expected: FAIL — « Failed to resolve import './shopifyBridge' ».

- [ ] **Step 3: Écrire l'implémentation minimale**

Créer `src/lib/shopifyBridge.js` :
```js
// Pont entre la page produit Shopify embarquée et le panier React (fonctions pures, testables).

export function isAllowedOrigin(origin, allowedOrigin) {
  if (!origin || !allowedOrigin) return false
  return origin === allowedOrigin
}

export function parseAddToCartMessage(data) {
  if (!data || data.type !== 'sinoa:add-to-cart') return null
  if (!data.variantId) return null // sans variantId, le checkout rejette l'article
  const product = data.product
  if (!product || product.id === undefined || product.id === null) return null
  const quantity = Math.max(1, parseInt(data.quantity, 10) || 1)
  return {
    product,
    quantity,
    size: data.size ?? null,
    color: data.color ?? null,
    variantId: data.variantId,
    model: data.model ?? null,
  }
}

export function parseHeightMessage(data) {
  if (!data || data.type !== 'sinoa:product-height') return null
  const h = Number(data.height)
  if (!Number.isFinite(h) || h <= 0) return null
  return h
}
```

- [ ] **Step 4: Lancer les tests pour vérifier le succès**

Run:
```bash
npx vitest run src/lib/shopifyBridge.test.js
```
Expected: PASS — tous les tests verts.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shopifyBridge.js src/lib/shopifyBridge.test.js
git commit -m "feat: module pont postMessage (origine + parsing panier)"
```

---

## Task 4: Composant `ShopifyProductFrame.jsx`

**Files:**
- Create: `src/components/composants/ShopifyProductFrame.jsx`

> Pas de test unitaire automatisé ici (intégration iframe/cross-origin) — vérification au build + manuelle (Task 8). La logique testable est déjà couverte par les Tasks 2 et 3.

- [ ] **Step 1: Écrire le composant**

Créer `src/components/composants/ShopifyProductFrame.jsx` :
```jsx
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from './Header'
import RespNav from '../resp/RespNav'
import Footer from './Footer'
import { useCart } from '../../context/CartContext'
import { SHOPIFY_STORE, storeOrigin, productEmbedUrl } from '../../lib/shopifyConfig'
import { isAllowedOrigin, parseAddToCartMessage, parseHeightMessage } from '../../lib/shopifyBridge'

const MIN_HEIGHT = 600

export default function ShopifyProductFrame() {
  const { slug } = useParams()
  const { addToCart, openCart } = useCart()
  const [height, setHeight] = useState(MIN_HEIGHT)
  const [loaded, setLoaded] = useState(false)

  const src = productEmbedUrl(SHOPIFY_STORE, slug)
  const allowedOrigin = storeOrigin(SHOPIFY_STORE)

  useEffect(() => {
    const handler = (event) => {
      if (!isAllowedOrigin(event.origin, allowedOrigin)) return

      const h = parseHeightMessage(event.data)
      if (h) {
        setHeight(Math.max(MIN_HEIGHT, h))
        return
      }

      const add = parseAddToCartMessage(event.data)
      if (add) {
        addToCart(add.product, add.quantity, add.size, add.color, add.variantId, add.model)
        openCart()
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [allowedOrigin, addToCart, openCart])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="hidden lg:block"><Navbar /></div>
      <div className="lg:hidden"><RespNav /></div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-2 md:px-4">
        {!src && (
          <div className="py-20 text-center text-red-500">
            Configuration Shopify manquante (VITE_SHOPIFY_STORE).
          </div>
        )}

        {src && (
          <>
            {!loaded && (
              <div className="py-20 text-center text-gray-500">Chargement du produit…</div>
            )}
            <iframe
              src={src}
              title="Fiche produit"
              onLoad={() => setLoaded(true)}
              scrolling="no"
              style={{ width: '100%', height: `${height}px`, border: 'none', display: 'block' }}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Vérifier que le build passe**

Run:
```bash
npm run build
```
Expected: build réussi, aucune erreur d'import (le composant n'est pas encore routé, on valide juste sa compilation).

- [ ] **Step 3: Commit**

```bash
git add src/components/composants/ShopifyProductFrame.jsx
git commit -m "feat: composant ShopifyProductFrame (iframe produit + pont panier)"
```

---

## Task 5: Brancher la route + unifier la variable d'env

**Files:**
- Modify: `src/App.jsx:23,88`
- Modify: `src/components/composants/ShopifyProducts.jsx:115`

- [ ] **Step 1: Importer le nouveau composant dans `App.jsx`**

Dans `src/App.jsx`, remplacer la ligne 23 :
```jsx
import ProductDetailPage from './pages/ProductDetailPage'
```
par :
```jsx
// ProductDetailPage conservé (src/pages/ProductDetailPage.jsx) comme repli/rollback.
import ShopifyProductFrame from './components/composants/ShopifyProductFrame'
```

- [ ] **Step 2: Pointer la route produit sur le nouveau composant**

Dans `src/App.jsx`, remplacer la ligne 88 :
```jsx
      <Route path="/product/:slug" element={<ProductDetailPage />} />
```
par :
```jsx
      <Route path="/product/:slug" element={<ShopifyProductFrame />} />
```

- [ ] **Step 3: Unifier la variable d'env dans `ShopifyProducts.jsx`**

Dans `src/components/composants/ShopifyProducts.jsx`, en haut du fichier (avec les autres imports), ajouter :
```jsx
import { storeOrigin, SHOPIFY_STORE } from '../../lib/shopifyConfig'
```
Puis remplacer la ligne 115 :
```jsx
                  href={`https://${import.meta.env.VITE_SHOPIFY_STORE_NAME}/products/${node.handle}`}
```
par :
```jsx
                  href={`${storeOrigin(SHOPIFY_STORE)}/products/${node.handle}`}
```

- [ ] **Step 4: Vérifier build + lint**

Run:
```bash
npm run build && npm run lint
```
Expected: build OK ; lint sans nouvelle erreur (l'import `ProductDetailPage` n'existe plus, donc pas de warning « unused »).

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/composants/ShopifyProducts.jsx
git commit -m "feat: router /product/:slug vers ShopifyProductFrame + unifier VITE_SHOPIFY_STORE"
```

---

## Task 6: Documenter la configuration d'environnement

**Files:**
- Modify: `.env.example`
- Modify: `.env.shopify`

- [ ] **Step 1: Mettre à jour `.env.example`**

Remplacer tout le contenu de `.env.example` par :
```
# Backend API
VITE_API_URL=http://localhost:5000/api

# Shopify — domaine servant les pages /products (myshopify.com OU domaine custom)
# Format : boutique.myshopify.com  (sans https://)
VITE_SHOPIFY_STORE=votre-boutique.myshopify.com

# Shopify Storefront (checkout)
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
VITE_SHOPIFY_API_VERSION=2024-01
```

- [ ] **Step 2: Aligner `.env.shopify`**

Dans `.env.shopify`, sous la section « 1. Magasin Shopify », s'assurer que la variable s'appelle bien `VITE_SHOPIFY_STORE` (déjà le cas). Ajouter en dessous le commentaire :
```
# NB : doit correspondre au domaine qui sert /products/{handle}
# (utilisé pour l'URL de l'iframe produit ET la validation d'origine postMessage).
```

- [ ] **Step 3: Commit**

```bash
git add .env.example .env.shopify
git commit -m "docs: standardiser VITE_SHOPIFY_STORE dans la config d'env"
```

---

## Task 7: Côté Shopify — template embed + section + snippet pont (Liquid)

**Files:**
- Create: `shopify-theme/layout/theme.embed.liquid`
- Create: `shopify-theme/templates/product.embed.liquid`
- Create: `shopify-theme/sections/sinoa-product-embed.liquid`
- Create: `shopify-theme/snippets/sinoa-react-bridge.liquid`

> Ces fichiers sont versionnés ici pour référence ; ils doivent être **collés dans le code du thème Shopify** (même arborescence `layout/`, `templates/`, `sections/`, `snippets/`). La vérification réelle se fait dans Shopify (Task 8).
>
> **NOTE format `variantId` :** le snippet émet par défaut un **GID** (`gid://shopify/ProductVariant/{id}`), format standard Storefront. Si le backend `/shopify-checkout` attend l'**ID numérique**, remplacer `var variantId = 'gid://shopify/ProductVariant/' + rawId` par `var variantId = String(rawId)` dans le snippet.

- [ ] **Step 1: Créer le layout allégé**

Créer `shopify-theme/layout/theme.embed.liquid` :
```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ product.title | default: shop.name }}</title>
    {{ content_for_header }}
    <style>
      body.sinoa-embed { margin: 0; padding: 16px; background: #fff; font-family: system-ui, sans-serif; }
      .sinoa-product { display: grid; gap: 24px; grid-template-columns: 1fr; max-width: 1100px; margin: 0 auto; }
      @media (min-width: 768px) { .sinoa-product { grid-template-columns: 1fr 1fr; } }
      .sinoa-product__media img { width: 100%; height: auto; border-radius: 12px; }
      .sinoa-product__price { font-size: 1.5rem; font-weight: 700; margin: 12px 0; color: #5E2251; }
      .sinoa-product select, .sinoa-product input { padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 12px; width: 100%; box-sizing: border-box; }
      .sinoa-product button[type="submit"] { background:#5E2251; color:#fff; border:0; padding:12px 20px; border-radius:8px; cursor:pointer; font-weight:600; }
    </style>
  </head>
  <body class="sinoa-embed">
    {{ content_for_layout }}
  </body>
</html>
```

- [ ] **Step 2: Créer le template produit embed**

Créer `shopify-theme/templates/product.embed.liquid` :
```liquid
{% layout 'theme.embed' %}
{% section 'sinoa-product-embed' %}
```

- [ ] **Step 3: Créer la section produit**

Créer `shopify-theme/sections/sinoa-product-embed.liquid` :
```liquid
{%- comment -%}
  Section produit minimale pour l'embed React.
  Pour laisser une app de bundle injecter ses blocs, remplacer le contenu
  par la section produit native du thème, en gardant {%- raw -%}{% render 'sinoa-react-bridge' %}{%- endraw -%} à la fin.
{%- endcomment -%}
<div class="sinoa-product">
  <div class="sinoa-product__media">
    {%- if product.featured_image -%}
      <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.featured_image.alt | escape }}" loading="eager">
    {%- endif -%}
  </div>

  <div class="sinoa-product__info">
    <h1>{{ product.title }}</h1>
    <div class="sinoa-product__price">{{ product.selected_or_first_available_variant.price | money }}</div>

    {%- form 'product', product -%}
      {%- if product.variants.size > 1 -%}
        <select name="id">
          {%- for v in product.variants -%}
            <option value="{{ v.id }}" {% unless v.available %}disabled{% endunless %}>
              {{ v.title }} — {{ v.price | money }}
            </option>
          {%- endfor -%}
        </select>
      {%- else -%}
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
      {%- endif -%}

      <input type="number" name="quantity" value="1" min="1">
      <button type="submit" name="add">Ajouter au panier</button>
    {%- endform -%}

    <div class="sinoa-product__description">{{ product.description }}</div>
  </div>
</div>

{%- render 'sinoa-react-bridge' -%}

{% schema %}
{ "name": "Sinoa Product Embed", "settings": [] }
{% endschema %}
```

- [ ] **Step 4: Créer le snippet pont**

Créer `shopify-theme/snippets/sinoa-react-bridge.liquid` :
```liquid
{%- comment -%}
  Pont entre la page produit Shopify embarquée et l'app React parente.
  Intercepte l'ajout au panier et le renvoie via postMessage au lieu du panier Shopify.
  ⚠️ Éditer REACT_ORIGIN ci-dessous pour qu'il corresponde au domaine de l'app React (Netlify).
{%- endcomment -%}
<script>
(function () {
  var REACT_ORIGIN = 'https://kpopshop.netlify.app'; // ⚠️ domaine de l'app React
  var VARIANTS = {{ product.variants | json }};
  var PRODUCT = {
    id: {{ product.id | json }},
    name: {{ product.title | json }},
    image: {{ product.featured_image | image_url: width: 800 | json }}
  };

  function send(msg) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(msg, REACT_ORIGIN);
      }
    } catch (e) {}
  }

  function postHeight() {
    var h = Math.ceil(document.documentElement.scrollHeight);
    if (h > 0) send({ type: 'sinoa:product-height', height: h });
  }

  function findVariant(id) {
    id = String(id);
    for (var i = 0; i < VARIANTS.length; i++) {
      if (String(VARIANTS[i].id) === id) return VARIANTS[i];
    }
    return null;
  }

  document.addEventListener('submit', function (e) {
    var form = e.target && e.target.closest ? e.target.closest('form[action*="/cart/add"]') : null;
    if (!form) return;
    e.preventDefault();
    e.stopPropagation();

    var fd = new FormData(form);
    var rawId = fd.get('id');
    var quantity = parseInt(fd.get('quantity') || '1', 10) || 1;
    var v = findVariant(rawId);

    // Format Storefront standard. Voir NOTE du plan pour basculer en ID numérique.
    var variantId = 'gid://shopify/ProductVariant/' + rawId;
    var price = v ? (v.price / 100) : null;
    var image = (v && v.featured_image ? v.featured_image.src : PRODUCT.image);

    send({
      type: 'sinoa:add-to-cart',
      product: {
        id: PRODUCT.id,
        name: PRODUCT.name,
        price: price,
        image: image,
        variants: [{ id: variantId, price: price, image_url: image }]
      },
      quantity: quantity,
      size: v ? (v.option1 || null) : null,
      color: v ? (v.option2 || null) : null,
      model: v ? (v.option3 || null) : null,
      variantId: variantId
    });
  }, true);

  if (window.ResizeObserver) {
    try { new ResizeObserver(postHeight).observe(document.body); } catch (e) {}
  }
  window.addEventListener('load', postHeight);
  document.addEventListener('DOMContentLoaded', postHeight);
})();
</script>
```

- [ ] **Step 5: Commit**

```bash
git add shopify-theme/
git commit -m "feat: thème Shopify — layout/template/section embed + snippet pont"
```

---

## Task 8: Vérification end-to-end (manuelle)

**Files:** aucun (validation).

> Prérequis : `VITE_SHOPIFY_STORE` renseigné dans `.env`, et les 4 fichiers Liquid de la Task 7 **collés dans le thème Shopify**, avec `REACT_ORIGIN` ajusté dans le snippet.

- [ ] **Step 1: Vérifier la suite de tests + le build**

Run:
```bash
npm run test && npm run build
```
Expected: tous les tests verts ; build réussi.

- [ ] **Step 2: Vérifier le template embed côté Shopify (hors iframe)**

Ouvrir directement dans un navigateur :
`https://{VITE_SHOPIFY_STORE}/products/{un-slug-existant}?view=embed`
Expected: la page produit s'affiche **sans header/footer** du thème (layout allégé), avec sélecteur de variante, quantité et bouton « Ajouter au panier ».

- [ ] **Step 3: Lancer l'app React et tester un produit**

Run:
```bash
npm run dev
```
Puis naviguer vers `/product/{un-slug-existant}`.
Expected: le `Header`/`Footer` React s'affichent, l'iframe produit Shopify se charge dedans, hauteur ajustée (pas de double scroll).

> Dépannage CSP : les pages storefront `/products/...` sont normalement embarquables (contrairement au checkout). Si l'iframe reste blanche avec une erreur `frame-ancestors` en console, vérifier qu'aucune app de sécurité du thème n'impose une CSP restrictive sur le storefront.

- [ ] **Step 4: Tester l'ajout au panier (produit simple)**

Cliquer « Ajouter au panier » dans l'iframe.
Expected: le `CartModal` React s'ouvre avec la bonne ligne (nom, prix, image), quantité correcte.

- [ ] **Step 5: Tester variantes + checkout**

Sélectionner une variante (taille/couleur), ajouter, puis cliquer sur Checkout.
Expected: l'article a le bon `variantId` ; `createShopifyCheckout` ne rejette pas l'article ; redirection vers le checkout Shopify (top-level).

> Si l'article est rejeté (« variantId Shopify manquant ») → appliquer la NOTE de la Task 7 (basculer en ID numérique dans le snippet) et re-tester.

- [ ] **Step 6: Vérifier la sécurité d'origine**

Dans la console du navigateur, exécuter :
```js
window.postMessage({ type: 'sinoa:add-to-cart', product: { id: 1 }, variantId: 'x' }, '*')
```
Expected: **rien ne s'ajoute** au panier (origine `window.location.origin` ≠ origine Shopify → message ignoré).

- [ ] **Step 7: Commit (si ajustements)**

```bash
git add -A
git commit -m "test: vérification end-to-end page produit embarquée"
```

---

## Notes d'implémentation

- **Bundles multi-lignes :** non couverts par ce plan (cf. spec §5). Le snippet actuel envoie un seul article par submit. Si une app de bundle ajoute plusieurs lignes, prévoir un lot ultérieur : émettre un message `sinoa:add-to-cart` par composant, ou basculer ces produits vers le checkout Shopify direct. Décision à prendre selon l'app de bundle réellement utilisée.
- **Rollback :** `src/pages/ProductDetailPage.jsx` est conservé. Pour revenir en arrière, ré-importer `ProductDetailPage` dans `App.jsx` et repointer la route.
- **`variantId` :** point de vérification clé (GID vs numérique), tranché en Task 8 Step 5.
