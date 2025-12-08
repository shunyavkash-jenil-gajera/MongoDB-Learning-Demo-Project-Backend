const use = (fn) => (req, ras, next) => {
  return Promise.resolve(fn(req, ras, next)).catch((err) => next(err));
};
export default use;
