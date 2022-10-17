'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const sinon = require('sinon');

describe('test/app/service/token.test.js', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });
  describe('[Function] createToken', () => {
    let stub;
    let verifyStub;
    beforeEach(() => {
      stub = sinon.stub(ctx.model.Token, 'newData');
      verifyStub = sinon.stub(ctx.service.token, 'verifyToken');
    });
    afterEach(() => {
      stub.restore();
      verifyStub.restore();
    });

    it('錯誤地址', async () => {
      const inputData = {
        tokenAddress: '000000000000000',
      };
      ctx.service.token.verifyToken.callsFake(() => {
        return false;
      });
      const res = await ctx.service.token.createToken(inputData);
      const expectOutput = {
        code: '400',
        message: 'Invalid input',
      };
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });

    it('正確地址且資料已存在', async () => {
      const inputData = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      ctx.service.token.verifyToken.callsFake(() => {
        return true;
      });

      ctx.model.Token.newData.callsFake(() => {
        return false;
      });
      const res = await ctx.service.token.createToken(inputData);
      const expectOutput = {
        code: '200',
        message: 'Token is exist',
      };
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });

    it('正確地址且資料不存在', async () => {
      const inputData = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      ctx.service.token.verifyToken.callsFake(() => {
        return true;
      });
      ctx.model.Token.newData.callsFake(() => {
        return true;
      });
      const res = await ctx.service.token.createToken(inputData);
      const expectOutput = {
        code: '200',
        message: 'Success',
      };
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });
  });

  describe('[Function] verifyToken', () => {
    it('錯誤地址', async () => {
      const inputValue = '000000000000000';
      const res = await ctx.service.token.verifyToken(inputValue);
      const expectValue = false;
      assert(res === expectValue);
    });

    it('正確地址', async () => {
      const inputValue = '0x4a615bb7166210cce20e6642a6f8fb5d4d044496';
      const res = await ctx.service.token.verifyToken(inputValue);
      const expectValue = true;
      assert(res === expectValue);
    });
  });

  describe('[Function] getCurrentMarketCap', () => {
    let redisGetValue;
    let redisGetListData;
    let reporterApi;
    beforeEach(() => {
      redisGetValue = sinon.stub(ctx.service.redis, 'getValue');
      redisGetListData = sinon.stub(ctx.service.redis, 'getListData');
      reporterApi = sinon.stub(ctx.service.api.reporter, 'writeCurrentSpecifyTokenMarketCap');
    });
    afterEach(() => {
      redisGetValue.restore();
      redisGetListData.restore();
      reporterApi.restore();
    });

    it('redis 無資料且不在 token 名單裡', async () => {
      const input = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      const expectOutput = {
        code: '400',
        message: 'invalid input',
      };
      ctx.service.redis.getValue.callsFake(() => {
        return null;
      });

      ctx.service.redis.getListData.callsFake(() => {
        return [];
      });

      const res = await ctx.service.token.getCurrentMarketCap(input);
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });

    it('redis 無資料但在 token 名單裡', async () => {
      const input = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      const expectOutput = {
        code: '200',
        message: 1,
      };
      ctx.service.redis.getValue.callsFake(() => {
        return null;
      });

      ctx.service.redis.getListData.callsFake(() => {
        return [ '0x4a615bb7166210cce20e6642a6f8fb5d4d044496' ];
      });

      ctx.service.api.reporter.writeCurrentSpecifyTokenMarketCap.callsFake(() => {
        return;
      });
      ctx.service.redis.getValue.callsFake(() => {
        return 1;
      });

      const res = await ctx.service.token.getCurrentMarketCap(input);
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });

    it('redis 有資料', async () => {
      const input = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      const expectOutput = {
        code: '200',
        message: 1,
      };
      ctx.service.redis.getValue.callsFake(() => {
        return 1;
      });

      const res = await ctx.service.token.getCurrentMarketCap(input);
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });
  });

  describe('[Function] getHistoryMarketCap', () => {
    let redisGetValue;
    let redisGetListData;
    let reporterApiWriteSpecifyTokenMarketCapHistory;
    beforeEach(() => {
      redisGetValue = sinon.stub(ctx.service.redis, 'getValue');
      redisGetListData = sinon.stub(ctx.service.redis, 'getListData');
      reporterApiWriteSpecifyTokenMarketCapHistory = sinon.stub(ctx.service.api.reporter, 'writeSpecifyTokenMarketCapHistory');
    });
    afterEach(() => {
      redisGetValue.restore();
      redisGetListData.restore();
      reporterApiWriteSpecifyTokenMarketCapHistory.restore();
    });

    it('redis 無資料且不在 token 名單裡', async () => {
      const input = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      const expectOutput = {
        code: '400',
        message: 'invalid input',
      };

      ctx.service.redis.getValue.callsFake(() => {
        return null;
      });
      ctx.service.redis.getListData.callsFake(() => {
        return [];
      });

      const res = await ctx.service.token.getHistoryMarketCap(input);
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });
    it('redis 無資料但在 token 名單裡', async () => {
      const input = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      const expectOutput = {
        code: '200',
        message: [],
      };

      ctx.service.redis.getValue.callsFake(() => {
        return null;
      });
      ctx.service.redis.getListData.callsFake(() => {
        return [ '0x4a615bb7166210cce20e6642a6f8fb5d4d044496' ];
      });
      ctx.service.api.reporter.writeSpecifyTokenMarketCapHistory.callsFake();
      ctx.service.redis.getValue.callsFake(() => {
        return JSON.stringify({ history: [] });
      });

      const res = await ctx.service.token.getHistoryMarketCap(input);
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });
    it('redis 有資料', async () => {
      const input = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      const expectOutput = {
        code: '200',
        message: [],
      };
      ctx.service.redis.getValue.callsFake(() => {
        return JSON.stringify({ history: [] });
      });

      const res = await ctx.service.token.getHistoryMarketCap(input);
      assert(JSON.stringify(res) === JSON.stringify(expectOutput));
    });
  });
});

