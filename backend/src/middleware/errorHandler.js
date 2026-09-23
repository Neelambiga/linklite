const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  if (
    error.name === "ValidationError"
  ) {
    return res.status(400).json({
      success: false,
      message: "Validation failed"
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        "Short code already exists"
    });
  }

  return res.status(500).json({
    success: false,
    message:
      "Internal server error"
  });
};

module.exports = errorHandler;