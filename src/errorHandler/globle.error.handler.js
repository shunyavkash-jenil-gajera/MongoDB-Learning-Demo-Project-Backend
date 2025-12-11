import { sendResponse } from "../utils/responseUtil.js";

export const globalErrorHandler = (err, req, res, next) => {
  console.log("🔥 GLOBAL ERROR HANDLER TRIGGERED");
  console.log(`❌ API Error in: ${req.method} ${req.originalUrl}`);
  console.log("📛 Message:", err.message);

  return sendResponse(
    res,
    err.statusCode || 500,
    err.message || "Internal Server Error",
    null,
    req.originalUrl,
    true
  );
};
