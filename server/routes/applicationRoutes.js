import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { isAuthenticatedFlex } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate.js";
import { applicationSchema } from "../validations/application.schema.js";

const router = express.Router();

router.post("/post", isAuthenticatedFlex, validateRequest(applicationSchema), postApplication);
router.get("/employer/getall", isAuthenticatedFlex, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticatedFlex, jobseekerGetAllApplications);
router.put("/status/:id", isAuthenticatedFlex, updateApplicationStatus);
router.delete("/delete/:id", isAuthenticatedFlex, jobseekerDeleteApplication);

export default router;
