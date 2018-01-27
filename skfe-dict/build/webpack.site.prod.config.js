const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.site.base.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

process.env.NODE_ENV = '"production"'
module.exports = merge(webpackBaseConfig, {
  output: {
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '../'), verbose: true, dry: false
    }),
    new webpack.DefinePlugin({
      'process.ENV0': JSON.stringify(process.env)
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/conf/app.conf.js'),
        to: path.join(__dirname, '../dist')
      }
    ]),
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index-p1.html',
      inject: true
    })
  ]
})
