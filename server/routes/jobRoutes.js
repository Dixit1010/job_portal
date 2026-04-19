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
import { isAuthenticated } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate.js";
import { jobSchema } from "../validations/job.schema.js";

const router = express.Router();

router.get("/getall", getAllJobs);
router.post("/post", isAuthenticated, validateRequest(jobSchema), postJob);
router.get("/getmyjobs", isAuthenticated, getMyJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);
router.get("/:id", isAuthenticated, getSingleJob);
router.post("/:id/match", isAuthenticated, getJobMatchScore);

export default router;
