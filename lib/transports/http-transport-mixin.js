const eventBus = require('../services/event-bus');

class HttpTransportMixin {
  static handleGet(ctx, proxy) {
    const maxScanTime = ctx.params.maxScanTime && parseInt(ctx.params.maxScanTime, 10) || null;
    const requestType = ctx.query.requestType;
    switch (requestType) {
      case 'getMiningInfo':
        ctx.body = proxy.getMiningInfo(maxScanTime);
        break;
      default:
        eventBus.publish('log/info', `${proxy.proxyConfig.name} | unknown requestType ${requestType} with data: ${JSON.stringify(ctx.params)}. Please message this info to the creator of this software.`);
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'unknown request type',
            code: 4,
          },
        };
    }
  }

  static async handlePost(ctx, proxy) {
    const maxScanTime = ctx.params.maxScanTime && parseInt(ctx.params.maxScanTime, 10) || null;
    const requestType = ctx.query.requestType;
    switch (requestType) {
      case 'getMiningInfo':
        ctx.body = proxy.getMiningInfo(maxScanTime);
        break;
      case 'submitNonce':
        const options = {
          ip: ctx.request.ip,
          maxScanTime: ctx.params.maxScanTime,
          minerName: ctx.req.headers['x-minername'] || ctx.req.headers['x-miner'],
          userAgent: ctx.req.headers['user-agent'],
          miner: ctx.req.headers['x-miner'],
          capacity: ctx.req.headers['x-capacity'],
          accountKey: ctx.req.headers['x-account'],
        };
        const submissionObj = {
          accountId: ctx.query.accountId,
          blockheight: ctx.query.blockheight,
          nonce: ctx.query.nonce,
          deadline: ctx.query.deadline
        };
        ctx.body = await proxy.submitNonce(submissionObj, options);
        if (ctx.body.error) {
          ctx.status = 400;
        }
        break;
      default:
        eventBus.publish('log/info', `${proxy.proxyConfig.name} | unknown requestType ${requestType} with data: ${JSON.stringify(ctx.params)}. Please message this info to the creator of this software.`);
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'unknown request type',
            code: 4,
          },
        };
    }
  }
}

module.exports = HttpTransportMixin;