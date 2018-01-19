const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpackBaseConfig = require('./webpack.base.config.js')

module.exports = merge(webpackBaseConfig, {
  // 入口
  entry: {
    main: './src/main',
    skfe: ['skfe-ui'],
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
    port: 8941,
    historyApiFallback: true,
    inline: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.ENV0': JSON.stringify(process.env)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['comm1', 'skfe', 'vendors'],
      minChunks: 3 // Infinity
      // filename: 'vendors.js'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
