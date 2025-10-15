import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    underscored: true
});

export default Category;
