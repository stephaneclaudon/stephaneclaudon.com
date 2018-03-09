const path = require('path')
const webpack = require('webpack')

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
    }]
  }
}

module.exports = config
