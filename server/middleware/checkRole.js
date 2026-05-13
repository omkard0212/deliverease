// Factory middleware — accepts an array of allowed roles and returns a middleware function.
// Must be used AFTER the `protect` middleware so req.user is already populated.
const checkRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied — requires one of: ${allowedRoles.join(', ')}`,
    });
  }
  next();
};

module.exports = { checkRole };
