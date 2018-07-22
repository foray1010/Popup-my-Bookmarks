'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const R = require('ramda')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const ZipPlugin = require('zip-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const pkg = require('./package')

const getMergedConfigByEnv = R.converge(R.mergeDeepWith(R.concat), [
  R.prop('default'),
  R.propOr({}, process.env.NODE_ENV)
])

const appNames = ['options', 'popup']
const commonChunkName = 'common'
const cssLoaderOptions = {
  modules: true,
  importLoaders: 1,
  localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
}
const sourceDir = 'src'
const outputDir = path.join('build', process.env.NODE_ENV)

const webpackConfig = getMergedConfigByEnv({
  default: {
    entry: R.converge(R.zipObj, [R.identity, R.map(R.concat(`./${sourceDir}/js/`))])(appNames),
    mode: process.env.NODE_ENV,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
        {
          test: /\.woff2$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        },
        {
          test: /\.png$/,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
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
            {
              loader: 'extract-loader',
              options: {
                publicPath: './'
              }
            },
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
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: commonChunkName
      }
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
      new DuplicatePackageCheckerPlugin({
        emitError: true,
        strict: true
      }),
      ...R.map(
        (appName) =>
          new HtmlWebpackPlugin({
            chunks: [commonChunkName, appName],
            filename: `${appName}.html`,
            inject: 'head',
            minify: {
              collapseWhitespace: true,
              keepClosingSlash: true,
              minifyCSS: true,
              minifyJS: true,
              removeAttributeQuotes: true,
              removeCDATASectionsFromCDATA: true,
              removeComments: true,
              removeCommentsFromCDATA: true,
              removeScriptTypeAttributes: true,
              removeStyleTypeAttributes: true,
              useShortDoctype: true
            },
            title: pkg.name
          }),
        appNames
      ),
      new HtmlWebpackPlugin({
        filename: 'background.html',
        inject: false,
        title: 'hack to improve startup speed'
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'async'
      })
    ],
    resolve: {
      alias: {
        store: 'store/dist/store.modern'
      }
    }
  },
  development: {
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
    watch: true
  },
  production: {
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
        reportFilename: path.join('..', 'report.html')
      }),
      new ExtractTextPlugin({
        filename: path.join('css', '[name].css'),
        allChunks: true
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new UglifyJSPlugin({
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
            pure_getters: true,
            unsafe: true,
            unsafe_arrows: true,
            unsafe_comps: true,
            unsafe_Function: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            unsafe_undefined: true
          },
          ecma: 6,
          output: {
            wrap_iife: true
          }
        }
      }),
      new ZipPlugin({
        filename: `${pkg.version}.zip`
      })
    ]
  }
})

module.exports = webpackConfig
