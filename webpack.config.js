'use strict'

const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'
const webpackPlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin('common.js'),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin()
]

if (!isDev) {
  webpackPlugins.push(new webpack.optimize.UglifyJsPlugin({
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
  }))
}

module.exports = {
  devtool: isDev ? 'source-map' : undefined,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: webpackPlugins,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    timings: true,
    version: false
  },
  watch: isDev
}
