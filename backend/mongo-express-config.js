module.exports = {
  mongodb: {
    server: "localhost",
    port: 27017,
    connectionString: process.env.MONGODB_URI || "mongodb://localhost:27017/asaarmasr",
    admin: false,
  },
  site: {
    baseUrl: "/",
    cookieSecret: "asaarmasr_admin_cookie_secret",
    cookieKeyName: "mongo-express",
    sessionSecret: "asaarmasr_admin_session_secret",
  },
  options: {
    console: true,
    gridfsEnabled: false,
    logger: {},
    noDelete: false,
    noExport: false,
    noImport: false,
    readOnly: false,
  },
  useBasicAuth: false,
  useHTTPS: false,
};
