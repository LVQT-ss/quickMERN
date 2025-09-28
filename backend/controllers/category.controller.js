import Category from '../models/Category.model.js';
import Tutorial from '../models/Tutorial.model.js';
import { Op } from 'sequelize';
import sequelize from '../database/db.js';

export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: [
                'id',
                'name',
                'description',
                'createdAt',
                'updatedAt',
                [sequelize.fn('COUNT', sequelize.col('Tutorials.id')), 'tutorialCount']
            ],
            include: [{
                model: Tutorial,
                attributes: [],  // We don't include Tutorial attributes, just use for counting
            }],
            group: ['Category.id', 'Category.name', 'Category.description', 'Category.createdAt', 'Category.updatedAt']
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
