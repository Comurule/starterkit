'use strict';

module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    campaignName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  campaignOwnerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    }
  },
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

  // create association between user and role
  // a can have many users
  Campaign.associate = (models) => {
    // models.Campaign.belongsToMany(models.User, {
    //   as: 'users',
    //   through: 'CampaignMembers',
    //   onDelete: 'CASCADE',
    //   foreignKey: 'campaignId'
    // });

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
  };

  return Campaign;
};

