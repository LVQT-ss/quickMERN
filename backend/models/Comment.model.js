import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    tutorialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Tutorials',
            key: 'id'
        }
    },
    parentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Comments',
            key: 'id'
        }
    }
});

export default Comment;
