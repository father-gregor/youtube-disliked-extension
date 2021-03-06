require('dotenv').config({path: './vault.env'});

const publicKey = process.env.PUBLIC_KEY;
const oauthClientId = process.env.OAUTH_CLIENT_ID;

const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const packageJson = require('./package.json');
const distPath = path.join(__dirname, 'dist/youtube-disliked');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
    entry: {
        content: './src/scripts/content.ts',
        background: './src/scripts/background.ts',
        'toolbar-popup': './src/scripts/toolbar-popup.tsx',
    },
    output: {
        path: distPath,
        filename: 'js/[name].js'
    },
    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        } 
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader'},
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
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
            chunkFilename: 'styles/[name].[contenthash].css'
        }),
        {
            apply (compiler) {
                compiler.hooks.afterEmit.tap('insertDynamicContentChunks', (compilation) => {
                    const manifestPath = path.join(distPath, 'manifest.json');
                    let manifestJSON = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

                    for (let chunkPath of Object.keys(compilation.assets)) {
                        if ((chunkPath.includes('content') || chunkPath.includes('vendor')) && chunkPath.endsWith('.js')) {
                            manifestJSON.content_scripts[0].js.push(chunkPath);
                        }
                        if (chunkPath.includes('content') && chunkPath.endsWith('.css')) {
                            manifestJSON.content_scripts[0].css.push(chunkPath);
                        }
                    }
                    fs.writeFileSync(manifestPath, JSON.stringify(manifestJSON, null, 4), 'utf-8');
                });
            }
        },
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist/*')]}),
        new webpack.ProgressPlugin(),
        new CopyPlugin([
            {
                from: './src',
                to: distPath,
                ignore: ['*.html', '*.css', '*.scss', '*.js', '*.tsx', '*.ts', 'manifest.json']
            },
            {
                from: 'src/manifest.json',
                to: distPath,
                transform: function (content) {
                    const manifest = JSON.parse(content.toString());
                    return Buffer.from(JSON.stringify({
                        ...manifest,
                        key: publicKey,
                        oauth2: {
                            ...manifest.oauth2,
                            client_id: oauthClientId
                        },
                        version: packageJson.version
                    }, null, 4))
                }
            }
        ], {copyUnmodified: true})
    ],
};
