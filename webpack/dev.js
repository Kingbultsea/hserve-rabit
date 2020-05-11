const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, '../src/serve-1.0.1.ts'),
  mode: 'development',
  target: 'node',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
    })
  ],
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      { exclude: /node_modules/, test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}
