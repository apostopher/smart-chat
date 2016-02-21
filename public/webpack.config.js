var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');

var config = {
  devtool: 'source-map',
  context: path.join(__dirname),
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.[chunkhash].js'
  },
  plugins: [
    new Clean(['dist']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 's'),
        loader: 'ng-annotate!babel?' + JSON.stringify({presets: ['es2015', 'stage-0']})
      },
      {test: /\.html$/, include: path.join(__dirname, 'src'), loader: 'raw'},
      {test: /\.css$/, include: path.join(__dirname, 'src'), loader: 'style!css'},
      {test: /\.scss$/, include: path.join(__dirname, 'src'), loader: 'style!css!sass'},
      {test: /\.(png|jpg|svg)$/, loader: 'url-loader?limit=8192'}
    ]
  },
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;