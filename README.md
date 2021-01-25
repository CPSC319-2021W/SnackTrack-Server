# SnackTrack-Server

More information for Sequelize is here: https://sequelize.org/master/index.html

```
├── README.md
├── app.js
├── bin
│   └── www
├── config          contains config file, which tells CLI how to connect with database
│   └── config.json
├── migrations      contains all migration files
├── models          contains all models for your project
│   └── index.js
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
├── routes
│   ├── index.js
│   └── users.js
├── seeders         contains all seed files
├── views
│   ├── error.jade
│   ├── index.jade
│   └── layout.jade
└── yarn.lock
```

## Example
This can be easily done through their CLI tool: https://dev.to/nedsoft/getting-started-with-sequelize-and-postgres-emp

The specific command I used:
```bash
sequelize model:generate --name User --attributes name:string,email:string
```

`migrations/20210125053158-create-user.js`:
```js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
```

`models/user.js`:
```js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
```