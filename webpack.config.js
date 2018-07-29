const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./src/js/index.js"], // ["babel-polyfill", "./src/js/index.js"] use polyfill for things that are not in older versions
  output: {
    // must be an absolute address
    path: path.resolve(__dirname, "dist"),
    // the target directory for all output files
    filename: "js/bundle.js"
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html" // this copies the html file to the dist folder
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },

      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },

      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: [
          { loader: "file-loader" }
        ]
      },

      {
        test: /\.html$/,
        use: [
          { loader: "html-loader" }
        ]
      }

    ]
  }
};
