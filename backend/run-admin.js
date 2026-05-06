process.env.ME_CONFIG_MONGODB_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/asaarmasr";
process.env.ME_CONFIG_BASICAUTH = "false";
process.env.ME_CONFIG_SITE_BASEURL = "/";

import("./node_modules/mongo-express/app.js").catch(console.error);
