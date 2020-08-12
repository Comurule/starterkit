'use strict';
module.exports = (sequelize, DataTypes) => {
  const LeadPreference = sequelize.define('LeadPreference', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    enrolled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  });
  LeadPreference.associate = (models) => {
    models.LeadPreference.belongsTo(models.PreferenceCenter, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'preferenceId'
      }
    });
    models.LeadPreference.belongsTo(models.Lead, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'leadId'
      }
    });
  }

  return LeadPreference;
};

