import path from 'node:path'
import process from 'node:process'

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import HTMLInlineCSSWebpackPluginModule from 'html-inline-css-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as lightningCss from 'lightningcss'
import { LightningCssMinifyPlugin } from 'lightningcss-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import webpack, {
  type Configuration,
  type WebpackPluginInstance,
} from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ZipPlugin from 'zip-webpack-plugin'

import pkg from './package.json' with { type: 'json' }

const HTMLInlineCSSWebpackPlugin =
  // @ts-expect-error Hack to import default module directly
  HTMLInlineCSSWebpackPluginModule.default as typeof HTMLInlineCSSWebpackPluginModule
const { ProgressPlugin } = webpack

const isCI = process.env['CI'] === 'true'
const isProductionBuild = process.env['NODE_ENV'] === 'production'
const isDevelopmentBuild = !isProductionBuild

const appNames = ['options', 'popup'] as const
const commonChunkName = 'common'
const outputDir = path.join('build', process.env['NODE_ENV'] || 'development')
const sourceDir = 'src'

const webpackConfig: Readonly<Configuration> = {
  devtool: isDevelopmentBuild ? 'inline-source-map' : false,
  entry: Object.fromEntries(
    appNames.map((appName) => [appName, `./${sourceDir}/${appName}`]),
  ),
  mode: isDevelopmentBuild ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.css$/u,
        use: [
          MiniCssExtractPlugin.loader,
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
        test: /\.tsx?$/u,
        loader: 'swc-loader',
      },
      {
        test: /\.woff2$/u,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(png|webp)$/u,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
      ...(isDevelopmentBuild
        ? [
            {
              test: /icon\d+\.png$/u,
              loader: 'image-process-loader',
              options: {
                greyscale: true,
              },
            },
          ]
        : []),
      {
        test: /\.svg$/u,
        resourceQuery: /svgr/u,
        issuer: /\.tsx?$/u,
        use: [
          'swc-loader',
          {
            loader: '@svgr/webpack',
            options: { babel: false, svgo: false },
          },
        ],
      },
      {
        test: /\.svg$/u,
        resourceQuery: { not: [/svgr/u] },
        type: 'asset',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\/manifest\.yml$/u,
        type: 'asset/resource',
        use: [
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
        generator: {
          filename: '[name].json',
        },
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
    path: path.resolve(import.meta.dirname, outputDir),
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
          removeAttributeQuotes: true,
          removeComments: true,
          useShortDoctype: true,
        },
        template: path.join(sourceDir, 'template.html'),
        title: pkg.name,
      })
    }),
    new MiniCssExtractPlugin(),
    ...(isProductionBuild
      ? [
          // this plugin does not update the inline css on watch mode
          new HTMLInlineCSSWebpackPlugin({
            styleTagFactory: ({ style }) => `<style>${style}</style>`,
          }),
        ]
      : []),
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
