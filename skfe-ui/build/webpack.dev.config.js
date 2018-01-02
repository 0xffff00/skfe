const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpackBaseConfig = require('./webpack.base.config.js')

const globalConfig = require('./conf-util.js').fetchConfigByMergingEnvArgs({env: 'dev', args: process.env})

module.exports = merge(webpackBaseConfig, {
  // 入口
  entry: {
    main: './examples/main',
    vendors: ['vue', 'vue-router']
  },
  // 输出
  output: {
    path: path.join(__dirname, '../examples/dist'),
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  // devtool: '#source-map',
  devtool: '#cheap-module-eval-source-map',
  node: {
    fs: 'empty'
  },
  devServer: {
    port: globalConfig.port
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'GLOBAL_CONFIG': JSON.stringify(globalConfig)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.js'
    }),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '../examples/dist/index.html'),
      // template: './src/assets/index.ejs',
      template: path.join(__dirname, '../examples/index.html'),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
