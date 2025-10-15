import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { toggleLike, getLikes, getLikesCount } from '../controllers/postLikes.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/post-likes:
 *   post:
 *     tags: [Post Likes]
 *     summary: Toggle like for the authenticated user (like/unlike)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [post_id]
 *             properties:
 *               post_id: { type: integer }
 *     responses:
 *       201: { description: Liked }
 *       200: { description: Unliked }
 */
router.post('/post-likes', verifyToken, toggleLike);
/**
 * @swagger
 * /api/post-likes:
 *   get:
 *     tags: [Post Likes]
 *     summary: Get likes for a post
 *     parameters:
 *       - in: query
 *         name: post_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of likes }
 */
router.get('/post-likes', getLikes);
/**
 * @swagger
 * /api/post-likes/count:
 *   get:
 *     tags: [Post Likes]
 *     summary: Get like count for a post
 *     parameters:
 *       - in: query
 *         name: post_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Like count }
 */
router.get('/post-likes/count', getLikesCount);

export default router;


