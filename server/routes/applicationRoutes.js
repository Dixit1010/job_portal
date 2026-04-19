import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate.js";
import { applicationSchema } from "../validations/application.schema.js";

const router = express.Router();

router.post("/post", isAuthenticated, validateRequest(applicationSchema), postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.put("/status/:id", isAuthenticated, updateApplicationStatus);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);

export default router;
