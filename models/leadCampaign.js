'use strict';
module.exports = (sequelize, DataTypes) => {
  const LeadCampaign = sequelize.define('LeadCampaign', {
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  });

  // create association between user and role
  // a can have many users
  LeadCampaign.associate = (models) => {
    models.LeadCampaign.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'leadId',
        allowNull: false
      }
    });
    models.LeadCampaign.belongsTo(models.Campaign, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'campaignId',
        allowNull: false
      }
    });
  };

  return LeadCampaign;
};

