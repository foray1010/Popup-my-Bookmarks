'use strict'

const webpack = require('webpack')

const webpackConfig = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /\/node_modules\//,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    timings: true,
    version: false
  }
}

switch (process.env.NODE_ENV) {
  case 'development':
    webpackConfig.devtool = 'source-map'
    webpackConfig.watch = true
    break

  case 'production':
    webpackConfig.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: true,
          pure_getters: true,
          unsafe: true,
          warnings: false
        },
        output: {
          comments: false,
          screw_ie8: true
        }
      })
    )
    break

  default:
}

module.exports = webpackConfig
