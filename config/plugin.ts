import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  // 静态资源服务器配置
  assets: {
    enable: true,
    package: 'egg-view-assets',
  },
  // 前端静态资源重写
  rewriter: {
    enable: true,
    package: 'egg-rewriter',
  },
};

export default plugin;
