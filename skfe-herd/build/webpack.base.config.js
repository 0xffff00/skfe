const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                less: ExtractTextPlugin.extract({
                  use: ['css-loader?minimize', 'postcss-loader', 'less-loader'],
                  fallback: 'vue-style-loader'
                }),
                css: ExtractTextPlugin.extract({
                  use: ['css-loader', 'postcss-loader', 'less-loader'],
                  fallback: 'vue-style-loader'
                })
              }
            }
          },
          {
            loader: 'iview-loader',
            options: {
              prefix: false
            }
          }
        ]
      },
      {
        test: /iview\/.*?js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize', 'postcss-loader'],
          fallback: 'style-loader'
        })
      },

      {
        test: /\.less/,
        use: ExtractTextPlugin.extract({
          use: ['postcss-loader', 'less-loader'],
          fallback: 'style-loader'
        })
      },

      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf|ico)\??.*$/,
        loader: 'url-loader?limit=1024'
      },
      {
        test: /\.(html|tpl)$/,
        loader: 'html-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [

    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    })
  ]
}
