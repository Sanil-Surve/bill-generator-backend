const express = require("express");
const router = express.Router();
const { generatePDF } = require("../controllers/pdfController");

// POST: Generate PDF
router.post("/generate-pdf", generatePDF);

module.exports = router;