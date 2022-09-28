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
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    sequelize : {
      dialect: 'mysql',
      database: 'naos',
      username: 'root',
      password: 'vu9Kq_.ueu8jmhAeyj*8',
      host: 'localhost',
      port: 3307,
      logging: false,
      define: { freezeTableName: true, timestamps: false },
    },

    // === middleware ===
    middleware: [ 'accessLogger' ],

    accessLogger: {
     match: '/',
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
