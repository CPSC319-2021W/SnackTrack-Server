import { db } from '../db/index.js'
import { Sequelize } from 'sequelize'

const { DataTypes } = Sequelize

const SnackBatches = db.define('snack_batches', {
    snack_batch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    expiration_dtm: {
        type: DataTypes.DATE
    }
}, {underscored: true})


export default SnackBatches
