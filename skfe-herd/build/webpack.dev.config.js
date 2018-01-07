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
    main: './src/main',
    skfe: ['skfe-ui', 'skfe-dict'],
    vendors: ['vue', 'vue-router']
    // vendors: './src/vendors'
  },
  // 输出
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  // devtool: '#source-map',
  devtool: '#cheap-module-eval-source-map',
  node: {
    fs: 'empty'
  },
  devServer: {
    publicPath: '/',
    port: globalConfig.port,
    historyApiFallback: true,
    inline: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'GLOBAL_CONFIG': JSON.stringify(globalConfig)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['comm1', 'skfe', 'vendors'],
      minChunks: 3 // Infinity
      // filename: 'vendors.js'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../index.html'),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
