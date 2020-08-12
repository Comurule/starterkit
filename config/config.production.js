var config = require('./config.global');

config.env = 'production';
config.hostname = 'manifestdbinstance.cgq0reqixqsd.us-east-1.rds.amazonaws.com';
config.db = {
    database: 'leadCampaign',
    username: 'manifestUser',
    password: 'manifestPassword',
    host: "manifestdbinstance.cgq0reqixqsd.us-east-1.rds.amazonaws.com",
    sequelizeParams: {
        dialect: 'postgres',
        host: "manifestdbinstance.cgq0reqixqsd.us-east-1.rds.amazonaws.com",
        operatorsAliases: false
    }
}
// manifeststarterkitdb
config.sessionDb = {
    database: 'leadCampaign',
    username: 'manifestUser',
    password: 'manifestPassword',
    host: "manifestdbinstance.cgq0reqixqsd.us-east-1.rds.amazonaws.com",
    sequelizeParams: {
        dialect: 'postgres',
        host: "manifestdbinstance.cgq0reqixqsd.us-east-1.rds.amazonaws.com",
        operatorsAliases: false
    }
}

module.exports = config;