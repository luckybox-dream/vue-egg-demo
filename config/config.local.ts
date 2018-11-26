import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  // 默认端口配置为8003
  config.cluster = {
    listen: {
      port: 8003,
    },
  };
  return config;
};
