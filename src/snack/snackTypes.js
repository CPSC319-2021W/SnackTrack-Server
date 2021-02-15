import { db } from '../db/index.js'
import { Sequelize } from 'sequelize'

const { DataTypes } = Sequelize

const SnackTypes = db.define('snack_types', {
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

export default SnackTypes