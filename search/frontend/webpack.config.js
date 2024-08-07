const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src/assets/images',
              outputPath: 'images',
              publicPath: '/dist/images',
            },
          },
        ],
      }
    ]
  },
  resolve: {
    fallback: {
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "console": require.resolve("console-browserify"),
      "constants": require.resolve("constants-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "domain": require.resolve("domain-browser"),
      "events": require.resolve("events/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "punycode": require.resolve("punycode/"),
      "process": require.resolve("process/browser"),
      "querystring": require.resolve("querystring-es3"),
      "stream": require.resolve("stream-browserify"),
      "string_decoder": require.resolve("string_decoder/"),
      "sys": require.resolve("util/"),
      "timers": require.resolve("timers-browserify"),
      "tty": require.resolve("tty-browserify"),
      "url": require.resolve("url/"),
      "util": require.resolve("util/"),
      "vm": require.resolve("vm-browserify"),
      "zlib": require.resolve("browserify-zlib")
    },
    alias: {
      "timers/promises": path.resolve(__dirname, "timers-promises-mock.js")
    }
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, '');
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^http2$/
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^async_hooks$/
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^net$/
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^tls$/
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^diagnostics_channel$/
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^util\/types$/
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^perf_hooks$/
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^worker_threads$/
    }),
    new webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '.')
    }),
    new Dotenv()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    historyApiFallback: true,
  }
};
