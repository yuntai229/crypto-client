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
}

module.exports = TokenController;
