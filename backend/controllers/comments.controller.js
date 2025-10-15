import Comment from '../models/Comment.model.js';
import User from '../models/User.model.js';

export const addComment = async (req, res) => {
    try {
        const { post_id, body, parent_id } = req.body;
        const comment = await Comment.create({ post_id, user_id: req.user.id, body, parent_id });
        const withUser = await Comment.findByPk(comment.id, { include: [{ model: User, attributes: ['id', 'username'] }] });
        res.status(201).json(withUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const { post_id } = req.query;
        const where = {};
        if (post_id) where.post_id = post_id;
        const comments = await Comment.findAll({ where, include: [{ model: User, attributes: ['id', 'username'] }] });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (req.user.role !== 'admin' && comment.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { body } = req.body;
        await comment.update({ body });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (req.user.role !== 'admin' && comment.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await comment.destroy();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


