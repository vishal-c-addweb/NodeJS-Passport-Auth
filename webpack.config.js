const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {

    target: 'node',

    externals: [nodeExternals()],

    // bundling mode
    mode: 'development',

    // entry files
    entry: "./src/index.ts",

    // output bundles (location)
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    // file resolutions
    resolve: {
        extensions: ['.ts', '.js'],
    },

    // loaders
    module: {
        rules: [{
            test: /\.tsx?/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }]
    }
};