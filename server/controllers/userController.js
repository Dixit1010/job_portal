import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { sendToken } from "../utils/jwtToken.js";
import { registerUserService, loginUserService } from "../services/user.service.js";
import { sendEmailService } from "../services/email.service.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const user = await registerUserService(req.body);
  
  // Background email sending
  sendEmailService({
    to: user.email,
    subject: "Welcome to JobZee!",
    text: `Hi ${user.name},\n\nWelcome to JobZee! We are thrilled to have you as a ${user.role}. Start exploring today.\n\nBest,\nJobZee Team`
  }).catch(err => console.log("Welcome Email Error:", err));

  sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  const user = await loginUserService(email, password, role);
  sendToken(user, 200, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: 'none',
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});