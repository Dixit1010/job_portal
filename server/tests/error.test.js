import { jest } from "@jest/globals";
import { errorMiddleware } from "../middlewares/error.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("errorMiddleware", () => {
  it("maps a Mongo duplicate-key error (code 11000) to 400", () => {
    const res = mockRes();
    const err = { code: 11000, keyValue: { email: "a@b.com" } };

    errorMiddleware(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining("Duplicate"),
      })
    );
  });

  it("maps a Mongoose CastError to 400", () => {
    const res = mockRes();
    const err = { name: "CastError", path: "_id" };

    errorMiddleware(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining("Invalid _id"),
      })
    );
  });

  it("maps an expired JWT error to 400", () => {
    const res = mockRes();
    const err = { name: "TokenExpiredError" };

    errorMiddleware(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("falls back to 500 for an unrecognized error", () => {
    const res = mockRes();
    const err = { message: "Something exploded" };

    errorMiddleware(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
