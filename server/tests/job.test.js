import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Job Routes", () => {
  it("should list active jobs", async () => {
    const res = await request(app).get("/api/v1/job/getall");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.jobs)).toBe(true);
  });

  it("should fail to post a job if not authenticated", async () => {
    const res = await request(app)
      .post("/api/v1/job/post")
      .send({
        title: "Test Job",
        description: "Test description that is long enough.",
        category: "Tech",
        country: "USA",
        city: "NY",
        location: "123 Test Street NY",
        fixedSalary: 100000 
      });
    
    // Auth middleware should block it
    expect(res.statusCode).toEqual(401);
  });
});
