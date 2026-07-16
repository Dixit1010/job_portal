import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getPlatformAnalyticsService = async (userRole) => {
  if (userRole !== "Employer") {
    throw new ErrorHandler("Only employers can view analytics.", 403);
  }

  const [totalJobs, totalApplications, applicationsPerJob] = await Promise.all([
    Job.countDocuments(),
    Application.countDocuments(),
    // Aggregate applications per job
    Application.aggregate([
      {
        $group: {
          _id: "$job",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: {
          path: "$jobDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          title: "$jobDetails.title",
        },
      },
    ]),
  ]);

  return {
    totalJobs,
    totalApplications,
    applicationsPerJob
  };
};
