'use strict';

exports.sequelize = {
  dialect: 'mysql',
  database: 'naos',
  username: 'root',
  password: 'vu9Kq_.ueu8jmhAeyj*8',
  host: '10.61.208.3',
  port: 3306,
  logging: false,
  define: { freezeTableName: true, timestamps: false },
};

exports.redis = {
  client: {
    host: '10.253.111.163',
    port: 6379,
    password: '',
    db: 0,
  },
};

exports.reporter = {
  host: '10.69.128.108',
  port: 7000,
};
