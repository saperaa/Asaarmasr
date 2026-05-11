const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CrmUser = require("./models/CrmUser");
const Store = require("./models/Store");
const Order = require("./models/Order");
const Product = require("./models/Product");
const BlogPost = require("./models/BlogPost");

async function initDb() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/asaarmasr";
  const isAtlas = uri.startsWith("mongodb+srv://");
  await mongoose.connect(uri, isAtlas ? { tls: true, tlsAllowInvalidCertificates: false } : {});
  console.log("Connected to MongoDB");

  // Seed each collection independently so adding new ones never re-runs old ones
  if (await CrmUser.countDocuments() === 0) await seedUsers();
  if (await Store.countDocuments() === 0) await seedStoresAndOrders();
  if (await Product.countDocuments() === 0) await seedProducts();
  if (await BlogPost.countDocuments() === 0) await seedBlogPosts();
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

async function seedBlogPosts() {
  await BlogPost.create([
    {
      title: "Gold Hits New Record High in Egypt as Pound Weakens",
      summary: "As the Egyptian Pound faces renewed pressure, gold prices have surged to record highs. We analyze the market forces at play and what this means for everyday Egyptians.",
      content: "Gold prices in Egypt have reached unprecedented levels as the Egyptian Pound continues to face significant depreciation pressure. This surge has been driven by a combination of global economic uncertainty, rising inflation, and domestic currency challenges.\n\nFor many Egyptians, gold has always been more than an investment — it is a store of wealth passed down through generations. In times of currency instability, families turn to gold as a reliable hedge against inflation.\n\nThe price of 24K gold per gram has climbed sharply over the past quarter, with 21K — the most popular karat for jewelry in Egypt — following closely. Jewelers across Cairo and Alexandria report record footfall as buyers rush to convert savings into physical gold.\n\nAnalysts at major Egyptian banks suggest that the trend may continue in the short term, particularly if global geopolitical tensions persist. However, they caution that sharp corrections are possible if the Central Bank of Egypt introduces new monetary policy measures.\n\nFor investors, the current environment favors gold as a defensive asset. Diversifying a portion of savings into gold — whether physical, certificates, or savings accounts — remains a sound strategy in volatile periods.",
      category: "Market Analysis",
      author: "Ahmed Hassan",
      read_time: "4 min",
      trend: "up",
      published: true,
    },
    {
      title: "5 Things to Know Before Buying Gold in Egypt",
      summary: "Whether you're a first-time buyer or an experienced investor, these five tips will help you navigate the Egyptian gold market confidently and avoid common pitfalls.",
      content: "Buying gold in Egypt can be a rewarding experience, but it pays to be informed before you walk into a jeweler or investment office. Here are five essential things every buyer should know.\n\n1. Understand Karat Purity\nGold purity is measured in karats. 24K is pure gold, while 21K (87.5% gold) is the most common for jewelry in Egypt. 18K offers more durability at a slight cost to purity. Always confirm the karat before purchasing.\n\n2. Know the Daily Price\nGold prices change every day. Check the official price published by the Egyptian Gold Division before you buy, and compare it with what the jeweler is quoting. A small markup for craftsmanship is normal, but excessive markups should be questioned.\n\n3. Ask for a Certificate\nFor investment-grade gold bars and coins, always request an official certificate of authenticity. Reputable dealers will provide hallmarking documentation as standard.\n\n4. Factor in Making Charges\nFor jewelry, jewelers charge a manufacturing fee on top of the gold price. This fee varies significantly between shops and can range from 10% to over 30% of the gold value. Negotiate when possible.\n\n5. Choose Reputable Dealers\nBuy only from licensed jewelers and established gold shops. Look for membership in the Egyptian Goldsmiths Association, and avoid street vendors or unverified online sellers.",
      category: "Investment Tips",
      author: "Sara Mostafa",
      read_time: "6 min",
      trend: "neutral",
      published: true,
    },
    {
      title: "How USD/EGP Rate Impacts Your Gold Purchase",
      summary: "The relationship between the US Dollar and Egyptian Pound directly affects gold prices in Egypt. Learn how to use currency trends to time your purchases more effectively.",
      content: "Gold is priced globally in US Dollars, which means that every fluctuation in the USD/EGP exchange rate has a direct and immediate impact on the price of gold in Egyptian Pounds.\n\nWhen the Egyptian Pound weakens against the Dollar, the local price of gold rises — even if the international gold price in dollars remains unchanged. Conversely, a stronger Pound can bring local gold prices down.\n\nUnderstanding this dynamic is crucial for timing your gold purchases intelligently. Here is how to apply it:\n\nMonitor the Exchange Rate Daily\nKeep an eye on the official USD/EGP rate published by the Central Bank of Egypt. Apps and financial news websites update this in real time. A sudden drop in the Pound's value is a signal that gold prices in Egypt are about to climb.\n\nWatch International Gold Spot Price\nThe London Bullion Market Association (LBMA) sets the international benchmark. Track the spot price in USD per troy ounce. If the dollar price is falling but the Pound is weakening faster, local prices may still rise.\n\nTime Purchases Around Stability Windows\nHistorically, the Pound has shown brief periods of stability following Central Bank interventions. These windows can offer slightly better purchasing rates for gold buyers.\n\nDiversify Currency Exposure\nFor serious gold investors, holding a portion of gold in USD-denominated certificates can provide an additional layer of currency protection beyond the physical metal itself.",
      category: "Currency",
      author: "Omar Khalil",
      read_time: "5 min",
      trend: "up",
      published: true,
    },
    {
      title: "Wedding Season Guide: Getting the Best Gold Price",
      summary: "Wedding season drives huge demand for gold jewelry in Egypt. Our guide explains how to compare prices, choose the right karat, and get the best deal.",
      content: "In Egypt, gold jewelry is an essential part of wedding traditions. The groom's family typically presents the bride with a gold set — necklace, bracelet, earrings, and ring — as part of the marriage agreement. This cultural importance means that wedding season creates enormous demand, which in turn pushes prices higher.\n\nWhen to Shop\nThe best time to buy wedding gold is outside peak season — typically spring and autumn. If you know a wedding is planned, consider purchasing gold several months in advance. Prices during Ramadan and immediately before the summer wedding season tend to be at their highest.\n\nChoosing the Right Karat\n21K gold is the standard for Egyptian wedding jewelry. It offers a rich yellow color, good durability for everyday wear, and is widely available. If the jewelry will be worn daily, consider 18K for added scratch resistance.\n\nCompare Multiple Shops\nPrices and craftsmanship fees vary enormously between jewelers. Visit at least three reputable shops in your area and compare both the gold price per gram and the manufacturing charge. Do not accept the first price offered.\n\nNegotiate the Manufacturing Fee\nThe gold price itself is fixed by the market, but the craftsmanship charge is negotiable. For larger purchases, jewelers will typically reduce the markup. Be polite but firm — savings of 10-15% on the craftsmanship fee are common for serious buyers.\n\nGet Everything in Writing\nEnsure you receive a detailed receipt showing the weight, karat, price per gram, and total craftsmanship charge. This protects you and makes resale easier in the future.",
      category: "Lifestyle",
      author: "Nour Ibrahim",
      read_time: "7 min",
      trend: "neutral",
      published: true,
    },
    {
      title: "Central Bank's New Gold Policy: What It Means for Investors",
      summary: "The Central Bank of Egypt recently announced new regulations for gold trading. We break down the changes and explain how they will affect individual investors.",
      content: "The Central Bank of Egypt has introduced a series of new regulations aimed at increasing transparency and stability in the domestic gold market. These changes affect individual investors, jewelers, and gold importers alike.\n\nKey Changes at a Glance\nThe new policy requires all licensed gold dealers to report daily transaction volumes to the central bank. Additionally, gold imports above a certain threshold will now require prior approval from the Ministry of Trade. For individual investors, the regulations introduce new documentation requirements for purchases above a specified value.\n\nImpact on Individual Buyers\nFor most everyday buyers purchasing jewelry or small gold coins, the impact is minimal. Transactions below the reporting threshold require no additional paperwork beyond a standard receipt. However, buyers of investment-grade gold bars in larger quantities should be prepared to provide identification and source-of-funds documentation.\n\nImpact on Jewelers and Dealers\nLicensed dealers face increased compliance costs under the new framework. Some smaller shops may exit the market, potentially reducing competition in the short term. Larger, established dealers are expected to absorb the compliance costs and maintain competitive pricing.\n\nLong-Term Outlook\nAnalysts generally view the regulations as a positive step toward formalizing Egypt's gold market and reducing informal trade. Greater transparency should, over time, attract institutional investment and improve price discovery for all market participants.\n\nOur recommendation: Continue purchasing from licensed dealers and ensure you request proper documentation for all transactions, regardless of size.",
      category: "Policy",
      author: "Ahmed Hassan",
      read_time: "8 min",
      trend: "neutral",
      published: true,
    },
    {
      title: "Gold Price in Egypt: A 10-Year Historical Review",
      summary: "We look back at a decade of gold prices in Egypt, examining the major events that caused price spikes and drops, and what history can tell us about the future.",
      content: "A decade of gold prices in Egypt tells a story of economic turbulence, currency reform, and the enduring value of precious metals as a store of wealth.\n\n2015-2016: Pre-Float Stability\nIn the years before the currency float, gold prices in Egypt were relatively stable in Egyptian Pound terms, largely because the exchange rate was fixed. However, black market dollar prices hinted at the storm ahead.\n\n2016: The Float and the Surge\nThe November 2016 decision to float the Egyptian Pound triggered an immediate and dramatic surge in gold prices. Overnight, the price of gold in EGP roughly doubled as the Pound lost nearly half its value against the Dollar. This period marked one of the most significant wealth transfers in modern Egyptian economic history — those holding gold preserved their purchasing power; those holding cash savings saw dramatic erosion.\n\n2017-2019: Gradual Stabilization\nAs the Egyptian economy stabilized under IMF reform programs, gold prices in EGP terms moderated. International gold prices also softened during this period, contributing to a relatively calm market.\n\n2020: COVID-19 and the Global Gold Rally\nThe pandemic triggered a global flight to safety assets. International gold hit all-time highs in USD terms in August 2020, and Egyptian gold prices followed. Domestic demand surged as uncertainty gripped households.\n\n2022-2024: Second Wave of EGP Pressure\nA new round of Pound devaluation — driven by global energy prices, the Russia-Ukraine conflict, and foreign currency shortages — sent gold prices surging once again. By 2024, the price of 21K gold per gram had reached levels unimaginable a decade earlier.\n\nWhat History Tells Us\nThe consistent lesson from this decade is that gold in Egypt has served as a near-perfect hedge against currency devaluation. Investors who held gold through each period of EGP weakness emerged with their real wealth intact, while those in cash or fixed deposits often saw significant losses in purchasing power.",
      category: "Historical Data",
      author: "Sara Mostafa",
      read_time: "10 min",
      trend: "up",
      published: true,
    },
  ]);
  console.log("Seeded blog posts");
}

module.exports = { initDb };
