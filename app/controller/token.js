'use strict';

const Controller = require('egg').Controller;

class TokenController extends Controller {
	async createToken() {
		const { ctx } = this;
    	const requestBody = this.ctx.request.body

    	this.ctx.validate({
        	tokenAddress: 'string'
      	}, requestBody)

    	const result = await this.service.token.createToken(requestBody)
    	ctx.body = result;

  	}	
	async getCurrentMarketCap() {
		const { ctx } = this;
		const params = this.ctx.params

		const result = await this.service.token.getCurrentMarketCap(params)
		ctx.body = result;
  	}	

	async getHistoryMarketCap() {
		const { ctx } = this;
		const params = this.ctx.params

		const result = await this.service.token.getHistoryMarketCap(params)
		ctx.body = result;
  	}	

}

module.exports = TokenController;
