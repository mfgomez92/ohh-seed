const merge = require('webpack-merge');
const common = require('../../../webpack.config.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    entry: './src/core/stub/index.js',
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
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: './src/core/stub/pages/creator.html', to: 'creator.html'},
                {from: './src/core/stub/pages/audience.html', to: 'audience.html'},
                {from: './src/core/stub/pages/test.html', to: 'test.html'},
                {from: './src/core/stub/pages/creator-submission-processing.html', to: 'creator-submission-processing.html'},
                ],
        }),
    ],
});

console.log(module.exports);
