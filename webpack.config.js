const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const packageJson = require('./package.json');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'inline-source-map',
    entry: {
        content: './src/scripts/content.ts',
        background: './src/scripts/background.ts',
        popup: './src/ui/popup.tsx',
    },
    output: {
        path: path.join(__dirname, 'dist/youtube-disliked/js'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist/youtube-disliked/*')]}),
        new webpack.ProgressPlugin(),
        new CopyPlugin([
            {
                from: './src',
                to: path.join(__dirname, 'dist/youtube-disliked'),
                ignore: ['*.js', '*.tsx', '*.ts', 'manifest.json']
            },
            {
                from: 'src/manifest.json',
                to: path.join(__dirname, 'dist/youtube-disliked'),
                transform: function (content) {
                    return Buffer.from(JSON.stringify({
                        ...JSON.parse(content.toString()),
                        description: packageJson.description,
                        version: packageJson.version
                    }, null, 4))
                }
            }
        ])
    ]
};
