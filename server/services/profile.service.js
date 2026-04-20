import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import ErrorHandler from "../middlewares/error.js";

const COMPLETION_WEIGHTS = {
  name: 10,
  email: 10,
  phone: 10,
  location: 10,
  headline: 10,
  bio: 10,
  skills: 10,
  experience: 10,
  education: 10,
  resume: 10,
};

export const calculateProfileCompletion = (user) => {
  let score = 0;
  if (user.name) score += COMPLETION_WEIGHTS.name;
  if (user.email) score += COMPLETION_WEIGHTS.email;
  if (user.phone) score += COMPLETION_WEIGHTS.phone;
  if (user.location) score += COMPLETION_WEIGHTS.location;
  if (user.headline) score += COMPLETION_WEIGHTS.headline;
  if (user.bio) score += COMPLETION_WEIGHTS.bio;
  if (user.skills?.length > 0) score += COMPLETION_WEIGHTS.skills;
  if (user.experience?.length > 0) score += COMPLETION_WEIGHTS.experience;
  if (user.education?.length > 0) score += COMPLETION_WEIGHTS.education;
  if (user.resumeUrl) score += COMPLETION_WEIGHTS.resume;
  return score;
};

export const getProfileService = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: "savedJobs",
      select: "title city country category fixedSalary salaryFrom salaryTo jobPostedOn expired",
    })
    .lean();
  if (!user) throw new ErrorHandler("User not found", 404);
  return user;
};

export const updateProfileService = async (userId, updateData) => {
  const allowedFields = ["name", "location", "headline", "bio", "skills", "experience", "education"];
  const filteredData = {};
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  let user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ErrorHandler("User not found", 404);

  const completion = calculateProfileCompletion(user);
  user = await User.findByIdAndUpdate(userId, { profileCompleted: completion }, { new: true });

  return user;
};

export const uploadResumeService = async (userId, resumeFile) => {
  const allowedFormats = ["application/pdf"];
  if (!allowedFormats.includes(resumeFile.mimetype)) {
    throw new ErrorHandler("Invalid file type. Please upload your resume in PDF format.", 400);
  }

  const user = await User.findById(userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  if (user.resumePublicId) {
    await cloudinary.uploader
      .destroy(user.resumePublicId, { resource_type: "raw" })
      .catch(() => {});
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
    resource_type: "auto",
    folder: "resumes",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    throw new ErrorHandler("Failed to upload resume to Cloudinary", 500);
  }

  let updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      resumeUrl: cloudinaryResponse.secure_url,
      resumePublicId: cloudinaryResponse.public_id,
      resumeFileName: resumeFile.name,
      resumeUploadedAt: new Date(),
    },
    { new: true }
  );

  const completion = calculateProfileCompletion(updatedUser);
  updatedUser = await User.findByIdAndUpdate(userId, { profileCompleted: completion }, { new: true });

  return updatedUser;
};

export const deleteResumeService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ErrorHandler("User not found", 404);
  if (!user.resumeUrl) throw new ErrorHandler("No resume found to delete", 400);

  if (user.resumePublicId) {
    await cloudinary.uploader
      .destroy(user.resumePublicId, { resource_type: "raw" })
      .catch(() => {});
  }

  let updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      resumeUrl: "",
      resumePublicId: "",
      resumeFileName: "",
      resumeUploadedAt: null,
    },
    { new: true }
  );

  const completion = calculateProfileCompletion(updatedUser);
  updatedUser = await User.findByIdAndUpdate(userId, { profileCompleted: completion }, { new: true });

  return updatedUser;
};
