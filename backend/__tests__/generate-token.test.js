const http = require("http");
const { StringDecoder } = require("string_decoder");
const jwt = require("jsonwebtoken");
const handleGenerateToken = require("../api/generate-token");
const {
  CORRECT_ORGANIZATION_ID,
  INCORRECT_ORGANIZATION_ID,
  STAGING_ENV,
  INCORRECT_ENV,
} = require("../consts");

jest.mock("jsonwebtoken");

describe("handleGenerateToken", () => {
  let req;
  let res;
  let dataListener;
  let endListener;

  beforeEach(() => {
    req = new http.IncomingMessage();
    res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    req.on = jest.fn((event, callback) => {
      if (event === "data") dataListener = callback;
      if (event === "end") endListener = callback;
    });
  });

  const triggerRequest = (payload) => {
    handleGenerateToken(req, res);
    if (payload) {
      dataListener(Buffer.from(JSON.stringify(payload)));
    }
    endListener();
  };

  test("should return token for valid request", () => {
    jwt.sign.mockReturnValue("fakeToken");

    triggerRequest({
      organization_id: CORRECT_ORGANIZATION_ID,
      environment: STAGING_ENV,
    });

    expect(res.writeHead).toHaveBeenCalledWith(200, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ token: "fakeToken" })
    );
  });

  test("should return error for invalid organization ID length", () => {
    triggerRequest({
      organization_id: INCORRECT_ORGANIZATION_ID,
      environment: STAGING_ENV,
    });

    expect(res.writeHead).toHaveBeenCalledWith(400, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        message: "Organization ID must be exactly 24 characters long.",
      })
    );
  });

  test("should return error for invalid environment", () => {
    triggerRequest({
      organization_id: CORRECT_ORGANIZATION_ID,
      environment: INCORRECT_ENV,
    });

    expect(res.writeHead).toHaveBeenCalledWith(400, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ message: "Invalid environment." })
    );
  });

  test("should return error for missing organization ID", () => {
    triggerRequest({ environment: STAGING_ENV });

    expect(res.writeHead).toHaveBeenCalledWith(400, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        message: "Organization ID must be exactly 24 characters long.",
      })
    );
  });

  test("should return error for missing environment", () => {
    triggerRequest({ organization_id: CORRECT_ORGANIZATION_ID });

    expect(res.writeHead).toHaveBeenCalledWith(400, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ message: "Invalid environment." })
    );
  });

  test("should return error for invalid JSON payload", () => {
    handleGenerateToken(req, res);
    dataListener(Buffer.from("{ invalid json }"));
    endListener();

    expect(res.writeHead).toHaveBeenCalledWith(400, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ message: "Invalid request payload" })
    );
  });
});
