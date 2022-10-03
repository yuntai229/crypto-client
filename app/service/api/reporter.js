'use strict';

const Service = require('egg').Service;

class ReportService extends Service {
  async writeCurrentSpecifyTokenMarketCap(tokenAddress) {
    try {
      this.logger.info('[writeCurrentSpecifyTokenMarketCap] req: %s', JSON.stringify({ tokenAddress }));
      await this.ctx.curl(`http://${this.config.reporter.host}:${this.config.reporter.port}/writeCurrentSpecifyTokenMarketCap`, {
        method: 'POST',
        data: {
          tokenAddress,
        },
      });
    } catch (err) {
      this.logger.error('[writeCurrentSpecifyTokenMarketCap] req: %s, res: %s', JSON.stringify({ tokenAddress }), err.message);
      throw err;
    }
  }

  async writeSpecifyTokenMarketCapHistory(tokenAddress) {
    try {
      this.logger.info('[writeSpecifyTokenMarketCapHistory] req: %s', JSON.stringify({ tokenAddress }));
      await this.ctx.curl(`http://${this.config.reporter.host}:${this.config.reporter.port}/writeSpecifyTokenMarketCapHistory`, {
        method: 'POST',
        data: {
          tokenAddress,
        },
      });
    } catch (err) {
      this.logger.error('[writeSpecifyTokenMarketCapHistory] req: %s, res: %s', JSON.stringify({ tokenAddress }), err.message);
      throw err;
    }
  }
}

module.exports = ReportService;
