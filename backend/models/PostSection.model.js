import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const PostSection = sequelize.define('PostSection', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
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

export default PostSection;


