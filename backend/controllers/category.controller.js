import Category from '../models/Category.model.js';
import Post from '../models/Blog.mode.js';
import PostCategory from '../models/PostCategory.model.js';
import { ValidationError, UniqueConstraintError } from 'sequelize';
import { Op } from 'sequelize';
import sequelize from '../database/db.js';

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const category = await Category.create({ name: name.trim(), description });
        res.status(201).json(category);
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: 'Category name must be unique' });
        }
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.errors?.[0]?.message || 'Validation error' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
            include: [{ model: Post, through: { attributes: [] } }]
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.update(req.body);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.destroy();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
