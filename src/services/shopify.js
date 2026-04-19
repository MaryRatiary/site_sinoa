// Service Shopify pour les paiements et synchronisation

const SHOPIFY_STORE = import.meta.env.VITE_SHOPIFY_STORE;
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION;

const SHOPIFY_ENDPOINT = `https://${SHOPIFY_STORE}/api/${API_VERSION}/graphql.json`;

/**
 * Exécute une requête GraphQL vers Shopify
 */
const shopifyRequest = async (query, variables = {}) => {
  try {
    const response = await fetch(SHOPIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify GraphQL Error:', data.errors);
      throw new Error(data.errors[0]?.message || 'Shopify API Error');
    }

    return data.data;
  } catch (error) {
    console.error('Shopify Request Error:', error);
    throw error;
  }
};

/**
 * Crée un panier Shopify et retourne l'URL de checkout
 * @param {Array} items - Tableau des articles [{merchandiseId, quantity}]
 * @returns {Promise<string>} URL de checkout Shopify
 */
export const createShopifyCheckout = async (items) => {
  const query = `
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: items.map(item => ({
        quantity: item.quantity,
        merchandiseId: item.merchandiseId,
      })),
    },
  };

  const data = await shopifyRequest(query, variables);
  
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return {
    cartId: data.cartCreate.cart.id,
    checkoutUrl: data.cartCreate.cart.checkoutUrl,
  };
};

/**
 * Récupère les détails d'un produit Shopify
 * @param {string} product_id - ID du produit Shopify
 * @returns {Promise<Object>} Détails du produit
 */
export const getShopifyProduct = async (product_id) => {
  const query = `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              image {
                url
              }
              availableForSale
              quantityAvailable
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const variables = { id: product_id };
  const data = await shopifyRequest(query, variables);

  return data.product;
};

/**
 * Récupère tous les produits Shopify
 * @param {number} first - Nombre de produits à récupérer
 * @returns {Promise<Array>} Liste des produits
 */
export const getShopifyProducts = async (first = 50) => {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { first };
  const data = await shopifyRequest(query, variables);

  return data.products.edges.map(edge => edge.node);
};

/**
 * Crée une commande dans Shopify depuis une commande locale
 * Utilisé pour synchroniser les commandes
 */
export const syncOrderToShopify = async (order, items) => {
  // Créer un panier avec les articles
  const checkoutData = await createShopifyCheckout(
    items.map(item => ({
      merchandiseId: item.shopifyVariantId,
      quantity: item.quantity,
    }))
  );

  return {
    shopifyCartId: checkoutData.cartId,
    shopifyCheckoutUrl: checkoutData.checkoutUrl,
    orderId: order.id,
  };
};

/**
 * Webhook handler pour les commandes Shopify payées
 * À utiliser côté backend pour traiter les webhooks
 */
export const handleShopifyWebhook = (webhookBody) => {
  const order = webhookBody;
  
  return {
    orderId: order.id,
    email: order.email,
    totalPrice: order.total_price,
    status: order.fulfillment_status || 'pending',
    items: order.line_items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })),
  };
};

/**
 * Récupère les commandes Shopify (admin API required)
 * À utiliser côté backend uniquement
 */
export const getShopifyOrders = async (accessToken, store, limit = 10) => {
  const query = `
    query GetOrders($first: Int!) {
      orders(first: $first) {
        edges {
          node {
            id
            orderNumber
            email
            created_at
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            fulfillmentStatus
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { first: limit };

  // Cette requête nécessite l'Admin API token (pas le Storefront token)
  const response = await fetch(
    `https://${store}/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  const data = await response.json();
  return data.data.orders.edges.map(edge => edge.node);
};

export default {
  createShopifyCheckout,
  getShopifyProduct,
  getShopifyProducts,
  syncOrderToShopify,
  handleShopifyWebhook,
  getShopifyOrders,
};
