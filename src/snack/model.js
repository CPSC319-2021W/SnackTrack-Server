import { db } from '../db/index.js';
import * as DataTypes from "sequelize";

const SnackTypes = db.define('snackTypes', {
    snack_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    snack_type_name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    snack_type_code: {
        type: DataTypes.STRING(12),
        allowNull: false
    }
}, {underscored: true})

const Snacks = db.define('snacks', {
    snack_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    snack_name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    image_uri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    order_threshold: {
        type: DataTypes.INTEGER
    },
    last_update_dtm: {
        type: DataTypes.DATE,
        allowNull: false
    },
    last_update_by: {
        type: DataTypes.STRING(16),
        allowNull: false
    }
}, {underscored: true})

Snacks.belongsTo(SnackTypes, {
    foreignKey: {
        allowNull: false
    }
})

export {SnackTypes, Snacks};

