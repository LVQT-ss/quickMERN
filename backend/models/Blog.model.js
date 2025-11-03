import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    introduction: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    banner: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft'
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    underscored: true
});

export default Post;
