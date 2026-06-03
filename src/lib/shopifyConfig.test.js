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
  it('construit l\'URL produit embed', () => {
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
