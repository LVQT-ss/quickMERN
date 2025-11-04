import Post from "../models/Blog.model.js";
import User from '../models/User.model.js';
import Category from '../models/Category.model.js';
import PostSection from '../models/PostSection.model.js';
import PostImage from '../models/PostImage.model.js';
import PostCategory from '../models/PostCategory.model.js';
import PostLike from '../models/PostLike.model.js';
import { Op } from 'sequelize';
import sequelize from '../database/db.js';

export const createPost = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { title, introduction, banner, status, category_ids } = req.body;
        if (!req.user || !req.user.id) {
            await transaction.rollback();
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Title is required' });
        }
        if (status && !['draft', 'published'].includes(status)) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Invalid status. Use draft or published' });
        }
        const post = await Post.create({ title, introduction, banner, status, user_id: req.user.id }, { transaction });

        if (Array.isArray(category_ids) && category_ids.length > 0) {
            const categories = await Category.findAll({ where: { id: category_ids }, transaction });
            if (categories.length !== category_ids.length) {
                await transaction.rollback();
                return res.status(400).json({ message: 'One or more category_ids are invalid' });
            }
            await post.setCategories(categories, { transaction });
        }

        await transaction.commit();

        const created = await Post.findByPk(post.id, {
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Category, through: { attributes: [] } }
            ]
        });
        res.status(201).json(created);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: error?.message || 'Internal Server Error', name: error?.name, details: error?.errors || undefined });
    }
};

export const getPosts = async (req, res) => {
    try {
        const { status, category } = req.query;
        const where = {};
        if (status) where.status = status;
        const include = [
            { model: User, attributes: ['id', 'username'] },
            { model: PostImage, attributes: ['id', 'imageUrl', 'caption', 'orderIndex'] },
        ];
        if (category) {
            include.push({ model: Category, through: { attributes: [] }, where: { id: category } });
        } else {
            include.push({ model: Category, through: { attributes: [] } });
        }
        const posts = await Post.findAll({
            where,
            include,
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM post_likes AS pl
                            WHERE pl.post_id = "Post"."id"
                        )`),
                        'totalLikes'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comments AS c
                            WHERE c.post_id = "Post"."id"
                        )`),
                        'totalComments'
                    ]
                ]
            },
            order: [
                ['createdAt', 'DESC'],
                [PostImage, 'orderIndex', 'ASC']  // Order images by their orderIndex
            ]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTrendingPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const posts = await Post.findAll({
            where: { status: 'published' },
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Category, through: { attributes: [] } }
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM post_likes AS pl
                            WHERE pl.post_id = "Post"."id"
                        )`),
                        'totalLikes'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comments AS c
                            WHERE c.post_id = "Post"."id"
                        )`),
                        'totalComments'
                    ]
                ]
            },
            order: [
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM post_likes AS pl
                        WHERE pl.post_id = "Post"."id"
                    )`),
                    'DESC'
                ],
                ['createdAt', 'DESC']
            ],
            limit
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: PostSection, order: [['order_index', 'ASC']] },
                { model: PostImage },
                { model: Category, through: { attributes: [] } }
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM post_likes AS pl
                            WHERE pl.post_id = "Post"."id"
                        )`),
                        'totalLikes'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comments AS c
                            WHERE c.post_id = "Post"."id"
                        )`),
                        'totalComments'
                    ]
                ]
            }
        });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (req.user.role !== 'admin' && post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { title, introduction, banner, status, publishedAt } = req.body;
        await post.update({ title, introduction, banner, status, publishedAt });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (req.user.role !== 'admin' && post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await post.destroy();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addSection = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (req.user.role !== 'admin' && post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { title, content, order_index } = req.body;
        const section = await PostSection.create({ post_id: post.id, title, content, orderIndex: order_index });
        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSection = async (req, res) => {
    try {
        const section = await PostSection.findByPk(req.params.sectionId, { include: [{ model: Post }] });
        if (!section) return res.status(404).json({ message: 'Section not found' });
        if (req.user.role !== 'admin' && section.Post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { title, content, order_index } = req.body;
        await section.update({ title, content, orderIndex: order_index });
        res.json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSection = async (req, res) => {
    try {
        const section = await PostSection.findByPk(req.params.sectionId, { include: [{ model: Post }] });
        if (!section) return res.status(404).json({ message: 'Section not found' });
        if (req.user.role !== 'admin' && section.Post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await section.destroy();
        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addImage = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (req.user.role !== 'admin' && post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { image_url, caption, order_index, section_id } = req.body;
        let resolvedSectionId = null;
        if (section_id != null) {
            const section = await PostSection.findByPk(section_id);
            if (!section || section.post_id !== post.id) {
                return res.status(400).json({ message: 'Invalid section_id for this post' });
            }
            resolvedSectionId = section_id;
        }
        const image = await PostImage.create({ post_id: post.id, section_id: resolvedSectionId, imageUrl: image_url, caption, orderIndex: order_index });
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateImage = async (req, res) => {
    try {
        const image = await PostImage.findByPk(req.params.imageId, { include: [{ model: Post }] });
        if (!image) return res.status(404).json({ message: 'Image not found' });
        if (req.user.role !== 'admin' && image.Post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { caption, order_index, image_url } = req.body;
        const updates = {};
        if (typeof caption !== 'undefined') updates.caption = caption;
        if (typeof order_index !== 'undefined') updates.orderIndex = order_index;
        if (typeof image_url !== 'undefined') updates.imageUrl = image_url;
        await image.update(updates);
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const image = await PostImage.findByPk(req.params.imageId, { include: [{ model: Post }] });
        if (!image) return res.status(404).json({ message: 'Image not found' });
        if (req.user.role !== 'admin' && image.Post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await image.destroy();
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addPostCategory = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (req.user.role !== 'admin' && post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { category_id } = req.body;
        const category = await Category.findByPk(category_id);
        if (!category) return res.status(400).json({ message: 'Category not found' });
        await PostCategory.create({ post_id: post.id, category_id });
        res.status(201).json({ message: 'Category assigned to post' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removePostCategory = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (req.user.role !== 'admin' && post.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { categoryId } = req.params;
        await PostCategory.destroy({ where: { post_id: post.id, category_id: categoryId } });
        res.json({ message: 'Category removed from post' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


