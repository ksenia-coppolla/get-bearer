require("dotenv").config({ path: "../.env" });
const http = require("http");
const url = require("url");
const handleGenerateToken = require("./api/generate-token");

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://127.0.0.1:8080,http://localhost:8080"
).split(",");

// HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method.toLowerCase();

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (path === "/api/generate-token" && method === "post") {
    handleGenerateToken(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

module.exports = server;
