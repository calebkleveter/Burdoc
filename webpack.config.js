const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, 'source/main.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}
