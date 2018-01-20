const path = require('path')
const webpack = require('webpack')
const rules = require('./rules.config.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  module: {
    rules: rules
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  },
  // 入口
  entry: {
    main: './src/main',
    comm1: ['axios', 'ramda', 'moment'],
    vue2: ['vue', 'vue-router'],
    ivu2: ['iview']
  },
  // 输出
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.ENV0': JSON.stringify(process.env)
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'skfe', chunks: ['main'], minChunks: Infinity
    // }),
    //
    new webpack.optimize.CommonsChunkPlugin({
      names: ['comm1'], chunks: ['main', 'vue2', 'ivu2']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'ivu2', chunks: ['main']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vue2', chunks: ['ivu2']
    }),

    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    })
  ]
}
