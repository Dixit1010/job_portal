import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {
  postApplicationService,
  employerGetAllApplicationsService,
  jobseekerGetAllApplicationsService,
  jobseekerDeleteApplicationService,
  updateApplicationStatusService
} from "../services/application.service.js";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const application = await postApplicationService(
    req.body, 
    req.files.resume, 
    req.user._id, 
    req.user.role
  );

  res.status(201).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await employerGetAllApplicationsService(req.user._id, req.user.role);
  res.status(200).json({
    success: true,
    applications,
  });
});

export const jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await jobseekerGetAllApplicationsService(req.user._id, req.user.role);
  res.status(200).json({
    success: true,
    applications,
  });
});

export const jobseekerDeleteApplication = catchAsyncErrors(async (req, res, next) => {
  await jobseekerDeleteApplicationService(req.params.id, req.user.role);
  res.status(200).json({
    success: true,
    message: "Application Deleted!",
  });
});

export const updateApplicationStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  if (!status) {
    return next(new ErrorHandler("Please provide a status.", 400));
  }
  
  const application = await updateApplicationStatusService(
    req.params.id, 
    status, 
    req.user.role
  );
  
  res.status(200).json({
    success: true,
    message: "Application Status Updated!",
    application
  });
});
