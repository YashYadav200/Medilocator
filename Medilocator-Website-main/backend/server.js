const dotenv = require("dotenv");
dotenv.config(); // Load env vars immediately

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

console.log("JWT_SECRET Loaded:", !!process.env.JWT_SECRET); // Debug Log

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const searchRoutes = require("./routes/searchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const supportRoutes = require("./routes/supportRoutes");

const app = express();

// Global Request Logger - Place FIRST to catch all traffic
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("MediLocator Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
