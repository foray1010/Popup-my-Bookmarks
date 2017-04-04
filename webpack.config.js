'use strict'

const {appNames, commonChunkName, outputDir, sourceDir} = require('config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const mergeAndConcat = require('merge-and-concat')
const OptimizeJsPlugin = require('optimize-js-plugin')
const path = require('path')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const webpack = require('webpack')
const ZipPlugin = require('zip-webpack-plugin')

const pkg = require('./package')

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.woff$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\/manifest\.yml$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].json'
            }
          },
          'extract-loader',
          {
            loader: 'chrome-manifest-loader',
            options: {
              mapVersion: true
            }
          },
          'yaml-loader'
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, outputDir),
    filename: path.join('js', '[name].js')
  },
  plugins: [
    new CleanWebpackPlugin([outputDir]),
    new CopyWebpackPlugin([
      {
        context: sourceDir,
        from: path.join('_locales', '*', '*.json')
      },
      {
        from: 'LICENSE'
      }
    ]),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin(commonChunkName),
    new webpack.optimize.OccurrenceOrderPlugin(true)
  ],
  resolve: {
    alias: {
      'seamless-immutable': 'seamless-immutable/src/seamless-immutable'
    },
    extensions: ['.js', '.jsx']
  }
}

appNames.forEach((appName) => {
  mergeAndConcat(webpackConfig, {
    entry: {
      [appName]: `./${sourceDir}/js/${appName}`
    },
    plugins: [
      new HtmlWebpackPlugin({
        chunks: [commonChunkName, appName],
        filename: `${appName}.html`,
        inject: 'body',
        template: path.join(sourceDir, 'html', 'common', 'layout.pug'),
        title: pkg.name
      })
    ]
  })
})

const cssLoaderOptions = {
  modules: true,
  importLoaders: 1,
  localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
}
switch (process.env.NODE_ENV) {
  case 'development':
    mergeAndConcat(webpackConfig, {
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: cssLoaderOptions
              },
              'postcss-loader'
            ]
          },
          {
            test: /\/icon.+\.png$/,
            loader: 'image-process-loader',
            options: {
              greyscale: true
            }
          }
        ]
      },
      plugins: [
        new DashboardPlugin()
      ],
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
              publicPath: '../',
              use: [
                {
                  loader: 'css-loader',
                  options: cssLoaderOptions
                },
                'postcss-loader'
              ]
            })
          }
        ]
      },
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: path.join('..', '__report.html')
        }),
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
        new OptimizeJsPlugin(),
        new ZipPlugin({
          filename: `${pkg.version}.zip`
        })
      ]
    })
    break

  default:
}

module.exports = webpackConfig
