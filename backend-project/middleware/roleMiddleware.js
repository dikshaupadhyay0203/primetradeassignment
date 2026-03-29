import { sendError } from '../utils/apiResponse.js';

// Authorize only users whose role exists in the allowed roles list.
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden: insufficient role access');
    }

    next();
  };
};

// Backward-compatible alias so older imports continue working.
export const permitRoles = authorizeRoles;
export default authorizeRoles;
