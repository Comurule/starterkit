var config = require('./config.global');

config.env = 'production';
config.hostname = process.env.DB_HOSTNAME;
config.db = {
    database: process.env.DB,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOSTNAME,
    sequelizeParams: {
        dialect: process.env.DB_DIALECT,
        use_env_variable: process.env.DB_URL,
        host: process.env.DB_HOSTNAME
    }
}

config.sessionDb = {
    database: process.env.DB,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOSTNAME,
    sequelizeParams: {
        dialect: process.env.DB_DIALECT,
        use_env_variable: process.env.DB_URL,
        host: process.env.DB_HOSTNAME
    }
}


module.exports = config;

 
     