"use client"; // Enables client-side fetching

import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  descriptionHtml: string;
  images: {
    edges: {
      node: {
        src: string;
        altText: string;
      };
    }[];
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/shopify/products");
        const data = await response.json();
        setProducts(data.products.edges.map((edge: any) => edge.node)); // Extract product data
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Shopify Products</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-md-4 mb-4">
                <div className="card">
                  <img
                    src={product.images?.edges[0]?.node.src || "/default-image.jpg"} // Fallback image
                    className="card-img-top"
                    alt={product.images?.edges[0]?.node.altText || "Product image"}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}></p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      )}
    </div>
  );
}
