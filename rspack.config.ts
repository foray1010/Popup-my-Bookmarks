import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { defineConfig } from '@rspack/cli'
import {
  CircularDependencyRspackPlugin,
  CopyRspackPlugin,
  CssExtractRspackPlugin,
  type LightningcssLoaderOptions,
  LightningCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPlugin,
  type SwcLoaderOptions,
  type WebpackPluginInstance,
} from '@rspack/core'
import browserslist from 'browserslist'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import HTMLInlineCSSWebpackPluginModule from 'html-inline-css-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { parse as parseJsonc } from 'jsonc-parser'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import sharp from 'sharp'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ZipPlugin from 'zip-webpack-plugin'

// eslint-disable-next-line import-x/extensions
import { manifest } from './manifest.ts'
import pkg from './package.json' with { type: 'json' }
// eslint-disable-next-line import-x/extensions
import { GenerateJsonPlugin } from './plugins/GenerateJsonPlugin.ts'

const HTMLInlineCSSWebpackPlugin =
  // @ts-expect-error Hack to import default module directly
  HTMLInlineCSSWebpackPluginModule.default as typeof HTMLInlineCSSWebpackPluginModule

const isCI = process.env['CI'] === 'true'
const isProductionBuild = process.env['NODE_ENV'] === 'production'
const isDevelopmentBuild = !isProductionBuild

const appNames = ['options', 'popup'] as const
const commonChunkName = 'common'
const outputDir = path.join('build', process.env['NODE_ENV'] || 'development')
const sourceDir = 'src'

const rspackConfig = defineConfig({
  devtool: isDevelopmentBuild ? 'inline-source-map' : false,
  entry: Object.fromEntries(
    appNames.map((appName) => [appName, `./${sourceDir}/${appName}/index.tsx`]),
  ),
  mode: isDevelopmentBuild ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.css$/u,
        type: 'javascript/auto',
        use: [
          CssExtractRspackPlugin.loader,
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
            loader: 'builtin:lightningcss-loader',
            options: {
              targets: browserslist(),
            } satisfies LightningcssLoaderOptions,
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
        loader: 'builtin:swc-loader',
        options: parseJsonc(
          await fs.readFile(path.join(import.meta.dirname, '.swcrc'), 'utf-8'),
        ) as SwcLoaderOptions,
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
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.svg$/u,
        resourceQuery: /svgUse/u,
        issuer: /\.tsx?$/u,
        type: 'javascript/auto',
        use: {
          loader: '@svg-use/webpack',
          options: {
            svgAssetFilename: 'images/[name].[ext]',
          },
        },
      },
      {
        test: /\.svg$/u,
        resourceQuery: { not: [/svgUse/u] },
        type: 'asset',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ],
  },
  optimization: {
    ...(isProductionBuild && {
      minimize: true,
      minimizer: [
        new SwcJsMinimizerRspackPlugin({
          minimizerOptions: {
            compress: {
              // arguments: true, // this breaks the build in webpack
              drop_console: true,
              reduce_vars: true,
            },
            ecma: 2020 as const,
            module: true,
          },
        }),
        new LightningCssMinimizerRspackPlugin({
          minimizerOptions: {
            targets: browserslist(),
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
    clean: true,
    path: path.resolve(import.meta.dirname, outputDir),
    filename: path.join('js', '[name].js'),
  },
  plugins: [
    new CircularDependencyRspackPlugin({
      failOnError: true,
      exclude: /node_modules/u,
    }),
    new DuplicatePackageCheckerPlugin({
      emitError: true,
      strict: true,
    }) as WebpackPluginInstance,
    new CopyRspackPlugin({
      patterns: [
        {
          context: sourceDir,
          from: 'public',
          ...(isDevelopmentBuild
            ? {
                transform: async (content, absoluteFrom) => {
                  const fileName = path.basename(absoluteFrom)

                  if (/^icon\d+\.png$/u.test(fileName)) {
                    return await sharp(content).greyscale().png().toBuffer()
                  }

                  return content
                },
              }
            : null),
        },
        {
          from: 'LICENSE',
        },
      ],
    }),
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
    new CssExtractRspackPlugin(),
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
    new GenerateJsonPlugin({
      json: manifest,
      filename: 'manifest.json',
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
    tsConfig: path.resolve(import.meta.dirname, './tsconfig.json'),
  },
  watch: isDevelopmentBuild,
})

export default rspackConfig
