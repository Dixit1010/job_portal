import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllJobsService = async (query) => {
  const { keyword, location, salary, category, sortBy, page = 1, limit = 10 } = query;

  const filter = { expired: false };
  if (keyword) {
    filter.title = { $regex: keyword, $options: "i" };
  }
  if (location) {
    filter.$or = [
      { location: { $regex: location, $options: "i" } },
      { city: { $regex: location, $options: "i" } },
      { country: { $regex: location, $options: "i" } },
    ];
  }
  if (salary) {
    filter.$or = [
      { fixedSalary: { $gte: Number(salary) } },
      { salaryFrom: { $gte: Number(salary) } }
    ];
  }
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  const sortOptions = {};
  if (sortBy === "salary") {
    sortOptions.fixedSalary = -1;
    sortOptions.salaryFrom = -1;
  } else {
    sortOptions.jobPostedOn = -1;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const jobs = await Job.find(filter)
    .populate("postedBy", "name")
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const totalJobs = await Job.countDocuments(filter);

  return { 
    jobs, 
    pagination: {
      totalPages: Math.ceil(totalJobs / Number(limit)), 
      currentPage: Number(page), 
      totalJobs 
    }
  };
};

export const postJobService = async (jobData, userId) => {
  if ((!jobData.salaryFrom || !jobData.salaryTo) && !jobData.fixedSalary) {
    throw new ErrorHandler("Please either provide fixed salary or ranged salary.", 400);
  }
  if (jobData.salaryFrom && jobData.salaryTo && jobData.fixedSalary) {
    throw new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400);
  }

  const job = await Job.create({
    ...jobData,
    postedBy: userId,
  });
  return job;
};

export const getMyJobsService = async (userId) => {
  return await Job.find({ postedBy: userId }).lean();
};

export const updateJobService = async (jobId, updateData) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ErrorHandler("OOPS! Job not found.", 404);
  }
  return await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteJobService = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ErrorHandler("OOPS! Job not found.", 404);
  }
  await job.deleteOne();
  return true;
};

export const getSingleJobService = async (jobId) => {
  try {
    const job = await Job.findById(jobId).populate("postedBy", "name").lean();
    if (!job) {
      throw new ErrorHandler("Job not found.", 404);
    }
    return job;
  } catch (error) {
    throw new ErrorHandler(`Invalid ID / CastError`, 404);
  }
};
