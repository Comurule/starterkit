'use strict';

module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    campaignName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campaignCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  Campaign.associate = (models) => {
    models.Campaign.hasMany(models.CampaignData, {
      foreignKey: {
        name: 'campaignId',
        allowNull: false
      }
    });
    models.Campaign.hasMany(models.LeadCampaign, {
      foreignKey: {
        name: 'campaignId',
        allowNull: false
      }
    });
    models.Campaign.belongsTo(models.Department, {
      foreignKey: {
        name: 'departmentId',
        allowNull: false
    }
    });
    models.Campaign.belongsTo(models.CurrentBusiness, {
      foreignKey: {
        name: 'currentBusinessId',
        allowNull: false
    }
    });
    models.Campaign.belongsToMany(models.Lead, {
      through: models.LeadCampaign,
      foreignKey: 'campaignId'
    });
  };

  return Campaign;
};

