export const sendResponse = (
  res,
  status,
  message,
  data = null,
  error = null
) => {
  return res.status(status).json({
    success: status >= 200 && status <= 500,
    status,
    message,
    data,
    error,
  });
};
