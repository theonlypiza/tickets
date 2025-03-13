import { NextApiRequest, NextApiResponse } from "next";
import { fetchOrdersShopifyGraphQL } from "@/lib/shopify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const id = req.query.id as string;

    if (!id) {
      return res.status(400).json({ error: "Missing order id" });
    }

    const orders = (await fetchOrdersShopifyGraphQL(id)) as any;
    return res.status(200).json(orders?.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
