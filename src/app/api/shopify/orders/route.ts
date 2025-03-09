import {
  fetchOrdersByProductId,
  fetchOrdersShopifyGraphQL,
} from "@/lib/shopify";
import { NextRequest, NextResponse } from "next/server";

// This is for routes like /api/products?id=123
export async function GET(request: NextRequest) {
  try {
    // Get id from query parameters
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );
    }

    const orders = await fetchOrdersShopifyGraphQL(id); // Pass the id to your function
    return NextResponse.json(orders?.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
