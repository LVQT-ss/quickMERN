import Comment from '../models/Comment.model.js';
import Reaction from '../models/Reaction.model.js';
import User from '../models/User.model.js';
import Tutorial from '../models/Tutorial.model.js';

// Comment Controllers
export const addComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            ...req.body,
            userId: req.user.id,
            tutorialId: req.params.tutorialId
        });

        const commentWithUser = await Comment.findByPk(comment.id, {
            include: [{ model: User, attributes: ['username'] }]
        });

        res.status(201).json(commentWithUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.update({ content: req.body.content });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.destroy();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reaction Controllers
export const toggleReaction = async (req, res) => {
    try {
        const { tutorialId } = req.params;
        const { type } = req.body;

        if (!['like', 'dislike'].includes(type)) {
            return res.status(400).json({ message: 'Invalid reaction type' });
        }

        const tutorial = await Tutorial.findByPk(tutorialId);
        if (!tutorial) {
            return res.status(404).json({ message: 'Tutorial not found' });
        }

        const existingReaction = await Reaction.findOne({
            where: {
                userId: req.user.id,
                tutorialId
            }
        });

        if (existingReaction) {
            if (existingReaction.type === type) {
                // Remove reaction if same type
                await existingReaction.destroy();
                return res.json({ message: 'Reaction removed' });
            } else {
                // Update reaction if different type
                await existingReaction.update({ type });
                return res.json({ message: 'Reaction updated', reaction: existingReaction });
            }
        }

        // Create new reaction
        const reaction = await Reaction.create({
            type,
            userId: req.user.id,
            tutorialId
        });

        res.status(201).json({ message: 'Reaction added', reaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
