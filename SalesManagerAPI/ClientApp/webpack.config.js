require('webpack-dev-server');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000', 10);

const mode = process.env.NODE_ENV || 'development';
const isEnvProduction = mode === 'production';
const isEnvDevelopment = !isEnvProduction;
const publicPath = '/';

/**
 * @type {webpack.Configuration}
 */
const config = {
  mode,

  entry: path.resolve(__dirname, 'src', 'index.ts'),

  output: {
    publicPath,
    path: path.resolve(__dirname, 'build'),
    chunkFilename: 'static/js/[id].[contenthash].js',
    filename: 'static/js/main.[contenthash].js',
  },

  devtool: isEnvDevelopment ? 'source-map' : false,

  optimization: {
    minimize: isEnvProduction,

    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },

  module: {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: imageInlineSizeLimit,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
            include: [path.resolve(__dirname, 'src')],
            exclude: [/node_modules/],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      '@material-ui/styles': path.resolve(__dirname, 'node_modules', '@material-ui/styles'),
      '@material-ui/core': path.resolve(__dirname, 'node_modules', '@material-ui/core'),
      '@material-ui/icons': path.resolve(__dirname, 'node_modules', '@material-ui/icons'),
    },
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      PUBLIC_PATH: JSON.stringify(publicPath),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          filter: (resourcePath) => !resourcePath.endsWith('index.html'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public', 'index.html'),
      ...(isEnvProduction
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : {}),
    }),
    // new FaviconsWebpackPlugin({
    //     logo: path.resolve(__dirname, 'src', 'favicon', 'favicon.png'),
    // }),
  ].concat(process.env.ANALYZE ? new BundleAnalyzerPlugin() : []),
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    contentBasePublicPath: publicPath,
    port: parseInt(process.env.PORT, 10) || 3000,
    disableHostCheck: true,
    allowedHosts: ['http://host.docker.internal'],
    historyApiFallback: {
      disableDotRule: true,
      index: publicPath,
    },
    hot: false,
    // open: true,
    publicPath,
    // proxy: {
    //     [`${publicPath}api`]: {
    //         target: handlers.api[SM_ENV],
    //         secure: false,
    //         changeOrigin: true,
    //         pathRewrite: (p) => {
    //             return p.replace(`${publicPath}`, '/');
    //         },
    //         logLevel: 'debug',
    //     },
    //     [`${publicPath}api/v0/back-office`]: {
    //         target: handlers.backoffice[SM_ENV],
    //         secure: false,
    //         changeOrigin: true,
    //         pathRewrite: (p) => {
    //             return p.replace(`${publicPath}`, '/');
    //         },
    //         logLevel: 'debug',
    //     },
    //     '/keymaster': {
    //         target: handlers.keymaster[SM_ENV],
    //         changeOrigin: true,
    //         secure: false,
    //         logLevel: 'debug',
    //     },
    // },
  },
};

module.exports = config;
