import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { 
  getAllJobsService, 
  postJobService, 
  getMyJobsService, 
  updateJobService, 
  deleteJobService, 
  getSingleJobService 
} from "../services/job.service.js";
import { calculateMatchScoreService } from "../services/ai.service.js";

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const result = await getAllJobsService(req.query);
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seeker not allowed to access this resource.", 400));
  }
  
  const job = await postJobService(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seeker not allowed to access this resource.", 400));
  }
  const myJobs = await getMyJobsService(req.user._id);
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seeker not allowed to access this resource.", 400));
  }
  
  await updateJobService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seeker not allowed to access this resource.", 400));
  }
  
  await deleteJobService(req.params.id);
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const job = await getSingleJobService(req.params.id);
  res.status(200).json({
    success: true,
    job,
  });
});

export const getJobMatchScore = catchAsyncErrors(async (req, res, next) => {
  const job = await getSingleJobService(req.params.id);
  const { resumeText } = req.body;
  
  if (!resumeText) {
    return next(new ErrorHandler("Please provide resumeText to calculate match score.", 400));
  }

  const matchData = calculateMatchScoreService(job.description, resumeText);
  res.status(200).json({
    success: true,
    data: matchData
  });
});
