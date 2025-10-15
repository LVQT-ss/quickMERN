import PostLike from '../models/PostLike.model.js';

export const toggleLike = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user_id = req.user.id;
        const { post_id } = req.body;
        if (!post_id) {
            return res.status(400).json({ message: 'post_id is required' });
        }
        const post_id_num = post_id;

        const existing = await PostLike.findOne({ where: { user_id, post_id: post_id_num } });
        if (existing) {
            await existing.destroy();
            return res.status(200).json({ message: 'Unliked', liked: false });
        }

        const like = await PostLike.create({ user_id, post_id: post_id_num });
        return res.status(201).json({ message: 'Liked', liked: true, like });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLikes = async (req, res) => {
    try {
        const { post_id } = req.query;
        const where = {};
        if (post_id) where.post_id = post_id;
        const likes = await PostLike.findAll({ where });
        res.json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLikesCount = async (req, res) => {
    try {
        const { post_id } = req.query;
        const count = await PostLike.count({ where: { post_id } });
        res.json({ post_id, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


