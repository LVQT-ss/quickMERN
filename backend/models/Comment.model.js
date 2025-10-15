import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    parentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Comments',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    underscored: true
});

export default Comment;
