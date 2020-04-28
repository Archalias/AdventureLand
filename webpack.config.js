const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    interface: "./scripts/interface/interface", // string | object | array
    main: "./scripts/main" // string | object | array
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
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "[name].bundle.js", // string
    // the filename template for entry chunks0
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