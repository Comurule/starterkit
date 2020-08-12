'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    //account details
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [8, 50] // must be between 3 and 50.
      }
    },
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },

    billingCurrency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
      validate: {
        len: [3, 4] // must be between 3 and 4.
      }
    },
    billingLanguage: { type: DataTypes.STRING, defaultValue: 'english' },
    accountStatus: {
      type: DataTypes.ENUM('new', 'converted'),
      defaultValue: 'new'
    },

    //Company details
    billingName: { type: DataTypes.STRING },
    billingEmail: { type: DataTypes.STRING },
    billingWebsite: { type: DataTypes.STRING },
    billingAddress: { type: DataTypes.STRING },
    billingCity: { type: DataTypes.STRING },
    billingCountry: { type: DataTypes.STRING },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      }
    }

  });


  Account.associate = (models) => {

      models.Account.belongsTo(models.Lead, {
        foreignKey: {
            name: 'leadId',
            allowNull: true
        }
      });
      
      models.Account.belongsToMany(models.PreferenceCenter, {
      through: 'AccountPreferences',
      foreignKey: 'accountId'
    });

  };

  return Account;
};
