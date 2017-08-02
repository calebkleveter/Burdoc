const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  entry: {
    'main.js': './source/main.js',
    'routeBuilder.js': './source/routeBuilder.js',
    'router.js': './source/router.js',
    'view.js': './source/view.js',
    'database.js': './source/database.js',
    'authenticate.js': './source/authenticate.js',
    'models/user.js': './source/models/user.js'
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name]',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              'targets': {
                'node': 'current'
              }
            }]
          ]
        }
      }
    }]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'source/views', to: 'views'},
      { from: 'source/resources', to: 'views'}
    ])
  ]
}
