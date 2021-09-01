const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "index.html", to: "index.html" }
            ]
        })
    ]
};