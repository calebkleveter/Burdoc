const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const DashboardPlugin = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Merge = require('webpack-merge-and-include-globally');

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  entry: {
    'main.js': './source/main.js',
    'js/index.js': './source/resources/js/index.js'
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name]',
    library: 'App',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            optimizeSSR: false
          }
        }
      },
      {
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
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      }
    ]
  },
  plugins: [
    // new DashboardPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
//      { from: 'source/views', to: 'views' },
      { from: 'source/resources/images', to: 'images' },
      { from: 'source/resources/fonts', to: 'fonts' }
    ]),
    new Merge({
      files: {
        'css/main.css': [
          'source/resources/css/bootstrap.min.css',
          'source/resources/css/font-awesome.min.css',
          'source/resources/css/main.css'
        ]
      }
    })
  ]
};
