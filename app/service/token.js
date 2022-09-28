'use strict'

const Service = require('egg').Service

var Web3 = require('web3');
var provider = 'https://mainnet.infura.io/v3/5cdc4ff7c748435bbca1474f739be9b7';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);


class TokenService extends Service {
	async createToken(requestBody) {
		try {
			this.logger.info('[createToken] req: %s', JSON.stringify(requestBody))
			const tokenAddress = requestBody.tokenAddress
			const result = await this.verifyToken(tokenAddress)
			if (!result) {
				return {
					code: '400',
					message: 'Invalid input'
				}
			}

			const hasCreated = await this.ctx.model.Token.newData(tokenAddress)

			if (hasCreated === false) {
				return {
					code: '200',
					message: 'Token is exist'
				}
			}
			return {
				code: '200',
				message: 'Success'
			}
		} catch (err) {
			this.logger.error('[createToken] req: %s, err: %s', JSON.stringify(requestBody), err.message)
			throw err
		}
	}

	async verifyToken(tokenAddress) {
		return web3.utils.isAddress(tokenAddress)
	}
}


module.exports = TokenService