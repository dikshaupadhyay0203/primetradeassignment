import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import { createTask, getTasks, getAllTasksAdmin, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

/**
 * @route GET /api/v1/tasks/admin/all
 * @desc Admin-only endpoint to fetch all tasks
 */
router.get('/admin/all', authMiddleware, authorizeRoles('admin'), getAllTasksAdmin);

/**
 * @route POST /api/v1/tasks
 * @desc Create task (authenticated user)
 */
router.post('/', authMiddleware, createTask);

/**
 * @route GET /api/v1/tasks
 * @desc User gets own tasks, admin gets all tasks
 */
router.get('/', authMiddleware, getTasks);

/**
 * @route PUT /api/v1/tasks/:id
 * @desc Update task (owner or admin)
 */
router.put('/:id', authMiddleware, updateTask);

/**
 * @route DELETE /api/v1/tasks/:id
 * @desc Delete task (owner or admin)
 */
router.delete('/:id', authMiddleware, deleteTask);

export default router;

