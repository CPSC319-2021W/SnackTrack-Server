import { db } from '../db/index.js';
import * as DataTypes from "sequelize";

const SnackTypes = db.define('snackTypes', {
    snacktypeid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    snacktypename: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    snacktypecode: {
        type: DataTypes.STRING(12),
        allowNull: false
    }
})

const Snacks = db.define('snacks', {
    snackid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    snackname: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    imageuri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    orderthreshold: {
        type: DataTypes.INTEGER
    },
    lastupdatedtm: {
        type: DataTypes.DATE,
        allowNull: false
    },
    lastupdateby: {
        type: DataTypes.STRING(16),
        allowNull: false
    }
})

Snacks.belongsTo(SnackTypes, {
    foreignKey: {
        allowNull: false
    }
})

export {SnackTypes, Snacks};

