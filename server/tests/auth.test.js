import request from "supertest";
import app from "../app.js";
import { dbConnection } from "../database/dbConnection.js";
import mongoose from "mongoose";

beforeAll(async () => {
  // Database connection is initialized in app.js, wait a bit or use mock DB
});

afterAll(async () => {
  // close db
  await mongoose.connection.close();
});

describe("Auth Routes", () => {
  it("should fail to register with incomplete data", async () => {
    const res = await request(app)
      .post("/api/v1/user/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        // missing password, phone, role
      });
    
    expect(res.statusCode).toEqual(400);
  });

  it("should fail to login with wrong credentials", async () => {
    const res = await request(app)
      .post("/api/v1/user/login")
      .send({
        email: "nonexistent@example.com",
        password: "password123",
        role: "Job Seeker"
      });
    
    expect(res.statusCode).toEqual(400); // Invalid Email Or Password based on Zod or DB result
  });
});
