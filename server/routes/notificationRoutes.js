import express from "express";
import {
  getMyNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { isAuthenticatedFlex } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", isAuthenticatedFlex, getMyNotifications);
router.put("/:id/read", isAuthenticatedFlex, markNotificationRead);

export default router;
