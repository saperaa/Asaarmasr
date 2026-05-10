const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CrmUser = require("./models/CrmUser");
const Store = require("./models/Store");
const Order = require("./models/Order");
const Product = require("./models/Product");

async function initDb() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/asaarmasr";
  await mongoose.connect(uri, { tls: true, tlsAllowInvalidCertificates: false });
  console.log("Connected to MongoDB");

  // Seed each collection independently so adding new ones never re-runs old ones
  if (await CrmUser.countDocuments() === 0) await seedUsers();
  if (await Store.countDocuments() === 0) await seedStoresAndOrders();
  if (await Product.countDocuments() === 0) await seedProducts();
}

async function seedUsers() {
  await CrmUser.create([
    { name: "Admin User",  email: "admin@asaarmasr.com",   password_hash: bcrypt.hashSync("admin123", 10), role: "admin" },
    { name: "Shipper One", email: "shipper@asaarmasr.com", password_hash: bcrypt.hashSync("ship123",  10), role: "shipper" },
  ]);
  console.log("Seeded CRM users");
}

async function seedStoresAndOrders() {
  const cairo = await Store.create({
    name_en: "Cairo Gold Center",
    name_ar: "مركز القاهرة للذهب",
    address_en: "12 Tahrir Square, Downtown Cairo",
    address_ar: "١٢ ميدان التحرير، وسط القاهرة",
    phone: "+20 2 2345 6789",
    city_en: "Cairo",
    city_ar: "القاهرة",
    image_url: "",
    active: true,
  });

  const alex = await Store.create({
    name_en: "Alexandria Luxury Jewels",
    name_ar: "مجوهرات الإسكندرية الفاخرة",
    address_en: "5 Corniche Road, Alexandria",
    address_ar: "٥ طريق الكورنيش، الإسكندرية",
    phone: "+20 3 4567 8901",
    city_en: "Alexandria",
    city_ar: "الإسكندرية",
    image_url: "",
    active: true,
  });

  await Order.create([
    { customer_name: "Ahmed Hassan", customer_email: "ahmed@example.com", product: "Gold Bars 24K",    quantity: 2, total_egp: 8570,  status: "pending",    store_id: cairo._id },
    { customer_name: "Sara Mohamed", customer_email: "sara@example.com",  product: "Gold Coins 21K",   quantity: 5, total_egp: 18745, status: "processing", store_id: alex._id },
    { customer_name: "Khaled Nour",  customer_email: "khaled@example.com",product: "Gold Jewelry 18K", quantity: 1, total_egp: 3214,  status: "shipped",    store_id: cairo._id },
    { customer_name: "Nadia Farouk", customer_email: "nadia@example.com", product: "Gold Bars 24K",    quantity: 3, total_egp: 12855, status: "delivered",  store_id: alex._id },
  ]);
  console.log("Seeded stores and orders");
}

async function seedProducts() {
  await Product.create([
    {
      name_en: "Gold Bars",
      name_ar: "سبائك ذهب",
      karat: "24K",
      description_en: "Investment-grade pure gold bars. Internationally certified and hallmarked.",
      description_ar: "سبائك ذهب خالص معتمدة دولياً ومختومة.",
      image_url: "",
      active: true,
    },
    {
      name_en: "Gold Coins",
      name_ar: "عملات ذهبية",
      karat: "21K",
      description_en: "Collectible and tradeable Egyptian gold coins. Classic heritage designs.",
      description_ar: "عملات ذهبية مصرية للجمع والتداول بتصميمات تراثية.",
      image_url: "",
      active: true,
    },
    {
      name_en: "Gold Jewelry",
      name_ar: "مجوهرات ذهب",
      karat: "18K",
      description_en: "Handcrafted Egyptian-inspired gold jewelry. Timeless luxury.",
      description_ar: "مجوهرات ذهب مستوحاة من الحضارة المصرية. فخامة خالدة.",
      image_url: "",
      active: true,
    },
  ]);
  console.log("Seeded products");
}

module.exports = { initDb };
