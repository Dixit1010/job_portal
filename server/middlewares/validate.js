import ErrorHandler from "./error.js";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);
    req.body = parsedData; // Replace with sanitized/validated data
    next();
  } catch (error) {
    const errorMessages = error.errors.map((err) => err.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }
};
