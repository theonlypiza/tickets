import { NextResponse } from "next/server";
import crypto from "crypto";

const SHOPIFY_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text(); // Get raw request body for HMAC verification
    const hmac = req.headers.get("x-shopify-hmac-sha256") || "";

    //Verify the HMAC signature
    const generatedHmac = crypto
      .createHmac("sha256", SHOPIFY_SECRET)
      .update(rawBody, "utf8")
      .digest("base64");

    if (generatedHmac !== hmac) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    console.log("Shopify Checkout Webhook Received:", payload);

    fetch("/api/qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shopify-hmac-sha256": hmac,
      },
      body: payload,
    });
    // .then((response) => response.json())
    // .then((data) => console.log("Response:", data))
    // .catch((error) => console.error("Error:", error));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
