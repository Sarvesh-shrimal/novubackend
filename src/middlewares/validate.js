const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      // Zod validation error
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    // Some other unexpected error
    return res.status(500).json({
      message: "Internal validation error",
      error: error.message,
    });
  }
};

module.exports = validate;
