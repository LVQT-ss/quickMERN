import User from '../models/User.model.js';

export const createUser = async (req, res) => {
    try {
        const { username, email, passwordHash, role, bio } = req.body;
        const existing = await User.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = await User.create({ username, email, passwordHash, role, bio });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role', 'bio', 'avatar', 'createdAt', 'updatedAt'] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: ['id', 'username', 'email', 'role', 'bio', 'avatar', 'createdAt', 'updatedAt'] });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (req.user.role !== 'admin' && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { username, email, bio, avatar } = req.body;
        await user.update({ username, email, bio, avatar });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


