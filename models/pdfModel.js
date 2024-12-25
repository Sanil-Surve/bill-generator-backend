const PDFDocument = require("pdfkit");

exports.createPDF = (customerName, items, res) => {
  const doc = new PDFDocument({ margin: 30 });
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      "Content-Length": Buffer.byteLength(pdfData),
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=bill.pdf",
    }).end(pdfData);
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
  doc.moveTo(startX, startY).lineTo(startX + 530, startY).stroke();

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
  doc.moveTo(startX, startY).lineTo(startX + 530, startY).stroke();

  startY += 10;
  doc.font("Helvetica-Bold").text(`Grand Total: Rs. ${totalAmount}`, startX + 350, startY, {
    width: 180,
    align: "right",
  });

  doc.end();
};