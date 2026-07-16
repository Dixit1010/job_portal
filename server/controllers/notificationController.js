import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  getMyNotificationsService,
  markNotificationReadService,
} from "../services/notification.service.js";

export const getMyNotifications = catchAsyncErrors(async (req, res, next) => {
  const notifications = await getMyNotificationsService(req.user._id);
  res.status(200).json({
    success: true,
    notifications,
  });
});

export const markNotificationRead = catchAsyncErrors(async (req, res, next) => {
  const notification = await markNotificationReadService(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    notification,
  });
});
