const express = require("express");
const PDFDocument = require("pdfkit");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-pdf", (req, res) => {
  const { customerName, items } = req.body;

  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const doc = new PDFDocument({ margin: 30 });
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=bill.pdf",
      })
      .end(pdfData);
  });

  // Document Title
  doc.fontSize(20).text("Bill Receipt", { align: "center" }).moveDown();
  doc.fontSize(14).text(`Customer Name: ${customerName}`).moveDown();

  // Table Header
  const startX = 50;
  let startY = 200;

  doc.fontSize(12).font("Helvetica-Bold");
  doc.text("No.", startX, startY, { width: 40, align: "center" });
  doc.text("Item", startX + 50, startY, { width: 200, align: "left" });
  doc.text("Quantity", startX + 260, startY, { width: 80, align: "center" });
  doc.text("Price", startX + 350, startY, { width: 80, align: "center" });
  doc.text("Total", startX + 450, startY, { width: 80, align: "center" });

  startY += 20;
  doc
    .moveTo(startX, startY)
    .lineTo(startX + 530, startY)
    .stroke();

  let totalAmount = 0;
  items.forEach((item, index) => {
    startY += 20;
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    doc.text(index + 1, startX, startY, { width: 40, align: "center" });
    doc.text(item.name, startX + 50, startY, { width: 200, align: "left" });
    doc.text(item.quantity.toString(), startX + 260, startY, {
      width: 80,
      align: "center",
    });
    doc.text(`Rs. ${item.price}`, startX + 350, startY, {
      width: 80,
      align: "center",
    });
    doc.text(`Rs. ${itemTotal}`, startX + 450, startY, {
      width: 80,
      align: "center",
    });
  });

  startY += 20;
  doc
    .moveTo(startX, startY)
    .lineTo(startX + 530, startY)
    .stroke();

  // doc.font('Helvetica-Bold').text(`Grand Total: Rs. ${totalAmount}`, startX + 350, startY, { align: 'right' });
  // Total Amount
  startY += 10;
  doc
    .font("Helvetica-Bold")
    .text(`Grand Total: Rs. ${totalAmount}`, startX + 350, startY, {
      width: 180,
      align: "right",
    });

  doc.end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
