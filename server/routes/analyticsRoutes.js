import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/get", isAuthenticated, getAnalytics);

export default router;
