import Tutorial from '../models/Tutorial.model.js';
import Step from '../models/Step.model.js';
import User from '../models/User.model.js';
import Category from '../models/Category.model.js';
import Comment from '../models/Comment.model.js';
import Reaction from '../models/Reaction.model.js';
import { Op } from 'sequelize';
import sequelize from '../database/db.js';

// Tutorial Controllers
export const createTutorial = async (req, res) => {
    try {
        // Check if category exists
        if (req.body.categoryId) {
            const category = await Category.findByPk(req.body.categoryId);
            if (!category) {
                return res.status(400).json({ message: 'Category not found. Please provide a valid categoryId.' });
            }
        }

        const tutorial = await Tutorial.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(tutorial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTutorials = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search, difficulty } = req.query;
        const offset = (page - 1) * limit;

        const where = {
            status: 'published'
        };

        if (category) where.categoryId = category;
        if (difficulty) where.difficulty = difficulty;
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const tutorials = await Tutorial.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['username'] },
                { model: Category, attributes: ['name'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            tutorials: tutorials.rows,
            totalPages: Math.ceil(tutorials.count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTutorialById = async (req, res) => {
    try {
        const tutorial = await Tutorial.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['username'] },
                { model: Category, attributes: ['name'] },
                { model: Step, order: [['stepNumber', 'ASC']] },
                {
                    model: Comment,
                    include: [
                        { model: User, attributes: ['username'] },
                        {
                            model: Comment,
                            as: 'Replies',
                            include: [{ model: User, attributes: ['username'] }]
                        }
                    ]
                }
            ]
        });

        if (!tutorial) {
            return res.status(404).json({ message: 'Tutorial not found' });
        }

        // Increment views
        await tutorial.increment('views');

        // Get reaction counts
        const reactions = await Reaction.findAll({
            where: { tutorialId: req.params.id },
            attributes: [
                'type',
                [sequelize.fn('COUNT', sequelize.col('type')), 'count']
            ],
            group: ['type']
        });

        const userReaction = req.user ? await Reaction.findOne({
            where: {
                tutorialId: req.params.id,
                userId: req.user.id
            }
        }) : null;

        res.json({
            ...tutorial.toJSON(),
            reactions,
            userReaction: userReaction?.type || null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTutorial = async (req, res) => {
    try {
        const tutorial = await Tutorial.findByPk(req.params.id);

        if (!tutorial) {
            return res.status(404).json({ message: 'Tutorial not found' });
        }

        if (tutorial.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await tutorial.update(req.body);
        res.json(tutorial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTutorial = async (req, res) => {
    try {
        const tutorial = await Tutorial.findByPk(req.params.id);

        if (!tutorial) {
            return res.status(404).json({ message: 'Tutorial not found' });
        }

        if (tutorial.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await tutorial.destroy();
        res.json({ message: 'Tutorial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step Controllers
export const addStep = async (req, res) => {
    try {
        const tutorial = await Tutorial.findByPk(req.params.tutorialId);

        if (!tutorial) {
            return res.status(404).json({ message: 'Tutorial not found' });
        }

        if (tutorial.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const step = await Step.create({
            ...req.body,
            tutorialId: req.params.tutorialId
        });

        res.status(201).json(step);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStep = async (req, res) => {
    try {
        const step = await Step.findByPk(req.params.stepId, {
            include: [{ model: Tutorial }]
        });

        if (!step) {
            return res.status(404).json({ message: 'Step not found' });
        }

        if (step.Tutorial.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await step.update(req.body);
        res.json(step);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteStep = async (req, res) => {
    try {
        const step = await Step.findByPk(req.params.stepId, {
            include: [{ model: Tutorial }]
        });

        if (!step) {
            return res.status(404).json({ message: 'Step not found' });
        }

        if (step.Tutorial.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await step.destroy();
        res.json({ message: 'Step deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
