const path = require('path')
const webpack = require('webpack')
const copyWebpackPlugin = require('copy-webpack-plugin')
const writeFilePlugin = require('write-file-webpack-plugin')

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
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {}
        }
      ]
    }]
  },
  plugins: [
    new copyWebpackPlugin([{ from: './src/assets/img', to: 'assets/img' }]),
    new writeFilePlugin()
  ]
}

module.exports = config
