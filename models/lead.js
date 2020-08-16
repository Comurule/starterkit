'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define('Lead', {
    //Lead details
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [8, 50] // must be between 3 and 50.
      }
    },
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },

    leadCurrency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
      allowNull: true,
      validate: {
        len: [3, 4] // must be between 3 and 4.
      }
    },
    leadLanguage: { type: DataTypes.STRING, defaultValue: 'english' },
    leadStatus: {
      type: DataTypes.ENUM('new', 'converted'),      
      allowNull: false,
      defaultValue: 'new'
    },

    //Company details
    companyName: { type: DataTypes.STRING },
    companyEmail: { type: DataTypes.STRING },
    companyWebsite: { type: DataTypes.STRING },
    companyAddress: { type: DataTypes.STRING },
    companyCity: { type: DataTypes.STRING },
    companyCountry: { type: DataTypes.STRING },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      }
    }

  });


  Lead.associate = (models) => {
    models.Account.belongsTo(models.Department, {
      foreignKey: {
        name: 'departmentId',
        allowNull: false
    }
    });
    models.Account.belongsTo(models.CurrentBusiness, {
      foreignKey: {
        name: 'currentBusinessId',
        allowNull: false
    }
    });

    //   models.Lead.belongsTo(models.Profile, {
    //     allowNull: true
    //   });

    //   models.Lead.belongsTo(models.Role, {
    //     allowNull: true
    //   });


    //   models.Lead.hasMany(models.CampaignData, {
    //     foreignKey: {
    //       name: 'userId',
    //       allowNull: false
    //     }
    //   });

    //   models.Lead.hasMany(models.LeadCampaign, {
    //     foreignKey: {
    //       name: 'leadId',
    //       allowNull: false
    //     }
    //   });

    //   // models.Lead.belongsToMany(models.Campaign, {
    //   //   as: 'campaigns',
    //   //   through: 'CampaignMembers',
    //   //   onDelete: 'CASCADE',
    //   //   foreignKey: 'userId'
    //   // });

    models.Lead.belongsToMany(models.PreferenceCenter, {
      through: models.LeadPreference,
      foreignKey: 'leadId'
    });

    models.Lead.hasMany(models.LeadPreference, {
      foreignKey: {
        name: 'leadId'
      }
    });
    models.Lead.hasOne(models.Account, {
      foreignKey: {
        name: 'leadId'
      }
    });
    models.Lead.hasOne(models.Contact, {
      foreignKey: {
        name: 'leadId'
      }
    });
    //     models.L.belongsToMany(models.Permission,{ 
    //       as: 'permissions', 
    //       through: 'UserPermissions',
    //       foreignKey: 'user_id'
    //     });

  };

  return Lead;
};
