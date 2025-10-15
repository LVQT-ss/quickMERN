import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const PostCategory = sequelize.define('PostCategory', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['post_id', 'category_id']
        }
    ]
});

export default PostCategory;


