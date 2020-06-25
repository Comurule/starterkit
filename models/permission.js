'use strict';
module.exports = (sequelize, DataTypes) => {
  var Permission = sequelize.define('Permission', {
     permission_name: {
        type: DataTypes.STRING,
        allowNull: false,
        }
  });
 
  // create association between permission and user
  // a permission can have many users
  Permission.associate = function(models) {
    models.Permission.hasMany(models.User);
  };
  
  //   Permission.associate = function(models) {
  //      models.Permission.belongsToMany(models.User,{ 
  //       as: 'users', 
  //       through: 'UserPermissions',
  //       foreignKey: 'permission_id'
  //      });
  //   };

  return Permission;
};
 