const { createPDF } = require("../models/pdfModel");

exports.generatePDF = (req, res) => {
  const { customerName, items } = req.body;

  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    createPDF(customerName, items, res);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};