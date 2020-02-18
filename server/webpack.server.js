const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');

const config = require('../webpack.config');
const env = require('./env');

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, '../build'),
    sockPort: process.env.PORT || 3000,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    disableHostCheck: true
});

server.listen(env.PORT);