'use strict'

const cssnext = require('postcss-cssnext')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const mergeAndConcat = require('merge-and-concat')
const OptimizeJsPlugin = require('optimize-js-plugin')
const path = require('path')
const postcssImport = require('postcss-import')
const querystring = require('querystring')
const validate = require('webpack-validator')
const webpack = require('webpack')
const YAML = require('yamljs')

const {outputDir, sourceDir} = require('./config')

const manifest = YAML.load(
  path.join(sourceDir, 'manifest.yml')
)

const webpackConfig = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
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
    new webpack.optimize.CommonsChunkPlugin(path.join('js', 'common.js')),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  postcss: () => [
    postcssImport(),
    cssnext({
      autoprefixer: {
        browsers: `Chrome >= ${manifest.minimum_chrome_version}`
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    timings: true,
    version: false
  }
}

for (const appName of ['options', 'popup']) {
  mergeAndConcat(webpackConfig, {
    entry: {
      [appName]: [
        'babel-polyfill',
        `./${sourceDir}/js/${appName}`
      ]
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
        loaders: [
          {
            test: /\.css$/,
            loaders: [
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
        loaders: [
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract([
              `css-loader?${cssLoaderConfigQS}`,
              'postcss-loader'
            ])
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin(path.join('css', '[name].css'), {
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

module.exports = validate(webpackConfig)
