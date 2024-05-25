require("dotenv").config({ path: "../../.env" });
const { StringDecoder } = require("string_decoder");
const jwt = require("jsonwebtoken");

const secrets = {
  staging: process.env.SECRET_STAGING || 123456,
  production: process.env.SECRET_PRODUCTION || 789101112,
};

function generateJWT(organization_id, secret) {
  const payload = { organization_id };
  return jwt.sign(payload, secret, { algorithm: "HS256" });
}

function handleGenerateToken(req, res) {
  let buffer = "";
  const decoder = new StringDecoder("utf-8");

  req.on("data", (chunk) => {
    buffer += decoder.write(chunk);
  });

  req.on("end", () => {
    buffer += decoder.end();

    try {
      const data = JSON.parse(buffer);
      const { organization_id, environment } = data;

      if (!organization_id || organization_id.length !== 24) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Organization ID must be exactly 24 characters long.",
          })
        );
        return;
      }

      if (!environment || !secrets[environment]) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: `Invalid environment. ${environment}` })
        );
        return;
      }

      const token = generateJWT(organization_id, secrets[environment]);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ token }));
    } catch (error) {
      console.log("error", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request payload" }));
    }
  });
}

module.exports = handleGenerateToken;
