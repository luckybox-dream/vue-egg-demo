'use strict';

// 入口文件启动过程自定义
module.exports = app => {

    // 启动前初始化工作
    app.beforeStart(async () => {
        app.logger.debug('debug info');
        app.logger.info('启动耗时时间', Date.now());
        app.logger.info('当前运行环境==>', app.config.env);
        app.logger.warn('warning!');
    });

    app.messenger.on('ready_action', data => {
        app.logger.info('接受ready_action', JSON.stringify(data));
    });

  // const staticIndex = app.config.coreMiddleware.indexOf('static');
  // if (staticIndex === -1) {
  //   app.config.coreMiddleware.push('h5history');
  // } else {
  //   app.config.coreMiddleware.splice(staticIndex, 0, 'h5history');
  // }
};
