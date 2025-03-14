import { NextApiRequest, NextApiResponse } from "next";
import {
  createProductGraphQL,
  fetchProductsGraphQL,
  postProduct,
} from "@/lib/shopify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    try {
      const products = (await fetchProductsGraphQL()) as any;
      return res.status(200).json(products?.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method == "POST") {
    const productData = req.body;
    try {
      const response = (await createProductGraphQL(productData)) as any;

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error posting product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
