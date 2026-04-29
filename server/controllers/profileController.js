import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import {
  getProfileService,
  updateProfileService,
  uploadResumeService,
  deleteResumeService,
} from "../services/profile.service.js";

export const getProfile = catchAsyncErrors(async (req, res) => {
  const user = await getProfileService(req.user._id);
  res.status(200).json({ success: true, user });
});

export const updateProfile = catchAsyncErrors(async (req, res) => {
  const user = await updateProfileService(req.user._id, req.body);
  res.status(200).json({ success: true, message: "Profile updated successfully!", user });
});

export const uploadResume = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.resume) {
    return next(new ErrorHandler("Resume file is required!", 400));
  }
  const user = await uploadResumeService(req.user._id, req.files.resume);
  res.status(200).json({ success: true, message: "Resume uploaded successfully!", user });
});

export const deleteResume = catchAsyncErrors(async (req, res) => {
  const user = await deleteResumeService(req.user._id);
  res.status(200).json({ success: true, message: "Resume deleted successfully!", user });
});

export const toggleSaveJob = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const alreadySaved = user.savedJobs.some((id) => id.toString() === jobId);
  if (alreadySaved) {
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
  } else {
    user.savedJobs.push(jobId);
  }
  await user.save();

  res.status(200).json({
    success: true,
    saved: !alreadySaved,
    message: alreadySaved ? "Job removed from saved." : "Job saved successfully.",
  });
});
