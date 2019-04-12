const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CompressionPLugin = require('compression-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    app: './src/app.js'
  },
  devtool: isDevelopment && 'source-map',
  optimization: {
    minimize: false
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    open: true,
    before(_, server) {
      server._watch(`./src/**/*.handlebars`)
    }
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? './css/[name].css' : './css/[name]_[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id]_[hash].css'
    }),
    new HtmlWebpackPlugin({ 
      template: './src/index.handlebars',
      minify: !isDevelopment && {
        html5: true,
        collapseWhitespace: true,
        caseSensitive: true,
        removeComments: true
      }
    }),
    new HtmlBeautifyPlugin({
      config: {
        html: {
            end_with_newline: true,
            indent_size: 2,
            indent_with_tabs: true,
            indent_inner_html: true,
            preserve_newlines: true,
            unformatted: ['p', 'i', 'b', 'span']
        }
      },
      replace: [ ' type="text/javascript"' ]
    }),
    new CompressionPLugin({
      test: /\.(js|css|html|svg|json)$/
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            options: isDevelopment ? {} : {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 2 versions']
              },
              sourceMap: isDevelopment,
              plugins: () => [
                autoprefixer
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            } 
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
              useRelativePath: true
            }
          }
        ]
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDevelopment ? './js/[name].js' : './js/[name]_[hash].js'
  }
};