const path = require('path')
const webpack = require('webpack')
const copyWebpackPlugin = require('copy-webpack-plugin')
const writeFilePlugin = require('write-file-webpack-plugin')
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')

let config = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json']
  },
  devServer: {
    noInfo: false
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.s[a|c]ss$/,
      loader: 'style!css!sass',
      query: {
        includePaths: [path.resolve(__dirname, 'node_modules')]
      }
    },
    {
      test: /\.woff(2)?(\?[a-z0-9]+)?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)(\?[a-z0-9]+)?$/,
      loader: "file-loader"
    },
    {
      test: /\.(png|jpg|gif|mp4)$/,
      use: [
        {
          loader: 'file-loader',
          options: {}
        }
      ]
    },
    {
      test: /\.(txt|vs|fs)$/,
      use: 'raw-loader'
    }]
  },
  plugins: [
    new copyWebpackPlugin([{ from: './src/assets/loops', to: 'assets/loops' }]),
    new copyWebpackPlugin([{ from: './src/assets/img', to: 'assets/img' }]),
    new copyWebpackPlugin([{ from: './src/assets/fonts', to: 'assets/fonts' }]),
    new copyWebpackPlugin([{ from: './src/shaders', to: 'assets/shaders' }]),
    new writeFilePlugin(),
    new ModernizrWebpackPlugin({
      'feature-detects': [
        'canvas'
      ]
    })
  ]
}

module.exports = config
