import Task from '../models/Task.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { sanitizeString } from '../utils/sanitize.js';

const isValidStatus = (value) => ['pending', 'in progress', 'completed'].includes(value);

export const createTask = async (req, res) => {
    try {
        const title = sanitizeString(req.body.title);
        const description = sanitizeString(req.body.description);

        if (!title || !description) {
            return sendError(res, 400, 'Title and description are required');
        }

        const task = await Task.create({
            title,
            description,
            userId: req.userId,
            createdBy: req.userId,
        });

        return sendSuccess(res, 201, 'Task created successfully', task);
    } catch (error) {
        return sendError(res, 500, 'Error creating task', error.message);
    }
};

export const getTasks = async (req, res) => {
    try {
        const filter = req.userRole === 'admin'
            ? {}
            : { $or: [{ userId: req.userId }, { createdBy: req.userId }] };
        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        return sendSuccess(res, 200, 'Tasks fetched successfully', tasks);
    } catch (error) {
        return sendError(res, 500, 'Error fetching tasks', error.message);
    }
};

export const getAllTasksAdmin = async (req, res) => {
    try {
        const tasks = await Task.find({}).sort({ createdAt: -1 });
        return sendSuccess(res, 200, 'All tasks fetched successfully', tasks);
    } catch (error) {
        return sendError(res, 500, 'Error fetching all tasks', error.message);
    }
};

export const updateTask = async (req, res) => {
    try {
        const updates = {};

        if (req.body.title !== undefined) updates.title = sanitizeString(req.body.title);
        if (req.body.description !== undefined) updates.description = sanitizeString(req.body.description);
        if (req.body.status !== undefined) {
            if (!isValidStatus(req.body.status)) {
                return sendError(res, 400, 'Invalid status value');
            }
            updates.status = req.body.status;
        }

        if (Object.keys(updates).length === 0) {
            return sendError(res, 400, 'No valid fields provided for update');
        }

        // Any role can update only tasks owned by the logged-in user.
        const filter = { _id: req.params.id, $or: [{ userId: req.userId }, { createdBy: req.userId }] };

        const task = await Task.findOneAndUpdate(
            filter,
            updates,
            { new: true }
        );

        if (!task) {
            return sendError(res, 404, 'Task not found');
        }

        return sendSuccess(res, 200, 'Task updated successfully', task);
    } catch (error) {
        if (error.name === 'CastError') {
            return sendError(res, 400, 'Invalid task id');
        }
        return sendError(res, 500, 'Error updating task', error.message);
    }
};


export const deleteTask = async (req, res) => {
    try {
        // Any role can delete only tasks owned by the logged-in user.
        const filter = { _id: req.params.id, $or: [{ userId: req.userId }, { createdBy: req.userId }] };

        const task = await Task.findOneAndDelete(filter);

        if (!task) {
            return sendError(res, 404, 'Task not found');
        }

        return sendSuccess(res, 200, 'Task deleted successfully');
    } catch (error) {
        if (error.name === 'CastError') {
            return sendError(res, 400, 'Invalid task id');
        }
        return sendError(res, 500, 'Error deleting task', error.message);
    }
};