import express from "express";
import { login, register, logout, getUser, syncClerkUser } from "../controllers/userController.js";
import {
  getProfile,
  updateProfile,
  uploadResume,
  deleteResume,
} from "../controllers/profileController.js";
import { isAuthenticated, isClerkAuthenticated, isAuthenticatedFlex } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validations/user.schema.js";
import { profileUpdateSchema } from "../validations/profile.schema.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/clerk/sync", isClerkAuthenticated, syncClerkUser);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

// Profile routes - accessible by both local JWT and Clerk users
router.get("/profile", isAuthenticatedFlex, getProfile);
router.put("/profile", isAuthenticatedFlex, validateRequest(profileUpdateSchema), updateProfile);
router.post("/resume", isAuthenticatedFlex, uploadResume);
router.delete("/resume", isAuthenticatedFlex, deleteResume);

export default router;
