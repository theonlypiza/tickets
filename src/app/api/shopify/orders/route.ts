import { fetchOrdersShopifyGraphQL } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await fetchOrdersShopifyGraphQL();
    console.log(products);
    return NextResponse.json(products?.data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
