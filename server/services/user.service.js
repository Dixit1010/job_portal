import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const registerUserService = async (userData) => {
  const { name, email, phone, password, role } = userData;
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    throw new ErrorHandler("Email already registered!", 400);
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  return user;
};

export const loginUserService = async (email, password, role) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ErrorHandler("Invalid Email Or Password.", 400);
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    throw new ErrorHandler("Invalid Email Or Password.", 400);
  }
  if (user.role !== role) {
    throw new ErrorHandler(`User with provided email and ${role} not found!`, 404);
  }
  return user;
};
