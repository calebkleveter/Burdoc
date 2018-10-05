const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const DashboardPlugin = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Merge = require('webpack-merge-and-include-globally');

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  entry: {
    'main.js': './source/main.js'
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
    // new DashboardPlugin(),
    new CopyWebpackPlugin([
      { from: 'source/views', to: 'views' },
      { from: 'source/resources/images', to: 'images' },
      { from: 'source/resources/fonts', to: 'fonts' }
    ]),
    new Merge({
      files: {
        'css/main.css': [
          'source/resources/css/bootstrap.min.css',
          'source/resources/css/font-awesome.min.css',
          'source/resources/css/main.css'
        ],
        'js/index.js': [
          'source/resources/js/jquery-3.2.1.min.js',
          'source/resources/js/bootstrap.min.js',
          'source/resources/js/vue.js',
          'source/resources/js/showdown.min.js',
          'source/resources/js/bootbox.min.js',
          'source/resources/js/jsPDF.min.js',
          'source/resources/js/html2canvas.js',
          'source/resources/js/html2pdf.js',
          'source/resources/js/vue-resource.js',
          'source/views/components/burdoc-header.js',
          'source/views/components/burdoc-signup-form.js',
          'source/views/components/burdoc-login-form.js',
          'source/views/components/burdoc-new-doc-model.js',
          'source/views/components/burdoc-rename-doc-model.js',
          'source/views/components/burdoc-documents.js',
          'source/views/components/burdoc-doc-editor.js',
          'source/resources/js/index.js'
        ]
      }
    })
  ]
};
