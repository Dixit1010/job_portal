import express from "express";
import {
  deleteJob,
  getAllJobs,
  getMyJobs,
  getSingleJob,
  postJob,
  updateJob,
  getJobMatchScore
} from "../controllers/jobController.js";
import { isAuthenticatedFlex } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate.js";
import { jobSchema } from "../validations/job.schema.js";

const router = express.Router();

router.get("/getall", getAllJobs);
router.post("/post", isAuthenticatedFlex, validateRequest(jobSchema), postJob);
router.get("/getmyjobs", isAuthenticatedFlex, getMyJobs);
router.put("/update/:id", isAuthenticatedFlex, updateJob);
router.delete("/delete/:id", isAuthenticatedFlex, deleteJob);
router.get("/:id", isAuthenticatedFlex, getSingleJob);
router.post("/:id/match", isAuthenticatedFlex, getJobMatchScore);

export default router;
