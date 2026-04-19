import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getPlatformAnalyticsService = async (userRole) => {
  if (userRole !== "Employer") {
    throw new ErrorHandler("Only employers can view analytics.", 403);
  }

  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  
  // Aggregate applications per job
  const applicationsPerJob = await Application.aggregate([
    {
      $group: {
        _id: "$jobId",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);

  return {
    totalJobs,
    totalApplications,
    applicationsPerJob
  };
};
