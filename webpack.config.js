'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const mergeAndConcat = require('merge-and-concat')
const OptimizeJsPlugin = require('optimize-js-plugin')
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

const cssLoaderConfigQS = querystring.stringify({
  modules: true,
  importLoaders: 1,
  localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
})
switch (process.env.NODE_ENV) {
  case 'development':
    mergeAndConcat(webpackConfig, {
      devtool: 'source-map',
      module: {
        loaders: [
          {
            test: /\.scss$/,
            loaders: [
              'style-loader?' + querystring.stringify({
                sourceMap: true
              }),
              'css-loader?' + cssLoaderConfigQS,
              'sass-loader'
            ]
          }
        ]
      },
      watch: true
    })
    break

  case 'production':
    mergeAndConcat(webpackConfig, {
      module: {
        loaders: [
          {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract([
              'css-loader?' + cssLoaderConfigQS,
              'sass-loader'
            ])
          }
        ]
      },
      plugins: [
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
        }),
        new OptimizeJsPlugin()
      ]
    })
    break

  default:
}

module.exports = webpackConfig
