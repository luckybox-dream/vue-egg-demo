import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  // 打印所有日志级别到终端
  // config.logger = {
  //   consoleLevel: 'DEBUG',
  // };
  config.assets = {
    url: 'http://127.0.0.1:7001',
    publicPath: '/public/',
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
  return config;
};
