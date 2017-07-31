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
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(vue)$/,
        loader: 'file-loader',
        options: {
          name: 'components/[name].[ext]'
        }
      },
      {
        test: /\.(css)$/,
        loader: 'file-loader',
        options: {
          name: 'css/[name].[ext]'
        }
      },
      {
        test: /\.(png|svg|jpe?g)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      }
    ]
  }
}
