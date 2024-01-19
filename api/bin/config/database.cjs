require('dotenv/config.js');

module.exports = {
    host: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: process.env.DB_DIALECT,
    logging: false,
    define: {
        timestamp: true,
        underscored: true,
        underscoredAll: true,
    },
};
