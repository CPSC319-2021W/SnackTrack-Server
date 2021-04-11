export default (db, DataTypes) => {
  const Users = db.define('users', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    email_address: {
      type: DataTypes.STRING
    },
    balance: {
      type: DataTypes.INTEGER
    },
    is_active: {
      type: DataTypes.BOOLEAN
    },
    image_uri: {
      type: DataTypes.STRING
    },
    is_admin: {
      type: DataTypes.BOOLEAN
    }
  }, {
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'deleted_at'
  })
  return Users
}


