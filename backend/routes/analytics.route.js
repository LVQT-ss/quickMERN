import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
    trackVisit,
    incrementPostView,
    getSiteStats,
    getTopPages
} from '../controllers/analytics.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/analytics/visit:
 *   post:
 *     tags: [Analytics]
 *     summary: Track a site visit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page: { type: string }
 *               referrer: { type: string }
 *     responses:
 *       201: { description: Visit tracked }
 */
router.post('/analytics/visit', trackVisit);

/**
 * @swagger
 * /api/posts/{id}/view:
 *   post:
 *     tags: [Analytics]
 *     summary: Increment post view count
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: View count incremented }
 *       404: { description: Post not found }
 */
router.post('/posts/:id/view', incrementPostView);

/**
 * @swagger
 * /api/analytics/stats:
 *   get:
 *     tags: [Analytics]
 *     summary: Get site analytics statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Analytics statistics }
 */
router.get('/analytics/stats', verifyToken, getSiteStats);

/**
 * @swagger
 * /api/analytics/top-pages:
 *   get:
 *     tags: [Analytics]
 *     summary: Get top visited pages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: List of top pages }
 */
router.get('/analytics/top-pages', verifyToken, getTopPages);

export default router;

