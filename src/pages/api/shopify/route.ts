import { fetchProductsGraphQL } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = (await fetchProductsGraphQL()) as any;
    console.log(products);
    return NextResponse.json(products?.data);
  } catch (error) {
    return NextResponse.json(error);
  }
}
