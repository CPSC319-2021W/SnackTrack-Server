import { db } from '../db/index.js'
import * as DataTypes from "sequelize"

export const SnackTypes = db.define('snack_types', {
    snack_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    snack_type_name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    snack_type_code: {
        type: DataTypes.STRING(128),
        allowNull: false
    }
}, {underscored: true})