import { shopifyApi, ApiVersion, Session } from "@shopify/shopify-api";
import { v4 as uuidv4 } from "uuid";
import "@shopify/shopify-api/adapters/node";
const axios = require("axios");

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
              variant{
                title
                price
              }
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
// not used, have it here for reference in case at some point the REST Admin API is needed and not the GraphQL
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

export const createProductGraphQL = async (productData: any) => {
  // const mutation = `
  //   mutation CreateProduct($input: ProductInput!) {
  //     productCreate(input: $input) {
  //       product {
  //         id
  //         title
  //       }
  //       userErrors {
  //         field
  //         message
  //       }
  //     }
  //   }
  // `;

  const mutationProduct = `
        mutation CreateProductWithVariants($productSet: ProductSetInput!, $synchronous: Boolean!) { 
           productSet(synchronous: $synchronous, input: $productSet) { 
            product { 
                id 
                title 
                variants(first: 5) { 
                  nodes { 
                      id 
                      inventoryItem {
                        id
                      }
                  }
                }
            }
            userErrors { 
              field 
              message 
            } 
          } 
      }`;

  const mutationVariant = `
      mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
        inventoryAdjustQuantities(input: $input) {
          userErrors {
            field
            message
          }
          inventoryAdjustmentGroup {
            createdAt
            reason
            referenceDocumentUri
            changes {
              name
              delta
            }
          }
        }
      }
  `;

  const locationid = "gid://shopify/Location/73867624536";

  const variablesProduct = {
    synchronous: true,
    productSet: {
      title: productData.title,
      vendor: productData.vendor,
      productOptions: [
        {
          name: "Ticket Type",
          values: [{ name: "General" }, { name: "VIP" }, { name: "Backstage" }],
        },
      ],
      variants: productData.variants?.map((variant: any) => ({
        price: variant.price,
        optionValues: [
          {
            optionName: "Ticket Type",
            name: variant.title,
          },
        ],
        inventoryItem: {
          tracked: true, // Enable inventory tracking
        },
      })),
    },
  };

  console.log("variables", variablesProduct);

  try {
    const response = await shopifyClient.query({
      data: {
        query: mutationProduct,
        variables: variablesProduct,
      },
    });

    console.log(response.body.data.productSet);
    console.log(response.body.data.productSet.product.variants.nodes);

    const variablesVariant = {
      input: {
        reason: "correction",
        name: "available",
        changes: response.body.data.productSet.product.variants.nodes?.map(
          (variant: any, index) => ({
            delta: productData.variants[index].quantity,
            inventoryItemId: variant.inventoryItem.id,
            locationId: locationid, // TODO - replace this value, or put it as an env variable
          })
        ),
      },
    };

    const responseFinal = await shopifyClient.query({
      data: {
        query: mutationVariant,
        variables: variablesVariant,
      },
    });

    console.log(responseFinal);

    // if (responseData && responseData.data.productCreate.userErrors.length) {
    //   console.error("Shopify Product Creation Errors:", response);
    //   return { success: false, errors: response};
    // }

    return { success: true, product: response };
  } catch (error) {
    console.error("Error creating product via GraphQL:", error);
    return { success: false, error: "Failed to create product" };
  }
};

export const postProduct = async (productData: any) => {
  // Shopify REST API URL for creating a product
  const url = `https://${process.env.SHOPIFY_HOSTNAME}/admin/api/2025-01/products.json`;

  // Make the POST request to create the product
  axios
    .post(url, productData, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
      },
    })
    .then((response) => {
      console.log("Product created successfully:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error creating product:",
        error.response?.data || error.message
      );
    });
};
