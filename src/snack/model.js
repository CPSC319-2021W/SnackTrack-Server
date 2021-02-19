export default (db, DataTypes) => {
    const Snacks = db.define('snacks', {
        snack_id: {
           type: DataTypes.INTEGER,
           primaryKey: true,
          autoIncrement: true
        },
     snack_name: {
            type: DataTypes.STRING(128)
        },
        description: {
           type: DataTypes.STRING(128)
        },
        image_uri: {
          type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER
        },
        is_active: {
            type: DataTypes.BOOLEAN
        },
        order_threshold: {
        type: DataTypes.INTEGER
        },
        last_updated_dtm: {
           type: DataTypes.DATE
        },
        last_updated_by: {
           type: DataTypes.STRING(128)
        }
    }, {underscored: true})
    return Snacks
}

