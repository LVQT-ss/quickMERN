import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    addSection,
    updateSection,
    deleteSection,
    addImage,
    updateImage,
    deleteImage,
    addPostCategory,
    removePostCategory
} from '../controllers/posts.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               introduction: { type: string }
 *               status: { type: string, enum: [draft, published] }
 *               category_ids:
 *                 type: array
 *                 items: { type: integer }
 *     responses:
 *       201: { description: Post created }
 */
router.post('/posts', verifyToken, createPost);
/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, published] }
 *       - in: query
 *         name: category
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of posts }
 */
router.get('/posts', getPosts);
/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get a post by id with sections, images and categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Post details }
 *       404: { description: Not found }
 */
router.get('/posts/:id', getPostById);
/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Update a post
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
 *               title: { type: string }
 *               introduction: { type: string }
 *               status: { type: string, enum: [draft, published] }
 *               publishedAt: { type: string, format: date-time }
 *     responses:
 *       200: { description: Updated }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
router.put('/posts/:id', verifyToken, updatePost);
/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post
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
router.delete('/posts/:id', verifyToken, deletePost);

/**
 * @swagger
 * /api/posts/{id}/sections:
 *   post:
 *     tags: [Posts]
 *     summary: Add a section to a post
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
 *             required: [title, content, order_index]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               order_index: { type: integer }
 *     responses:
 *       201: { description: Section added }
 */
router.post('/posts/:id/sections', verifyToken, addSection);
/**
 * @swagger
 * /api/posts/{id}/sections/{sectionId}:
 *   put:
 *     tags: [Posts]
 *     summary: Update a section
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               order_index: { type: integer }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 */
router.put('/posts/:id/sections/:sectionId', verifyToken, updateSection);
/**
 * @swagger
 * /api/posts/{id}/sections/{sectionId}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a section
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete('/posts/:id/sections/:sectionId', verifyToken, deleteSection);

/**
 * @swagger
 * /api/posts/{id}/images:
 *   post:
 *     tags: [Posts]
 *     summary: Add an image to a post (optionally to a section)
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
 *             required: [image_url, order_index]
 *             properties:
 *               image_url: { type: string }
 *               caption: { type: string }
 *               order_index: { type: integer }
 *               section_id: { type: integer }
 *     responses:
 *       201: { description: Image added }
 */
router.post('/posts/:id/images', verifyToken, addImage);
/**
 * @swagger
 * /api/posts/{id}/images/{imageId}:
 *   put:
 *     tags: [Posts]
 *     summary: Update an image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caption: { type: string }
 *               order_index: { type: integer }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 */
router.put('/posts/:id/images/:imageId', verifyToken, updateImage);
/**
 * @swagger
 * /api/posts/{id}/images/{imageId}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete an image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete('/posts/:id/images/:imageId', verifyToken, deleteImage);

/**
 * @swagger
 * /api/posts/{id}/categories:
 *   post:
 *     tags: [Posts]
 *     summary: Assign a category to a post
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
 *             required: [category_id]
 *             properties:
 *               category_id: { type: integer }
 *     responses:
 *       201: { description: Category assigned }
 */
router.post('/posts/:id/categories', verifyToken, addPostCategory);
/**
 * @swagger
 * /api/posts/{id}/categories/{categoryId}:
 *   delete:
 *     tags: [Posts]
 *     summary: Remove a category from a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Removed }
 */
router.delete('/posts/:id/categories/:categoryId', verifyToken, removePostCategory);

export default router;


