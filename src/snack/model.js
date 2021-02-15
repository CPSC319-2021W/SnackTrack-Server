import { db } from '../db/index.js'
import { Sequelize } from 'sequelize'
import SnackTypes from './snackTypes.js'

const { DataTypes } = Sequelize

const Snacks = db.define('snacks', {
    snack_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    snack_name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    description: {
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
    last_updated_dtm: {
        type: DataTypes.DATE
    },
    last_updated_by: {
        type: DataTypes.STRING(128),
        allowNull: false
    }
}, {underscored: true})

Snacks.belongsTo(SnackTypes, {
    foreignKey: {
        // TODO: SNAK-107 Investigate Passing snack_type_name Instead of snack_type_id
        name: 'snack_type_id',
        allowNull: false
    }
})

export default Snacks
