/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1664293515178_225';

  // turn off crsf
  config.security = {
    csrf: {
      ignore: () => true,
    },
  };

  // add your middleware config here
  config.middleware = [ 'accessLogger' ];
  config.accessLogger = {
    match: '/',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    sequelize: {
      dialect: 'mysql',
      database: 'naos',
      username: 'root',
      password: 'vu9Kq_.ueu8jmhAeyj*8',
      host: 'localhost',
      port: 3307,
      logging: false,
      define: { freezeTableName: true, timestamps: false },
    },
    redis: {
      client: {
        host: '127.0.0.1',
        port: 6378,
        password: '',
        db: 0,
      },
    },
    reporter: {
      host: 'localhost',
      port: 7002,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
