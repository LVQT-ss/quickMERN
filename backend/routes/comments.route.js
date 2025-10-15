import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { addComment, getComments, updateComment, deleteComment } from '../controllers/comments.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Add a comment to a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [post_id, body]
 *             properties:
 *               post_id: { type: integer }
 *               body: { type: string }
 *               parent_id: { type: integer }
 *     responses:
 *       201: { description: Comment created }
 */
router.post('/comments', verifyToken, addComment);
/**
 * @swagger
 * /api/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for a post
 *     parameters:
 *       - in: query
 *         name: post_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of comments }
 */
router.get('/comments', getComments);
/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     tags: [Comments]
 *     summary: Update a comment
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
 *             required: [body]
 *             properties:
 *               body: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
router.put('/comments/:id', verifyToken, updateComment);
/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
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
router.delete('/comments/:id', verifyToken, deleteComment);

export default router;


