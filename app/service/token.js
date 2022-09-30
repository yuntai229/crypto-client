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

	async getCurrentMarketCap(params) {
		try {
			this.logger.info('[getCurrentMarketCap] req: %s', JSON.stringify({ params }))

			const tokenAddress = params.tokenAddress

			let value = await this.service.redis.getValue(`current_${tokenAddress}`)

			if (value === null) {
				const tokenAddressList = await this.service.redis.getListData('token_address_list')
				if (tokenAddressList.indexOf(tokenAddress) === -1) {
					return {
						code: '400',
						message: 'invalid input'
					}
				} 
				await this.service.api.reporter.writeCurrentSpecifyTokenMarketCap(tokenAddress)
				value = await this.service.redis.getValue(`current_${tokenAddress}`)
			}

			return {
				code: '200',
				message: value
			}
		} catch (err) {
			this.logger.error('[getCurrentMarketCap] req: %s, err: %s', JSON.stringify({ params }), err.message)
			throw err
		}
	}

	async getHistoryMarketCap(params) {
		try {
			this.logger.info('[getHistoryMarketCap] req: %s', JSON.stringify({ params }))

			const tokenAddress = params.tokenAddress

			let value = await this.service.redis.getValue(`history_${tokenAddress}`)

			if (value === null) {
				const tokenAddressList = await this.service.redis.getListData('token_address_list')
				if (tokenAddressList.indexOf(tokenAddress) === -1) {
					return {
						code: '400',
						message: 'invalid input'
					}
				}
				await this.service.api.reporter.writeSpecifyTokenMarketCapHistory(tokenAddress)
				value = await this.service.redis.getValue(`history_${tokenAddress}`)
			}

			const history = JSON.parse(value).history

			return {
				code: '200',
				message: history
			}
		} catch (err) {
			this.logger.error('[getHistoryMarketCap] req: %s, err: %s', JSON.stringify({ params }), err.message)
			throw err
		}
	}
}


module.exports = TokenService