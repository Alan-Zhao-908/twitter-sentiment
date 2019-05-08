const webpack = require('webpack');
const path = require('path');

console.log(__dirname)

module.exports = {
  context: __dirname + '/client',
  entry: './index.jsx',
  module: {
    loaders: [
      {
        test: [/\.js$/, /\.jsx?$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'env']
        },
      },
    ],
  },
  output: {
    path: __dirname + '/public',
    filename: 'app.js',
  }
};