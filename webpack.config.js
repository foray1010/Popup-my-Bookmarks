'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const mergeAndConcat = require('merge-and-concat')
const OptimizeJsPlugin = require('optimize-js-plugin')
const path = require('path')
const querystring = require('querystring')
const webpack = require('webpack')

const {outputDir, sourceDir} = require('./config')

const manifest = require('./manifest')

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.pug$/,
        use: 'pug-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, outputDir),
    filename: path.join('js', '[name].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin('common'),
    new webpack.optimize.OccurrenceOrderPlugin(true)
  ],
  resolve: {
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    },
    // hack to use preact [https://github.com/developit/preact-compat/issues/192]
    mainFields: ['main', 'web'],
    extensions: ['.js', '.jsx']
  },
  stats: {
    timings: true,
    version: false
  }
}

for (const appName of ['options', 'popup']) {
  mergeAndConcat(webpackConfig, {
    entry: {
      [appName]: `./${sourceDir}/js/${appName}`
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: `${appName}.html`,
        inject: false,
        template: path.join(sourceDir, 'html', `${appName}.pug`),
        title: manifest.name
      })
    ]
  })
}

const cssLoaderConfigQS = querystring.stringify({
  modules: true,
  importLoaders: 1,
  localIdentName: '[name]__[local]___[hash:base64:5]'
})
switch (process.env.NODE_ENV) {
  case 'development':
    mergeAndConcat(webpackConfig, {
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader?' + querystring.stringify({
                sourceMap: true
              }),
              `css-loader?${cssLoaderConfigQS}`,
              'postcss-loader'
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
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                `css-loader?${cssLoaderConfigQS}`,
                'postcss-loader'
              ]
            })
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: path.join('css', '[name].css'),
          allChunks: true
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        }),
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
