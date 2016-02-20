'use strict';
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x)=> {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod)=> {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  node: {
    __filename: true,
    __dirname: true
  },
  target: 'node',
  externals: nodeModules,
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
    new webpack.BannerPlugin('require("source-map-support").install();', {raw: true, entryOnly: false})
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loaders: ['babel']
      },
      {
        test: /\.json$/,
        include: path.join(__dirname, 'src'),
        loaders: ['json']
      }
    ]
  }
};
