const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",

  entry: {
    main: ["@babel/polyfill", "./src/script.js"],
  },

  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "public"),
  },

  devServer: {
    port: 3000,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/static"),
          to: path.resolve(__dirname, "public"),
        },
      ],
    }),
  ],

  module: {
    rules: [
      //Стили
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      //JS
      {
        test: /\.m?js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      //Файлы
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};
