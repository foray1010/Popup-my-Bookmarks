import parcelCss from '@parcel/css'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { ParcelCssMinifyPlugin } from 'parcel-css-loader'
import path from 'path'
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
  devtool: isDevelopmentBuild ? 'inline-source-map' : false,
  entry: Object.fromEntries(
    appNames.map((appName) => [appName, `./${sourceDir}/${appName}`]),
  ),
  mode: isDevelopmentBuild ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDevelopmentBuild ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'parcel-css-loader',
            options: {
              implementation: parcelCss,
              drafts: {
                nesting: true,
              },
              // ignore css modules syntax as it is handled by css-loader
              errorRecovery: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-normalize'],
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'swc-loader',
      },
      {
        test: /\.woff2$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
      ...(isDevelopmentBuild
        ? [
            {
              test: /\/core\/.+\.png$/,
              loader: 'image-process-loader',
              options: {
                greyscale: true,
              },
            },
          ]
        : []),
      ...[
        {
          test: /\.svg$/,
          resourceQuery: /svgr/,
          issuer: /\.tsx?$/,
          use: [
            'swc-loader',
            {
              loader: '@svgr/webpack',
              options: { babel: false },
            },
          ],
        },
        {
          test: /\.svg$/,
          resourceQuery: { not: [/svgr/] },
          type: 'asset',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
      ],
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
          {
            loader: 'yaml-loader',
            options: { asJSON: true },
          },
        ],
      },
    ],
  },
  optimization: {
    ...(isProductionBuild && {
      minimize: true,
      minimizer: [
        new ParcelCssMinifyPlugin({
          implementation: parcelCss,
        }),
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
              unsafe_symbols: true,
              unsafe_undefined: true,
            },
            ecma: 2020 as const,
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
    ...(!isCI ? [new webpack.ProgressPlugin({})] : []),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: path.join(sourceDir, 'core'),
          from: path.join('_locales', '**', 'messages.json'),
        },
        {
          from: 'LICENSE',
        },
      ],
    }),
    new DuplicatePackageCheckerPlugin({
      emitError: true,
      strict: true,
    }) as webpack.WebpackPluginInstance,
    ...appNames.map((appName) => {
      return new HtmlWebpackPlugin({
        chunks: [commonChunkName, appName],
        filename: `${appName}.html`,
        inject: 'head',
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
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
