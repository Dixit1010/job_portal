import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema(
  {
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
    coverLetter: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Please enter your Phone Number!"],
    },
    address: {
      type: String,
      required: [true, "Please enter your Address!"],
    },
    resume: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    applicantID: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        enum: ["Job Seeker"],
        required: true,
      },
    },
    employerID: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        enum: ["Employer"],
        required: true,
      },
    },
    // Reference to the job being applied for
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// Prevent the same job seeker from applying to the same job more than once.
applicationSchema.index({ "applicantID.user": 1, job: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
