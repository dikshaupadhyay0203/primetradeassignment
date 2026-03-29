import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { sanitizeEmail, sanitizeString } from '../utils/sanitize.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const registerUser = async (req, res) => {
    try {
        const name = sanitizeString(req.body.name);
        const email = sanitizeEmail(req.body.email);
        const password = sanitizeString(req.body.password);
        const role = req.body.role === 'admin' ? 'admin' : 'user';

        if (!name || !email || !password) {
            return sendError(res, 400, 'Name, email and password are required');
        }

        if (!isValidEmail(email)) {
            return sendError(res, 400, 'Invalid email format');
        }

        if (password.length < 6) {
            return sendError(res, 400, 'Password must be at least 6 characters');
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return sendError(res, 400, 'User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return sendSuccess(res, 201, 'User registered successfully', {
            userId: user._id,
            role: user.role,
            token,
        });
    } catch (error) {
        return sendError(res, 500, 'Server error', error.message);
    }
};

export const loginUser = async (req, res) => {
    try {
        const email = sanitizeEmail(req.body.email);
        const password = sanitizeString(req.body.password);

        if (!email || !password) {
            return sendError(res, 400, 'Email and password are required');
        }

        if (!isValidEmail(email)) {
            return sendError(res, 400, 'Invalid email format');
        }

        const user = await User.findOne({ email });

        if (!user) {
            return sendError(res, 401, 'Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 401, 'Invalid email or password');
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return sendSuccess(res, 200, 'Login successful', {
            token,
            userId: user._id,
            role: user.role,
        });
    } catch (error) {
        return sendError(res, 500, 'Server error', error.message);
    }
};


    