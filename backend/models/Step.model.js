import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Step = sequelize.define('Step', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    stepNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(255),
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

export default Step;
