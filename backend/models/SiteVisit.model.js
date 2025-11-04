import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const SiteVisit = sequelize.define('SiteVisit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'ip_address'
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent'
    },
    page: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    referrer: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    visitDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'visit_date'
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'site_visits'
});

export default SiteVisit;

