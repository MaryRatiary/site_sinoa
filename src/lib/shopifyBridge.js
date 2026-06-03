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
