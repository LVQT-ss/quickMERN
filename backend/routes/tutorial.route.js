import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import {
    createTutorial,
    getAllTutorials,
    getTutorialById,
    updateTutorial,
    deleteTutorial,
    addStep,
    updateStep,
    deleteStep
} from '../controllers/tutorial.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/tutorials:
 *   get:
 *     tags: [Tutorials]
 *     summary: Get all tutorials with pagination and filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *     responses:
 *       200:
 *         description: List of tutorials
 */
router.get('/', getAllTutorials);

/**
 * @swagger
 * /api/tutorials/{id}:
 *   get:
 *     tags: [Tutorials]
 *     summary: Get tutorial by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutorial details
 *       404:
 *         description: Tutorial not found
 */
router.get('/:id', getTutorialById);

/**
 * @swagger
 * /api/tutorials:
 *   post:
 *     tags: [Tutorials]
 *     summary: Create a new tutorial
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tutorial created successfully
 */
router.post('/', verifyToken, createTutorial);

/**
 * @swagger
 * /api/tutorials/{id}:
 *   put:
 *     tags: [Tutorials]
 *     summary: Update tutorial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tutorial updated successfully
 */
router.put('/:id', verifyToken, updateTutorial);

/**
 * @swagger
 * /api/tutorials/{id}:
 *   delete:
 *     tags: [Tutorials]
 *     summary: Delete tutorial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutorial deleted successfully
 */
router.delete('/:id', verifyToken, deleteTutorial);

// Step routes
router.post('/:tutorialId/steps', verifyToken, addStep);
router.put('/steps/:stepId', verifyToken, updateStep);
router.delete('/steps/:stepId', verifyToken, deleteStep);

export default router;
