import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        if (email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        } else {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            passwordHash: hashedPassword
        });

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Find user by username or email
        const where = username ? { username } : { email };
        const user = await User.findOne({ where });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const syncFirebaseUser = async (req, res) => {
    try {
        const { uid, email, displayName, photoURL } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Create new user with Firebase data
            const username = displayName || email.split('@')[0];

            user = await User.create({
                username: username.replace(/\s+/g, '_'), // Replace spaces with underscore
                email,
                passwordHash: await bcrypt.hash(uid, 10), // Use Firebase UID as password hash
                avatar: photoURL || null,
                role: 'user',
                bio: null
            });
        } else {
            // Update existing user with latest Firebase data
            if (photoURL && !user.avatar) {
                user.avatar = photoURL;
                await user.save();
            }
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({
            message: 'User synced successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('Sync Firebase user error:', error);

        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Username or email already exists. Please try logging in instead.'
            });
        }

        res.status(500).json({ message: 'Failed to sync user: ' + error.message });
    }
};