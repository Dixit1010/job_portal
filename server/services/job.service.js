import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Pure function (no DB access) so the location+salary combination logic can be
// unit tested directly, instead of only through a live-DB integration test.
export const buildJobFilter = ({ keyword, location, salary, category }) => {
  const filter = { expired: false };
  if (keyword) {
    filter.title = { $regex: keyword, $options: "i" };
  }
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  // location and salary each need their own $or clause, so they're combined
  // under $and instead of both writing to filter.$or (which would let one overwrite the other).
  const andConditions = [];
  if (location) {
    andConditions.push({
      $or: [
        { location: { $regex: location, $options: "i" } },
        { city: { $regex: location, $options: "i" } },
        { country: { $regex: location, $options: "i" } },
      ],
    });
  }
  if (salary) {
    andConditions.push({
      $or: [
        { fixedSalary: { $gte: Number(salary) } },
        { salaryFrom: { $gte: Number(salary) } },
      ],
    });
  }
  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  return filter;
};

export const getAllJobsService = async (query) => {
  const { sortBy, page = 1, limit = 10 } = query;

  const filter = buildJobFilter(query);

  const sortOptions = {};
  if (sortBy === "salary") {
    sortOptions.fixedSalary = -1;
    sortOptions.salaryFrom = -1;
  } else {
    sortOptions.jobPostedOn = -1;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, totalJobs] = await Promise.all([
    Job.find(filter)
      .populate("postedBy", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Job.countDocuments(filter),
  ]);

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
