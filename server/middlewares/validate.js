import ErrorHandler from "./error.js";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);
    req.body = parsedData; // Replace with sanitized/validated data
    next();
  } catch (error) {
    const issues = error?.errors ?? error?.issues;
    if (Array.isArray(issues) && issues.length > 0) {
      const errorMessages = issues.map((err) => err.message).join(", ");
      return next(new ErrorHandler(errorMessages, 400));
    }
    return next(new ErrorHandler(error?.message || "Validation failed", 400));
  }
};
