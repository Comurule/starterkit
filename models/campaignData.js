'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignData = sequelize.define('CampaignData', {
    userResponse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // create association between user and role
  // a can have many users
  CampaignData.associate = (models) => {
    models.CampaignData.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
    models.CampaignData.belongsTo(models.Campaign, {
      foreignKey: {
        name: 'campaignId',
        allowNull: false
      }
    });
    models.CampaignData.hasOne(models.LeadCampaignData, {
      foreignKey: {
        name: 'campaignDataId',
        allowNull: false
      }
    });
  };

  return CampaignData;
};

