'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
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
const {
  appNames, commonChunkName, outputDir, sourceDir
} = require('./config')

const getMergedConfigByEnv = R.converge(R.mergeDeepWith(R.concat), [
  R.prop('default'),
  R.propOr({}, process.env.NODE_ENV)
])

const cssLoaderOptions = {
  modules: true,
  importLoaders: 1,
  localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
}

const webpackConfig = getMergedConfigByEnv({
  default: {
    entry: R.converge(R.zipObj, [R.identity, R.map(R.concat(`./${sourceDir}/js/`))])(appNames),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
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
      ...R.map(
        (appName) =>
          new HtmlWebpackPlugin({
            chunks: [commonChunkName, appName],
            filename: `${appName}.html`,
            inject: 'body',
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
        'seamless-immutable': 'seamless-immutable/src/seamless-immutable',
        store: 'store/dist/store.modern'
      },
      extensions: ['.js', '.jsx']
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
        reportFilename: path.join('..', '__report.html')
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
            unsafe_Func: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true
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
