const request = require("supertest");
const server = require("../server");
const {
  CORRECT_ORGANIZATION_ID,
  INCORRECT_ORGANIZATION_ID,
  STAGING_ENV,
} = require("../consts");

describe("HTTP Server Tests", () => {
  describe("API Endpoint Tests", () => {
    test("POST /api/generate-token returns token with correct organization_id", async () => {
      const response = await request(server).post("/api/generate-token").send({
        organization_id: CORRECT_ORGANIZATION_ID,
        environment: STAGING_ENV,
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    test("POST /api/generate-token returns 400 (bad request) with incorrect organization_id", async () => {
      const response = await request(server).post("/api/generate-token").send({
        organization_id: INCORRECT_ORGANIZATION_ID,
        environment: STAGING_ENV,
      });

      expect(response.status).toBe(400);
    });

    test("POST returns 404 for non-existing endpoint", async () => {
      const response = await request(server)
        .post("/api/non-existing-endpoint")
        .send();

      expect(response.status).toBe(404);
    });
  });
});
