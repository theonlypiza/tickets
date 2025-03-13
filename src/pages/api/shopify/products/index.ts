import { NextApiRequest, NextApiResponse } from "next";
import { fetchProductsGraphQL } from "@/lib/shopify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const products = (await fetchProductsGraphQL()) as any;
    return res.status(200).json(products?.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
