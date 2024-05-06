const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/iamport', // IAMPORT API로의 요청을 위한 패턴
    createProxyMiddleware({
      target: 'https://api.iamport.kr',
      changeOrigin: true,
    })
  );
};
