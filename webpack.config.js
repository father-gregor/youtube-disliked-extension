require('dotenv').config({path: './vault.env'});

const publicKey = process.env.PUBLIC_KEY;
const oauthClientId = process.env.OAUTH_CLIENT_ID;

const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const packageJson = require('./package.json');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'inline-source-map',
    entry: {
        content: './src/scripts/content.ts',
        background: './src/scripts/background.ts',
        Popup: './src/ui/Popup.tsx',
    },
    output: {
        path: path.join(__dirname, 'dist/youtube-disliked'),
        filename: 'js/[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader'},
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/popup-index.html',
            filename: 'popup-index.html',
            inject: 'body',
            excludeChunks: ['background', 'content'],
            minify: false
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
            chunkFilename: 'styles/[name].[contenthash].css',
        }),
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist/*')]}),
        new webpack.ProgressPlugin(),
        new CopyPlugin([
            {
                from: './src',
                to: path.join(__dirname, 'dist/youtube-disliked'),
                ignore: ['*.html', '*.css', '*.scss', '*.js', '*.tsx', '*.ts', 'manifest.json']
            },
            {
                from: 'src/manifest.json',
                to: path.join(__dirname, 'dist/youtube-disliked'),
                transform: function (content) {
                    const manifest = JSON.parse(content.toString());
                    return Buffer.from(JSON.stringify({
                        ...manifest,
                        key: publicKey,
                        oauth2: {
                            ...manifest.oauth2,
                            client_id: oauthClientId
                        },
                        description: packageJson.description,
                        version: packageJson.version
                    }, null, 4))
                }
            }
        ])
    ]
};
