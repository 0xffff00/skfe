const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = [
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
    test: /app\.conf\.json$/,
    loader: 'json-loader'
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
    test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
    loader: 'url-loader?limit=1024'
  },
  {
    test: /\.(html|tpl)$/,
    loader: 'html-loader'
  }
]