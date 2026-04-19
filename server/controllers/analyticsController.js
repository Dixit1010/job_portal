import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { getPlatformAnalyticsService } from "../services/analytics.service.js";

export const getAnalytics = catchAsyncErrors(async (req, res, next) => {
  const analyticsData = await getPlatformAnalyticsService(req.user.role);
  res.status(200).json({
    success: true,
    data: analyticsData,
  });
});
