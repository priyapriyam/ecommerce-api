import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/userModel.js";
import * as tokenUtils  from "../src/utils/generateToken.js";

//Mock dependency
jest.mock("../src/models/userModel.js");
jest.mock("../src/utils/generateToken.js");


describe("POST /api/auth/register", () => {

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ TEST 1: Successful Registration
  test("should register a new user successfully", async () => {
    // Arrange
    User.findOne.mockResolvedValue(null); // no existing user
    User.create.mockResolvedValue({
      _id: "abc123",
      name: "John Doe",
      email: "john@example.com",
    });
    tokenUtils.generateToken.mockReturnValue("mock_jwt_token");

    // Act
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "John Doe", email: "john@example.com", password: "123456" });

    // Assert
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.token).toBe("mock_jwt_token");
    expect(res.body.user).toHaveProperty("email", "john@example.com");
  })

  });