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
    main: path.join(__dirname, '../examples/main'),
    vue2: ['vue', 'vue-router']
  },
  // 输出
  output: {
    path: path.join(__dirname, '../dist/eg'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vue2', chunks: ['main']
    }),

    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    })
  ]
}
