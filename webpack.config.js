const path = require('path');

module.exports = {
  entry: './src/serve-1.0.1.ts',
  target: 'node',
  output: {
    globalObject: 'this',
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  node: {
    fs: 'empty'
  },
  module: {
      rules: [
        { exclude: /node_modules/, test: /\.ts$/, loader: 'ts-loader' }
      ]
  }
}
