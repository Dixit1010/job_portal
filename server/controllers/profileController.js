import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
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
