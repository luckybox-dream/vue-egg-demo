'use strict';
import { getSuppressResponseHeaders, receiveDataAndRequest, resolve } from '../extend/proxyHelper';

module.exports = (options = {
  host: '',
  map: '',
  url: '',
  yieldNext: '',
  encoding: '',
}) => {
  // options || (options = {});
  // 判断 配置信息是否完整
  if (!(options.host || options.map || options.url)) {
    throw new Error('miss options');
  }

  return function* proxy(next) {

    // @ts-ignore don't match
    const url = resolve(this.path, options);
    if (!url) {
      return yield* next;
    }

    // @ts-ignore  if match option supplied, restrict proxy to that match
    if (options.match && !this.path.match(options.match)) {
      return yield* next;
    }
    // @ts-ignore
    const res = yield receiveDataAndRequest(options, url, this);

    // @ts-ignore
    this.status = res.statusCode;

    for (const name in res.headers) {
      // @ts-ignore
      if (getSuppressResponseHeaders(options).indexOf(name.toLowerCase()) >= 0) {
        continue;
      }
      if (Object.is(name, 'transfer-encoding')) {
        continue;
      }
      // @ts-ignore
      this.set(name, res.headers[name]);
    }

    if (options.encoding === 'gbk') {
      // @ts-ignore
      return this.body = require('iconv-lite').decode(res.body, 'gbk');
    }

    // @ts-ignore
    this.body = res.body;

    if (options.yieldNext) {
      yield next;
    }
  };
};
