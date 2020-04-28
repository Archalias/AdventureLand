const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    'farm.metrics': "./scripts/interface/farmMetrics",
    'inventory.enhancements': "./scripts/interface/inventoryEnhancements"
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          keep_classnames: false,
          keep_fnames: false
        },
        extractComments: false
      })
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ]
  }
};