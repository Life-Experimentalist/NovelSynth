const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.resolve(__dirname, "src/popup/popup.js"),
    content: path.resolve(__dirname, "src/content/content.js"),
    background: path.resolve(__dirname, "src/background.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/popup/popup.html"),
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "." },
        { from: "src/styles", to: "styles", noErrorOnMissing: true },
        { from: "src/content/content.css", to: "styles/content.css" },
        { from: "src/popup/popup.css", to: "styles/popup.css" },
        {
          from: "icons/*.png",
          to: "icons/[name][ext]",
        },
        {
          from: "icons/*.svg",
          to: "icons/[name][ext]",
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
