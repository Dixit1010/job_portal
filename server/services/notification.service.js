import { Notification } from "../models/notificationSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getMyNotificationsService = async (userId) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 }).lean();
};

export const markNotificationReadService = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
  if (!notification) {
    throw new ErrorHandler("Notification not found!", 404);
  }
  return notification;
};
