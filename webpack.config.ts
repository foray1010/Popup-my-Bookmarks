import path from 'path'

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import R from 'ramda'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ZipPlugin from 'zip-webpack-plugin'

import pkg from './package.json'

const appNames = ['options', 'popup']
const commonChunkName = 'core'
const cssLoaderOptions = {
  esModule: true,
  modules: {
    localIdentName: '[local]_[hash:base64:5]',
  },
  importLoaders: 1,
}
const nodeEnv = process.env.NODE_ENV ?? 'development'
const outputDir = path.join('build', nodeEnv)
const sourceDir = 'src'

const defaultConfig: webpack.Configuration = {
  entry: appNames.reduce(
    (acc, appName) => ({
      ...acc,
      [appName]: `./${sourceDir}/${appName}`,
    }),
    {},
  ),
  mode: nodeEnv === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
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
          name: 'images/[name].[ext]',
        },
      },
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
    new webpack.ProgressPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}

const developmentConfig: webpack.Configuration = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: true,
            },
          },
          {
            loader: 'css-loader',
            options: cssLoaderOptions,
          },
          'postcss-loader',
        ],
      },
      {
        test: /\/icon.+\.(png|svg)$/,
        loader: 'image-process-loader',
        options: {
          greyscale: true,
        },
      },
    ],
  },
  watch: true,
}

const productionConfig: webpack.Configuration = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: cssLoaderOptions,
          },
          'postcss-loader',
        ],
      },
    ],
  },
  optimization: {
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
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join('..', 'report.html'),
    }),
    new MiniCssExtractPlugin({
      filename: path.join('css', '[name].css'),
    }),
    new ZipPlugin({
      filename: `${pkg.version}.zip`,
    }),
  ],
}

const getMergedConfigByEnv = R.converge(R.mergeDeepWith(R.concat), [
  R.prop('default'),
  R.propOr({}, nodeEnv),
])
export default getMergedConfigByEnv({
  default: defaultConfig,
  development: developmentConfig,
  production: productionConfig,
})
