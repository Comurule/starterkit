'use strict';

module.exports = (sequelize, DataTypes) => {
  const PreferenceCenter = sequelize.define('PreferenceCenter', 
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentPC: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PreferenceCenters',
        key: 'id',
      }
    },
    pcCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    displayType: {
      type: DataTypes.ENUM('Preference Center', 'Entity', 'Discover And Learn'),
      allowNull: false,
    },
  });

  // create association between user and role
  // a can have many users
  PreferenceCenter.associate = (models) => {
    models.PreferenceCenter.belongsToMany(models.Lead, {
      through: models.LeadPreference,
      foreignKey: 'preferenceId'
    });
    models.PreferenceCenter.hasMany(models.LeadPreference, {
      foreignKey: {
        name: 'preferenceId'
      }
    });
    models.PreferenceCenter.belongsTo(models.Department, {
      foreignKey: {
        name: 'departmentId',
        allowNull: false
    }
    });
    models.PreferenceCenter.belongsTo(models.CurrentBusiness, {
      foreignKey: {
        name: 'currentBusinessId',
        allowNull: false
    }
    });
  };

  return PreferenceCenter;
};

