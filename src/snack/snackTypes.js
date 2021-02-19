export default (db, DataTypes) => {
    const SnackTypes = db.define('snack_types', {
        snack_type_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        snack_type_name: {
            type: DataTypes.STRING(128)
        },
        snack_type_code: {
            type: DataTypes.STRING(128)
        }
    }, {underscored: true})
    return SnackTypes
}
