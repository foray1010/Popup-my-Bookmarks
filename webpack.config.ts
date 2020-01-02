import path from 'path'

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ZipPlugin from 'zip-webpack-plugin'

import pkg from './package.json'

const isCI = process.env.CI === 'true'
const isProductionBuild = process.env.NODE_ENV === 'production'
const isDevelopmentBuild = !isProductionBuild

const appNames = ['options', 'popup']
const commonChunkName = 'common'
const outputDir = path.join('build', process.env.NODE_ENV || 'development')
const sourceDir = 'src'

const webpackConfig: webpack.Configuration = {
  devtool: isDevelopmentBuild ? 'source-map' : undefined,
  entry: appNames.reduce(
    (acc, appName) => ({
      ...acc,
      [appName]: `./${sourceDir}/${appName}`,
    }),
    {},
  ),
  mode: isDevelopmentBuild ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDevelopmentBuild
            ? {
                loader: 'style-loader',
                options: {
                  esModule: true,
                },
              }
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: true,
                  publicPath: '../',
                },
              },
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.woff2$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.(png|svg)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: 'images/[name].[ext]',
        },
      },
      ...(isDevelopmentBuild
        ? [
            {
              test: /\/core\/.+\.(png|svg)$/,
              loader: 'image-process-loader',
              options: {
                greyscale: true,
              },
            },
          ]
        : []),
      {
        test: /\/manifest\.yml$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].json',
            },
          },
          {
            loader: 'extract-loader',
            options: {
              publicPath: './',
            },
          },
          {
            loader: 'chrome-manifest-loader',
            options: {
              mapMinimumChromeVersion: true,
              mapVersion: true,
            },
          },
          'yaml-loader',
        ],
      },
    ],
  },
  optimization: {
    ...(isProductionBuild && {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: true,
              module: true,
              passes: 2,
              pure_getters: true,
              unsafe: true,
              unsafe_arrows: true,
              unsafe_comps: true,
              unsafe_Function: true,
              unsafe_math: true,
              unsafe_methods: true,
              unsafe_proto: true,
              unsafe_regexp: true,
              unsafe_undefined: true,
            },
            ecma: 8,
          },
        }),
      ],
    }),
    splitChunks: {
      chunks: 'all',
      name: commonChunkName,
    },
  },
  output: {
    path: path.resolve(__dirname, outputDir),
    filename: path.join('js', '[name].js'),
  },
  plugins: [
    ...(!isCI ? [new webpack.ProgressPlugin()] : []),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyWebpackPlugin([
      {
        context: path.join(sourceDir, 'core'),
        from: path.join('_locales', '*', '*.json'),
      },
      {
        from: 'LICENSE',
      },
    ]),
    new DuplicatePackageCheckerPlugin({
      emitError: true,
      strict: true,
    }),
    ...appNames.map(appName => {
      return new HtmlWebpackPlugin({
        chunks: [commonChunkName, appName],
        filename: `${appName}.html`,
        inject: 'head',
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          minifyCSS: true,
          minifyJS: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        title: pkg.name,
      })
    }),
    new HtmlWebpackPlugin({
      filename: 'background.html',
      inject: false,
      title: 'hack to improve startup speed',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    ...(isProductionBuild && !isCI
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: path.join('..', 'report.html'),
          }),
        ]
      : []),
    ...(isProductionBuild
      ? [
          new MiniCssExtractPlugin({
            filename: path.join('css', '[name].css'),
          }),
          new ZipPlugin({
            filename: `${pkg.version}.zip`,
          }),
        ]
      : []),
  ],
  resolve: {
    extensions: ['.wasm', '.tsx', '.ts', '.mjs', '.js', '.json'],
  },
  watch: isDevelopmentBuild,
}

export default webpackConfig
