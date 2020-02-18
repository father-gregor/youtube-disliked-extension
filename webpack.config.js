const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const packageJson = require('./package.json');

console.log('Dir', __dirname);

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'inline-source-map',
    entry: {
        content: './src/app/content.ts',
        background: './src/app/background.ts',
        popup: './src/ui/popup.tsx',
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
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
        new CopyPlugin([
            {
                from: './src',
                to: path.join(__dirname, 'dist'),
                ignore: ['*.js', '*.tsx', '*.ts', 'manifest.json']
            },
            {
                from: 'src/manifest.json',
                to: path.join(__dirname, 'dist'),
                transform: function (content) {
                    return Buffer.from(JSON.stringify({
                        ...JSON.parse(content.toString()),
                        description: packageJson.description,
                        version: packageJson.version
                    }, null, 4))
                }
            }
        ]),
    ]
};
