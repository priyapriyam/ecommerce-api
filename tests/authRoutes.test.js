import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/userModel.js";
import * as tokenUtils from "../src/utils/generateToken.js";
import bcrypt from "bcryptjs";

// Mock dependencies
jest.mock("../src/models/userModel.js");
jest.mock("../src/utils/generateToken.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/auth/register", () => {
  test("should return 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "john@example.com", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(expect.any(Array));
    expect(res.body.errors[0]).toHaveProperty("msg", "Name is required");
  });

  test("should return 400 for invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "John Doe", email: "not-an-email", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(expect.any(Array));
    expect(res.body.errors[0]).toHaveProperty("msg", "Invalid email");
  });

  test("should return 400 for too-short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "John Doe", email: "john@example.com", password: "123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(expect.any(Array));
    expect(res.body.errors[0]).toHaveProperty("msg", "Password must be at least 6 characters");
  });

  test("should return 400 if user already exists", async () => {
    User.findOne.mockResolvedValue({ _id: "abc123", email: "john@example.com" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "John Doe", email: "john@example.com", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User already exists");
  });

  test("should register a new user successfully", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "abc123", name: "John Doe", email: "john@example.com" });
    tokenUtils.generateToken.mockReturnValue("mock_jwt_token");

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "John Doe", email: "john@example.com", password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.token).toBe("mock_jwt_token");
    expect(res.body.user).toHaveProperty("email", "john@example.com");
  });
});

describe("POST /api/auth/login", () => {
  test("should return 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "john@example.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(expect.any(Array));
    expect(res.body.errors[0]).toHaveProperty("msg", "Password is required");
  });

  test("should return 400 for invalid email", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "not-email", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(expect.any(Array));
    expect(res.body.errors[0]).toHaveProperty("msg", "Invalid email");
  });

  test("should return 400 for non-existent user", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@example.com", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid email or password");
  });

  test("should return 400 for wrong password", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: "abc123", name: "John Doe", email: "john@example.com", password: "hashedpass" }),
    });
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@example.com", password: "wrongpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid password");
  });

  test("should login successfully", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: "abc123", name: "John Doe", email: "john@example.com", password: "hashedpass" }),
    });
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    tokenUtils.generateToken.mockReturnValue("mock_jwt_token");

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@example.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBe("mock_jwt_token");
    expect(res.body.user).toHaveProperty("email", "john@example.com");
  });
});