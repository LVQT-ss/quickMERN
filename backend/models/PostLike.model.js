import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const PostLike = sequelize.define('PostLike', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    post_id: {
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
            fields: ['user_id', 'post_id']
        }
    ]
});

export default PostLike;


