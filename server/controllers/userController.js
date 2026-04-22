import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { sendToken } from "../utils/jwtToken.js";
import { registerUserService, loginUserService, syncClerkUserService } from "../services/user.service.js";
import { sendEmailService } from "../services/email.service.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const user = await registerUserService(req.body);

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

// Syncs a Clerk user with our DB and issues a JWT cookie so profile
// endpoints (which use isAuthenticatedFlex) work immediately after sync.
export const syncClerkUser = catchAsyncErrors(async (req, res) => {
  const { sub, email, name, given_name, family_name, public_metadata, unsafe_metadata, metadata } = req.clerkAuth;
  const fullName =
    name ||
    [given_name, family_name].filter(Boolean).join(" ").trim() ||
    req.body?.name ||
    "Clerk User";
  const resolvedEmail = email || req.body?.email;
  const roleFromToken =
    public_metadata?.role || unsafe_metadata?.role || metadata?.role || req.body?.role;

  const user = await syncClerkUserService({
    clerkId: sub,
    email: resolvedEmail,
    name: fullName,
    role: roleFromToken,
  });

  sendToken(user, 200, res, "Clerk user synced successfully");
});
