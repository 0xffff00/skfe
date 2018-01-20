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

process.env.NODE_ENV = '"production"'
module.exports = merge(webpackBaseConfig, {
  entry: {
    main: './src/main',
    skfe: ['skfe-ui'],
    'vues': ['vue', 'vue-router', 'iview'],
    'comm1': ['axios', 'ramda']
  },
  output: {
    path: DIST,
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'skfe', chunks: ['main'], minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vues', chunks: ['main', 'skfe'], minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'comm1', chunks: ['main', 'skfe', 'vues'], minChunks: Infinity
    }),
    new CopyWebpackPlugin([
      {from: path.join(__dirname, '../src/conf/app.conf.js'), to: DIST}
    ]),
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index-p1.html',
      inject: true
    })
  ]
})
