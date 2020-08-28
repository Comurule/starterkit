'use strict';
const { modelCodeGen } =  require('../utils/helpers');

module.exports = (sequelize, DataTypes) => {
  const LeadCampaignData = sequelize.define('LeadCampaignData', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    dataLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // create association between user and role
  // a can have many users
  LeadCampaignData.associate = (models) => {
    models.LeadCampaignData.belongsTo(models.Lead, {
      ondelete: 'CASCADE',
      foreignKey: {
        name: 'leadId',
        allowNull: false
      }
    });
    models.LeadCampaignData.belongsTo(models.CampaignData, {
      ondelete: 'CASCADE',
      foreignKey: {
        name: 'campaignDataId',
        allowNull: false
      }
    });
    models.LeadCampaignData.belongsTo(models.LeadCampaign, {
      ondelete: 'CASCADE',
      foreignKey: {
        name: 'leadCampaignId',
        allowNull: false
      }
    });
  };

  return LeadCampaignData;
};

