'use strict';

module.exports = (sequelize, DataTypes) => {
  const LeadCampaign = sequelize.define('LeadCampaign', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    campaignName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pageName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  LeadCampaign.associate = (models) => {
    models.LeadCampaign.belongsTo(models.Lead, {
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
    // models.LeadCampaign.hasMany(models.LeadCampaignData, {
    //   onDelete: 'CASCADE',
    //   foreignKey: {
    //     name: 'leadCampaignId',
    //     allowNull: false
    //   }
    // });
    models.LeadCampaign.belongsToMany(models.CampaignData, {
      through: models.LeadCampaignData,
      foreignKey: 'leadCampaignId'
    });
  };

  return LeadCampaign;
};

