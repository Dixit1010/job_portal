import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    company: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String, trim: true },
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    year: { type: Number },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema({
  authProvider: {
    type: String,
    enum: ["local", "clerk"],
    default: "local",
  },
  clerkId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  phone: {
    type: Number,
    required: function () {
      return this.authProvider === "local";
    },
  },
  password: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Job Seeker", "Employer"],
    default: "Job Seeker",
  },
  savedJobs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Job",
    },
  ],
  // Profile fields
  location: { type: String, default: "", trim: true },
  headline: { type: String, default: "", trim: true, maxLength: 120 },
  bio: { type: String, default: "", trim: true, maxLength: 1000 },
  skills: { type: [String], default: [] },
  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  // Resume stored on Cloudinary
  resumeUrl: { type: String, default: "" },
  resumePublicId: { type: String, default: "" },
  resumeFileName: { type: String, default: "" },
  resumeUploadedAt: { type: Date, default: null },
  // Metadata
  profileCompleted: { type: Number, default: 0, min: 0, max: 100 },
  lastActive: { type: Date, default: Date.now },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const User = mongoose.model("User", userSchema);
