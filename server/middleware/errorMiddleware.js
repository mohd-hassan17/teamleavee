export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  console.error("API error", req.method, req.originalUrl, error.message);

  res.status(statusCode).json({
    message: error.message || "Server error",
  });
};
