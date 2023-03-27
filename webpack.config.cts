import path from 'node:path'
import process from 'node:process'

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import lightningCss from 'lightningcss'
import { LightningCssMinifyPlugin } from 'lightningcss-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import {
  type Configuration,
  ProgressPlugin,
  type WebpackPluginInstance,
} from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ZipPlugin from 'zip-webpack-plugin'

import pkg from './package.json'

const isCI = process.env['CI'] === 'true'
const isProductionBuild = process.env['NODE_ENV'] === 'production'
const isDevelopmentBuild = !isProductionBuild

const appNames = ['options', 'popup'] as const
const commonChunkName = 'common'
const outputDir = path.join('build', process.env['NODE_ENV'] || 'development')
const sourceDir = 'src'

const webpackConfig: Configuration = {
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
            loader: 'lightningcss-loader',
            options: {
              implementation: lightningCss,
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
        new LightningCssMinifyPlugin({
          implementation: lightningCss,
        }),
        new TerserPlugin({
          minify: TerserPlugin.swcMinify,
          terserOptions: {
            compress: {
              // arguments: true, // this breaks the build
              drop_console: true,
              reduce_vars: true,
            },
            ecma: 2020 as const,
            module: true,
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
    ...(!isCI ? [new ProgressPlugin({})] : []),
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
    }) as WebpackPluginInstance,
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
        template: path.join(sourceDir, 'template.html'),
        title: pkg.name,
      })
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
    extensionAlias: {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.tsx', '.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
    extensions: [
      '.wasm',
      '.tsx',
      '.ts',
      '.mts',
      '.cts',
      '.js',
      '.mjs',
      '.cjs',
      '.json',
    ],
  },
  watch: isDevelopmentBuild,
}

export default webpackConfig
