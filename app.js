const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Hardcoded local MongoDB URI
const MONGO_URI = "mongodb://127.0.0.1:27017/smilecare";

// Middleware
app.use(cors());
app.use(express.json());

// Connect to local MongoDB
mongoose.connect(MONGO_URI).catch(() => {}); // silently ignore errors for now

// Start server
const PORT = 3001;
app.listen(PORT, () => {});