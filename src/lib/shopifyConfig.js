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
