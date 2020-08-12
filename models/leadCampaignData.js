'use strict';
module.exports = (sequelize, DataTypes) => {
  const LeadCampaignData = sequelize.define('LeadCampaignData', {
    leadResponse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // create association between user and role
  // a can have many users
  LeadCampaignData.associate = (models) => {
    
    models.LeadCampaignData.belongsTo(models.CampaignData, {
      ondelete: 'CASCADE',
      foreignKey: {
        name: 'campaignDataId',
        allowNull: false
      }
    });
  };

  return LeadCampaignData;
};

