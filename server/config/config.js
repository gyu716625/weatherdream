module.exports = {
  test: {
    username: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'weatherdream',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
  },
  development: {
    username: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'weatherdream',
    host: 'localhost',
    port: 13306,
    dialect: 'mysql',
    logging: false,
  },
};
