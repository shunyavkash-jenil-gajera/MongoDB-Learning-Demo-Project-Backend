// utils/apiLogger.js
export const apiLogger = (req, res, next) => {
  const start = Date.now();

  const user = req.user
    ? { id: req.user._id, email: req.user.email, role: req.user.role }
    : { user: "Unauthenticated User" };

  console.log(`API Called: ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (res.statusCode >= 400) {
      console.log(`❌ ERROR OCCURRED in ${req.originalUrl}`);
    }
  });

  next();
};
