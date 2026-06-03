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
  it('rejette si variantId manquant (checkout l\'exige)', () => {
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
