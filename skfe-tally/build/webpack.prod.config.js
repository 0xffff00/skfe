const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const DIST = path.join(__dirname, '../dist')
module.exports = merge(webpackBaseConfig, {
  entry: {
    main: './src/main',
    skfe: ['skfe-ui'],
    vendors: ['vue', 'vue-router'],
    appconf: ['./src/conf/app.conf.json']
    // vendors: './src/vendors'
  },
  output: {
    path: DIST,
    // publicPath: '/dist/',
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
    // new CopyWebpackPlugin([
    //   {from: path.join(__dirname, '../build/global-config.*.json'), to: DIST}
    // ]),
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
})
