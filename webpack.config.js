'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const querystring = require('querystring')
const webpack = require('webpack')

const webpackConfig = {
  entry: {
    options: './src/js/options/index.jsx',
    popup: './src/js/popup/index.jsx'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /\/node_modules\//,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    filename: './js/[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin('./js/common.js'),
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
    webpackConfig.module.loaders.push({
      test: /\.scss$/,
      loaders: [
        'style-loader?' + querystring.stringify({
          sourceMap: true
        }),
        'css-loader?' + querystring.stringify({
          modules: true,
          importLoaders: 1,
          localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
        }),
        'sass-loader'
      ]
    })
    webpackConfig.watch = true
    break

  case 'production':
    webpackConfig.module.loaders.push({
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', [
        'css-loader?' + querystring.stringify({
          modules: true,
          importLoaders: 1,
          localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
        }),
        'sass-loader'
      ])
    })
    webpackConfig.plugins.push(
      new ExtractTextPlugin('./css/[name].css', {
        allChunks: true
      }),
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
