'use strict';
module.exports = (sequelize, DataTypes) => {
  var CurrentBusiness = sequelize.define('CurrentBusiness', {
       current_business_name: {
        type: DataTypes.STRING,
        allowNull: false,
        }
  });
 
  // create association between current business and user
  // a current business can have many users
  CurrentBusiness.associate = function(models) {
    models.CurrentBusiness.hasMany(models.User);
    models.CurrentBusiness.hasMany(models.Post);
    models.CurrentBusiness.hasMany(models.Lead, {
      foreignKey: {
        name: 'currentBusinessId',
        allowNull: false
      }
    });
    models.CurrentBusiness.hasMany(models.PreferenceCenter, {
      foreignKey: {
        name: 'currentBusinessId',
        allowNull: false
      }
    });
    models.CurrentBusiness.hasMany(models.Campaign, {
      foreignKey: {
        name: 'currentBusinessId',
        allowNull: false
      }
    });
  };
 
  
  return CurrentBusiness;
};

 