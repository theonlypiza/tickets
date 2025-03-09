import { shopifyApi, ApiVersion, Session } from "@shopify/shopify-api";
import { v4 as uuidv4 } from "uuid";
import "@shopify/shopify-api/adapters/node";

// Initialize Shopify API client
export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY!,
  scopes: ["read_products", "write_products"],
  hostName: process.env.SHOPIFY_HOSTNAME!,
  apiVersion: ApiVersion.October22,
  isEmbeddedApp: false,
});

// Create a session with stored credentials
const session = new Session({
  id: uuidv4(),
  state: "state",
  shop: process.env.SHOPIFY_HOSTNAME!,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN!,
  isOnline: true,
});

// GraphQL Client
export const shopifyClient = new shopify.clients.Graphql({ session });

// Fetch Shopify Products
export const fetchProductsGraphQL = async () => {
  const query = `
query {
  products(first: 5) {
    edges {
      node {
        id
        title
        descriptionHtml
        images(first: 1) {
          edges {
            node {
              src
              altText
            }
          }
        }
      }
    }
  }
}

  `;

  try {
    const response = await shopifyClient.query({ data: query });
    return response.body;
  } catch (error) {
    console.error("Error fetching products via GraphQL:", error);
    throw new Error("Failed to fetch products");
  }
};

export const fetchOrdersShopifyGraphQL = async (eventId: string) => {
  const query = `
query {
  orders(first: 10, query: "tag:${eventId}") {
    edges {
      node {
        name  # Order name (e.g., #1001)
        confirmationNumber
        totalPriceSet {
          presentmentMoney {
            amount
            currencyCode
          }
        }
        displayFinancialStatus # Payment status (e.g., PAID, PENDING)
        paymentCollectionDetails {
          additionalPaymentCollectionUrl
        }
        customer {
          firstName
          lastName
        }
        lineItems(first: 10) {
          edges {
            node {
              title  # Product title
              quantity
            }
          }
        }
      }
    }
  }
}

  `;

  try {
    const response = await shopifyClient.query({ data: query });
    return response.body;
  } catch (error) {
    console.error("Error fetching orders via GraphQL:", error);
    throw new Error("Failed to fetch orders");
  }
};

export const fetchOrdersByProductId = async (productId: string) => {
  const response = await fetch(
    `https://${process.env.SHOPIFY_HOSTNAME}/admin/api/2025-01/orders.json?line_items.product_id=${productId}`,
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return await response.json();
};
