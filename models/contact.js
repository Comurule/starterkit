'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    //contact details
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

    mailingCurrency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
      validate: {
        len: [3, 4] // must be between 3 and 4.
      }
    },
    mailingLanguage: { type: DataTypes.STRING, defaultValue: 'english' },
    contactStatus: {
      type: DataTypes.ENUM('new', 'converted'),
      defaultValue: 'new'
    },

    //Company details
    mailingName: { type: DataTypes.STRING },
    mailingEmail: { type: DataTypes.STRING },
    mailingWebsite: { type: DataTypes.STRING },
    mailingAddress: { type: DataTypes.STRING },
    mailingCity: { type: DataTypes.STRING },
    mailingCountry: { type: DataTypes.STRING },

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


  Contact.associate = (models) => {

    models.Contact.belongsTo(models.Lead, {
      foreignKey: {
          name: 'leadId',
          allowNull: true
      }
    });
    models.Contact.belongsToMany(models.PreferenceCenter, {
      through: 'ContactPreferences',
      foreignKey: 'leadId'
    });

  };

  return Contact;
};
