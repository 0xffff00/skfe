const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const webpackBaseConfig = require('./webpack.base.config.js')

module.exports = merge(webpackBaseConfig, {
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
  plugins: []
})
