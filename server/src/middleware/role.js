import createError from 'http-errors';


export const requireRole = (roles = []) => (req, res, next) => {
if (!req.user) return next(createError(401, 'Not authenticated'));
if (!Array.isArray(roles)) roles = [roles];
if (!roles.includes(req.user.role)) return next(createError(403, 'Forbidden'));
next();
};