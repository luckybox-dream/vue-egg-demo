import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import path = require('path');

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1542798792775_2611';

  // 默认端口配置为8003
  config.cluster = {
    listen: {
      port: 8003,
    },
  };

  // add your egg config in here
  config.middleware = [ 'gzip', 'proxyFirst'];

  // 配置 gzip 中间件的配置
  config.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  };

  // 代理后台服务接口配置
  config.proxyFirst = {
    host: `http://xxx.xxx.com/`,
    match: /^\/rbacapi\/.*/,
    oAuth: false,
    map: (path) => path.replace('\/rbacapi\/', ''),
  };

  config.view = {
    root: path.join(appInfo.baseDir, 'app/assets'),
    mapping: {
      '.js': 'assets',
    },
  };

  config.assets = {
    publicPath: '/public/',
    devServer: {
      debug: false,
      command: 'yarn run serve',
      port: 8080,
      env: {
        BROWSER: 'none',
        ESLINT: 'none',
        SOCKET_SERVER: 'http://127.0.0.1:8080',
        PUBLIC_PATH: 'http://127.0.0.1:8080',
      },
    },
  };

  // 配置路径重写插件
  config.rewriter = {
    // 默认重写到 /index.html
    index: '/public/index.html',
    // 打印日志
    verbose: true,
    // 白名单正则，默认 /\/api/gi, 符合白名单规则的url一律不重写
    whiteList: /\/api|\/rbacapi|\/logapi/gi,
  };

  config.security = {
    csrf: false,
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
