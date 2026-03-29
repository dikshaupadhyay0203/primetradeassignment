import jwt from 'jsonwebtoken';
import { sendError } from '../utils/apiResponse.js';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return sendError(res, 401, 'Authorization token is required');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return sendError(res, 401, 'Invalid authorization format');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role || 'user';
        req.user = {
            userId: decoded.userId,
            role: decoded.role || 'user',
        };
        next();
    } catch (error) {
        return sendError(res, 401, 'Invalid or expired token');
    }
};

export default authMiddleware;