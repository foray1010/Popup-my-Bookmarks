'use strict'

const webpack = require('webpack')

const webpackPlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin('common.js'),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin()
]

let devtool = undefined
let isWatch = false

switch (process.env.NODE_ENV) {
  case 'development':
    devtool = 'source-map'
    isWatch = true
    break

  case 'production':
    webpackPlugins.push(
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

module.exports = {
  devtool: devtool,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /\/node_modules\//,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: webpackPlugins,
  resolve: {
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    },
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    timings: true,
    version: false
  },
  watch: isWatch
}
