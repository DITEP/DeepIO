const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Get all js files and turn modern javascript functions into older ones for backwards compability
// Bundle all files in dist folder in order to reduce resource load at each request

module.exports = {
  entry: "./src/index.js", //relative to root of the application
    output : {
      filename : './index.js',
      publicPath: '/'
    },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test    : /\.(jpg|png)$/,
        loader  : 'url-loader?limit=25000'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
        template: "./src/index.html",
        filename: './index.html'
    })
  ]
}