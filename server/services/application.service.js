import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "cloudinary";

export const postApplicationService = async (applicationData, resumeFile, userId, role) => {
  if (role === "Employer") {
    throw new ErrorHandler("Employer not allowed to access this resource.", 400);
  }

  const allowedFormats = ["application/pdf"];
  if (!allowedFormats.includes(resumeFile.mimetype)) {
    throw new ErrorHandler("Invalid file type. Please upload your resume in PDF format.", 400);
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    resumeFile.tempFilePath,
    { resource_type: "auto" }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    throw new ErrorHandler("Failed to upload Resume to Cloudinary", 500);
  }

  const { jobId, ...restData } = applicationData;
  const applicantID = { user: userId, role: "Job Seeker" };
  
  const jobDetails = await Job.findById(jobId).lean();
  if (!jobDetails) {
    throw new ErrorHandler("Job not found!", 404);
  }

  const employerID = { user: jobDetails.postedBy, role: "Employer" };

  const application = await Application.create({
    ...restData,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  return application;
};

export const employerGetAllApplicationsService = async (userId, role) => {
  if (role === "Job Seeker") {
    throw new ErrorHandler("Job Seeker not allowed to access this resource.", 400);
  }
  return await Application.find({ "employerID.user": userId }).lean();
};

export const jobseekerGetAllApplicationsService = async (userId, role) => {
  if (role === "Employer") {
    throw new ErrorHandler("Employer not allowed to access this resource.", 400);
  }
  return await Application.find({ "applicantID.user": userId }).lean();
};

export const jobseekerDeleteApplicationService = async (applicationId, role) => {
  if (role === "Employer") {
    throw new ErrorHandler("Employer not allowed to access this resource.", 400);
  }
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new ErrorHandler("Application not found!", 404);
  }
  await application.deleteOne();
  return true;
};

export const updateApplicationStatusService = async (applicationId, status, role) => {
  if (role === "Job Seeker") {
    throw new ErrorHandler("Job Seeker not allowed to update application status.", 400);
  }
  const validStatuses = ["applied", "shortlisted", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new ErrorHandler("Invalid application status.", 400);
  }
  
  const application = await Application.findByIdAndUpdate(
    applicationId, 
    { status }, 
    { new: true, runValidators: true }
  );
  
  if (!application) {
    throw new ErrorHandler("Application not found!", 404);
  }
  return application;
};
