import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/users.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, passwordHash]
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               passwordHash: { type: string }
 *               bio: { type: string }
 *     responses:
 *       201: { description: User created }
 */
// router.post('/users', createUser);
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of users }
 *       403: { description: Forbidden }
 */
router.get('/users', verifyToken, isAdmin, getUsers);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a specific user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User details }
 *       404: { description: Not found }
 */
router.get('/users/:id', verifyToken, getUserById);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               bio: { type: string }
 *               role: { type: string, enum: [admin, user] }
 *     responses:
 *       200: { description: Updated }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
router.put('/users/:id', verifyToken, updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

export default router;


