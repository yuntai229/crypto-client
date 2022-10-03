'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/marketcap', controller.token.createToken);
  router.get('/marketcap/:tokenAddress', controller.token.getCurrentMarketCap);
  router.get('/marketcap/:tokenAddress/history', controller.token.getHistoryMarketCap);
};
