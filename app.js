const express = require("express");
const cors = require("cors");
const pdfRoutes = require("./routes/pdfRoutes");
const corsConfig = require("./config/corsConfig");

const app = express();

// Middleware
app.use(cors(corsConfig));
app.use(express.json());

// Routes
app.use("/api", pdfRoutes);

module.exports = app;