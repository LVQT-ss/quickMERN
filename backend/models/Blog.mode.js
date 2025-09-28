import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    picture: {
        type: DataTypes.STRING(255)
    }
});

export default Blog;
