import join = require('url');
import coRequest = require('co-request');

/**
 * 分离Url ? 之前的部分
 * @param url
 */
const ignoreQuery = (url) => url ? url.split('?')[0] : null;

/**
 * 对用户请求body体进行处理
 * @param ctx
 */
const getParsedBody = (ctx) => {
  let body = ctx.request.body;
  // 判断body是否存在
  if (Object.is(body, undefined) || Object.is(body, null)) {
    return undefined;
  }
  // 获取请求body 并进行转换
  if (!Buffer.isBuffer(body) && !Object.is(typeof body, 'string')) {
    const contentType = ctx.request.header['content-type'];
    body = contentType && !Object.is(contentType.indexOf('json'), -1) ? JSON.stringify(body) : body + '';
  }
  return body;
};

const pipeRequest = (readable, requestThunk) => {
  return (cb) => readable.pipe(requestThunk(cb));
};

/**
 * 对url进行处理操作 获得完整的URL不带参数的
 * @param path
 * @param options
 */
const resolve = (path, options) => {

  let url = options.url;
  if (url) {
    if (!/^http/.test(url)) {
      url = options.host ? join.resolve(options.host, url) : null;
    }
    return ignoreQuery(url);
  }

  switch (typeof options.map) {
    case 'object':
      if (options.map && options.map[path]) {
        path = ignoreQuery(options.map[path]);
      }
      break;
    case 'function':
      path = options.map(path);
      break;
    default:
      break;
  }

  return options.host ? join.resolve(options.host, path) : null;
};

/**
 * 接收前端请求并组装数据进行请求
 * @param options
 * @param url
 * @param _this
 */
const receiveDataAndRequest = async (options, url, _this) => {

  // 处理suppressRequestHeaders headers里面哪些字段不被发送到真正的server
  if (Object.is(typeof options.suppressRequestHeaders, 'object')) {
    options.suppressRequestHeaders.forEach((h, i) => {
      options.suppressRequestHeaders[i] = h.toLowerCase();
    });
  }

  const parsedBody = getParsedBody(_this);

  // request opitions
  let opt = {
    url: url + (_this.querystring ? '?' + _this.querystring : ''),
    headers: _this.header,
    encoding: null,
    followRedirect: !Object.is(options.followRedirect, false),
    method: _this.method,
    body: parsedBody,
  };
  // set 'Host' header to options.host (without protocol prefix), strip trailing slash
  if (options.host) {
    opt.headers.host = options.host.slice(options.host.indexOf('://') + 3).replace(/\/$/, '');
  }

  if (options.requestOptions) {
    if (typeof options.requestOptions === 'function') {
      opt = options.requestOptions(_this.request, opt);
    } else {
      Object.keys(options.requestOptions).forEach((option) => {
        opt[option] = options.requestOptions[option];
      });
    }
  }

  for (const name in opt.headers) {
    if (options.suppressRequestHeaders && options.suppressRequestHeaders.indexOf(name.toLowerCase()) >= 0) {
      delete opt.headers[name];
    }
  }

  const request = coRequest.defaults({jar: options.jar === true});
  const requestThunk = request(opt);

  // let res = parsedBody ? await requestThunk : await pipeRequest(_this.req, requestThunk);
  return parsedBody ? await requestThunk : await pipeRequest(_this.req, requestThunk);

};

/**
 * 处理从real server 接收的字段
 * @param options
 */
const getSuppressResponseHeaders = (options) => {
  const suppressResponseHeaders = [];  // We should not be overwriting the options object!
  if (Object.is(typeof options.suppressResponseHeaders, 'object')) {
    options.suppressResponseHeaders.forEach((h) => {
      // @ts-ignore
      suppressResponseHeaders.push(h.toLowerCase());
    });
  }

  return suppressResponseHeaders;
};

export {
  resolve,
  receiveDataAndRequest,
  getSuppressResponseHeaders,
}
