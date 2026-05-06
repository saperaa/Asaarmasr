import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load env before anything else
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

import AdminJS from "adminjs";
import { buildRouter } from "@adminjs/express";
import { Database, Resource } from "@adminjs/mongoose";
import mongoose from "mongoose";
import express from "express";
import session from "express-session";

// CJS models work via createRequire
const CrmUser = require("./models/CrmUser.js");
const Store = require("./models/Store.js");
const Order = require("./models/Order.js");
const Customer = require("./models/Customer.js");

AdminJS.registerAdapter({ Database, Resource });

const admin = new AdminJS({
  resources: [
    {
      resource: CrmUser,
      options: {
        navigation: { name: "CRM" },
        properties: { password_hash: { isVisible: false } },
      },
    },
    { resource: Store,    options: { navigation: { name: "Content" } } },
    { resource: Order,    options: { navigation: { name: "Sales" } } },
    { resource: Customer, options: {
        navigation: { name: "Customers" },
        properties: { password_hash: { isVisible: false } },
      },
    },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "Asaar Masr — Admin",
    logo: false,
    favicon: false,
    withMadeWithLove: false,
  },
});

const app = express();
app.use(session({
  secret: process.env.JWT_SECRET || "adminjs-dev-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

const adminRouter = buildRouter(admin);
app.use(admin.options.rootPath, adminRouter);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/asaarmasr";
await mongoose.connect(MONGODB_URI);
console.log("Admin: Connected to MongoDB");

const PORT = process.env.ADMIN_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Admin dashboard → http://localhost:${PORT}/admin`);
});
