import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "@clerk/backend";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

export const isClerkAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ErrorHandler("Missing Clerk authorization token", 401));
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  if (!payload?.sub) {
    return next(new ErrorHandler("Invalid Clerk token", 401));
  }

  req.clerkAuth = payload;
  next();
});

// Flexible middleware: accepts JWT cookie OR Clerk Bearer token.
// Used for profile endpoints so both local and Clerk users can access them.
export const isAuthenticatedFlex = catchAsyncErrors(async (req, res, next) => {
  // 1. Try JWT cookie
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    try {
      const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (_) {
      // fall through to Clerk check
    }
  }

  // 2. Try Bearer token (Clerk JWT)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const bearerToken = authHeader.split(" ")[1];

    // Try as Clerk token
    try {
      const payload = await verifyToken(bearerToken, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      if (payload?.sub) {
        const user = await User.findOne({ clerkId: payload.sub });
        if (user) {
          req.user = user;
          return next();
        }
      }
    } catch (_) {
      // fall through
    }

    // Try as internal JWT (e.g. stored in localStorage)
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (_) {
      // fall through
    }
  }

  return next(new ErrorHandler("User Not Authorized", 401));
});
