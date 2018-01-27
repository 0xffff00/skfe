const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpackBaseConfig = require('./webpack.eg.base.config.js')

module.exports = merge(webpackBaseConfig, {
  // devtool: '#source-map',
  devtool: '#cheap-module-eval-source-map',
  node: {
    fs: 'empty'
  },
  devServer: {
    publicPath: '/',
    host: '0.0.0.0',
    port: 8931,
    historyApiFallback: true,
    inline: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.ENV0': JSON.stringify(process.env)
    }),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '../dist/eg/index.html'),
      template: path.join(__dirname, '../examples/index.html'),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})