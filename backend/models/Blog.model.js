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
    youtubeVideoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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
    },
    viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'view_count'
    }
}, {
    timestamps: true,
    underscored: true
});

export default Post;
