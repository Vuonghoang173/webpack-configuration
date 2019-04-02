const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    app: './src/app.js'
  },
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    before(_, server) {
      server._watch(`./src/*.html`)
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].bundle.css' : '[name].bundle.[hash].css',
      chunkFilename: devMode ? '[id].bundle.css' : '[id].bundle.[hash].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader?sourceMap',
          'postcss-loader?sourceMap',
          'sass-loader?sourceMap'
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
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: devMode ? '[name].bundle.js' : '[name].bundle.[hash].js'
  }
};