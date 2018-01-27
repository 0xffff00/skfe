const webpack = require('webpack')
const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const rules = require('./rules.config.js')
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
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'skfe-ui.js',
    library: 'skfe-ui',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    })
  ]
}
