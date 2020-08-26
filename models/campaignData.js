'use strict';

module.exports = (sequelize, DataTypes) => {
  const CampaignData = sequelize.define('CampaignData', {
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
    displayType: {
      type: DataTypes.ENUM('text','checkbox'),
      allowNull: false,
    },
    cdCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  CampaignData.associate = (models) => {
    models.CampaignData.belongsTo(models.Campaign, {
      foreignKey: {
        name: 'campaignId',
        allowNull: false
      }
    });
    // models.CampaignData.hasMany(models.LeadCampaignData, {
    //   foreignKey: {
    //     name: 'campaignDataId',
    //     allowNull: false
    //   }
    // });
    models.CampaignData.belongsToMany(models.LeadCampaign, {
      through: models.LeadCampaignData,
      foreignKey: 'campaignDataId'
    });
  };

  return CampaignData;
};

