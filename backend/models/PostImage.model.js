import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const PostImage = sequelize.define('PostImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'image_url'
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_index'
    }
}, {
    timestamps: true,
    underscored: true
});

export default PostImage;


