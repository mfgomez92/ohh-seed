const common = require('./webpack.config.js');

module.exports = {
    ...common,
    mode: 'development',
    optimization: {
        minimize: false
    },
    devServer: {
        host: '0.0.0.0',
        hot: true,
        hotOnly: true,
        compress: false,
        proxy: {
            '/api/': {
                target: 'http://www.oooh.tv/',
                changeOrigin: true,
                autoRewrite: true,
                followRedirects: true,
                onProxyRes: (proxyRes, req, res) => {
                    if (req.url.endsWith('/o3h.js')) {
                        res.setHeader('Content-Type', 'text/javascript');
                        res.write('const LOCAL_DEVELOPMENT = true; //');
                    }
                }
            }
        }
    }
};
