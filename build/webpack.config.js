const path = require('path');
const pkg = require('../package.json');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

let EnvConfig = null;
switch (process.env.NODE_ENV) {
  case "development": EnvConfig = pkg.devEnvConfig;
    break;
  case "test": EnvConfig = pkg.testEnvConfig;
    break;
  case "production": EnvConfig = pkg.proEnvConfig;
    break;
}

module.exports = {
  mode: process.env.NODE_ENV==="development" ? "development" : "production",
  context: path.join(__dirname, '../src'),
  entry: {
    vender: ['@babel/polyfill', 'react', 'react-dom'],
    // antdmobile: ['antd-mobile'],
    main: path.resolve(__dirname, "../src/main.js"),
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: EnvConfig.publicPath,
    filename: 'js/[name].[contenthash:7].js',
    chunkFilename: 'js/[name].[contenthash:7].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  devtool: process.env.NODE_ENV === 'production' ? "nosources-source-map" : "cheap-module-source-map",
  module: {
    rules: [
      // 处理 js、jsx
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  "targets": {
                    "chrome": "58",
                    "android": "4.1"
                  }
                }
              ],
              "@babel/preset-react"
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-syntax-dynamic-import",
              ["import", {"libraryName": "antd-mobile", "libraryDirectory": "lib", "style": "css" }, "antd-mobile"]
            ]
          }
        }
      },
      // 处理 less、css
      {
        test: /\.(less|css)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: process.env.NODE_ENV != 'production'
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: 'postcss',
              sourceMap:  process.env.NODE_ENV != 'production',
              plugins: (loader)=> [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-cssnext')(),
                require('cssnano')()
              ]
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: process.env.NODE_ENV != 'production'
            }
          },
        ]
      },
      // 处理图片
      {
        test: /\.(png|jpg|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: 'assets/img/[name].[contenthash:7].[ext]'
        }
      },
      // 处理视频，音频
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          fallback: 'file-loader',
          limit: 10000,
          name: 'assets/media/[name].[contenthash:7].[ext]',
        }
      },
      // 处理字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          fallback: 'file-loader',
          limit: 10000,
          name: 'assets/css/fonts/[name].[ext]',
        }
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: path.resolve(__dirname, "../dist")
    }),
    new HtmlWebpackPlugin({
      title: pkg.project.name,
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.html'),
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      // 类似 webpackOptions.output里面的配置 可以忽略
      filename: 'assets/css/[name].[contenthash:7].css',
      chunkFilename: 'assets/css/[name].[id].[contenthash:7].css',
    }),
    new CompressionPlugin({
      test: /\.(?:js|css)$/,
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8
    }),
  ],
  optimization: {
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,//最少被引用次数
          priority: -10//优先级更高(数字越大优先级越高)
        },
        common: {
          test: /[\\/]src[\\/]/,
          minChunks: 2,//非第三方公共模块(自己写的js),至少被引用两次
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
};
