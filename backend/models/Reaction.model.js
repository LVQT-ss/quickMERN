import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Reaction = sequelize.define('Reaction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false
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
    }
});

export default Reaction;
