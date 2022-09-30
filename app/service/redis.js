'use strict'

const Service = require('egg').Service

class RedisService extends Service {
    async getListData(key) {
        try {
            this.logger.info('[getListData]')
            const list = await this.app.redis.smembers(key);
            return list
        } catch (err) {
            this.logger.error('[getListData] res: %s', err.message)
        }
    }

    async insertTokenList(tokenAddress) {
        try {
            this.logger.info('[insertTokenList] req: %s', JSON.stringify({tokenAddress}))
            await this.app.redis.set('token_list', tokenAddress);
        } catch (err) {
            this.logger.error('[insertTokenList] req: %s, err: %s', JSON.stringify({tokenAddress}), err.message)
            throw err
        }
    }


    async getValue(key) {
        try {
            this.logger.info('[getListData]')
            const value = await this.app.redis.get(key);
            return value
        } catch (err) {
            this.logger.error('[getListData] res: %s', err.message)
        }
    }
}

module.exports = RedisService