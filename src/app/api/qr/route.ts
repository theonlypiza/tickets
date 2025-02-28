import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import pdf from "html-pdf-node";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    // Generate a UUID for the QR code
    const uuid = uuidv4();

    // Generate QR Code as a base64 image
    const qrBuffer = await QRCode.toBuffer(uuid);
    const qrBase64 = `data:image/png;base64,${qrBuffer.toString("base64")}`;

    // Create a temporary directory for the PDF if it doesn't exist
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    // Define the PDF file path
    const pdfPath = path.join(tmpDir, `${uuid}.pdf`);

    // Create an HTML template
    const htmlContent = `
      <html>
        <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .container { max-width: 600px; margin: auto; border: 2px solid #000; padding: 20px; }
          .logo { text-align: center; margin-bottom: 20px; }
          .qr { text-align: center; margin-top: 20px; }
          .details { margin-top: 20px; font-size: 14px; }
          .details strong { display: inline-block; width: 150px; }
        </style>
        </head>
        <body>
          <div class="logo">
            <img src="https://img.freepik.com/free-vector/hand-drawn-culture-logo-design_23-2149857661.jpg" width="150" alt="Company Logo" />
          </div>
          <h2 style="text-align: center;">ENTRADA DIGITAL</h2>
          <div class="details">
            <p><strong>EVENTO:</strong> DEBORAH DE LUCA EN COSTA RICA</p>
            <p><strong>ORGANIZADOR:</strong> XTYLE PRODUCTIONS CR</p>
            <p><strong>LUGAR:</strong> Wyndham San Jose Herradura Hotel & Convention Center</p>
            <p><strong>HORA DE INICIO:</strong> 2025-02-15 21:00</p>
            <p><strong>HORA DE FINALIZACIÓN:</strong> 2025-02-16 06:00</p>
            <p><strong>NOMBRE:</strong> Luis Diego Pizarro Moreno</p>
            <p><strong>TIPO DE ENTRADA:</strong> FRONT STAGE (2 entradas)</p>
            <p><strong>REF. PEDIDO:</strong> 12aah2h71v-1</p>
            <p><strong>FECHA DE COMPRA:</strong> 2024-12-10 00:05</p>
            <p><strong>PRECIO:</strong> $55.50 (inc. $5.50)</p>
          </div>
          <div class="qr">
            <img src="${qrBase64}" width="400" height="400" alt="QR Code" />
          </div>
        </body>
      </html>
    `;

    // Generate PDF from HTML using html-pdf-node
    const file = { content: htmlContent };
    const pdfBuffer = await pdf.generatePdf(file, { format: "A4" });

    // Save the PDF to the tmp folder
    fs.writeFileSync(pdfPath, pdfBuffer);

    return NextResponse.json({ pdfPath }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
