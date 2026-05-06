require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");

const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const storesRoutes = require("./routes/stores");
const usersRoutes = require("./routes/users");
const publicRoutes = require("./routes/public");
const customerAuthRoutes = require("./routes/customer-auth");
const productsRoutes = require("./routes/products");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/customer", customerAuthRoutes);
app.use("/api/products", productsRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 3001;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Asaar Masr CRM backend running on http://localhost:${PORT}`);
  });
});