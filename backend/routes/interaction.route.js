import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
    addComment,
    updateComment,
    deleteComment,
    toggleReaction
} from '../controllers/interaction.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/tutorials/{tutorialId}/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Add a comment to a tutorial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tutorialId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/tutorials/:tutorialId/comments', verifyToken, addComment);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   put:
 *     tags: [Comments]
 *     summary: Update a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.put('/comments/:commentId', verifyToken, updateComment);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/comments/:commentId', verifyToken, deleteComment);

/**
 * @swagger
 * /api/tutorials/{tutorialId}/reactions:
 *   post:
 *     tags: [Reactions]
 *     summary: Toggle reaction (like/dislike) on a tutorial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tutorialId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [like, dislike]
 *     responses:
 *       200:
 *         description: Reaction toggled successfully
 */
router.post('/tutorials/:tutorialId/reactions', verifyToken, toggleReaction);

export default router;
