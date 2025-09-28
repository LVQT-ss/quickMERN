import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Tutorial = sequelize.define('Tutorial', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    thumbnail: {
        type: DataTypes.STRING(255),
    },
    status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft'
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    estimatedTime: {
        type: DataTypes.INTEGER, // thời gian ước tính theo phút
    },
    difficulty: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Categories',
            key: 'id'
        }
    }
});

export default Tutorial;
