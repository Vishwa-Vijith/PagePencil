const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    "content-script/content": "./src/content-script/content.js",
    "popup/scripts/popup": "./src/popup/scripts/popup.js",
    "popup/scripts/popup": "./src/popup/scripts/search-note.js",
    "service-worker/background": "./src/service-worker/background.js",
    "shared-scripts/scripts/add-note/addNote-event-handler":
      "./src/shared-scripts/scripts/add-note/addNote-event-handler.js",
    "shared-scripts/scripts/display-note/display-note":
      "./src/shared-scripts/scripts/display-note/display-note.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    usedExports: false,
    minimize: false,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src",
          to: "[path][name][ext]",
          globOptions: {
            ignore: [
              "**/content-script/content.js",
              "**/popup/scripts/popup.js",
              "**/service-worker/background.js",
              "**/shared-scripts/scripts/add-note/addNote-event-handler.js",
            ],
          },
        },
        {
          from: "public/manifest.json",
          to: "manifest.json",
        },
        {
          from: "public/icons",
          to: "icons",
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", 
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], 
      },
      {
        test: /\.html$/,
        use: ["html-loader"], 
      },
    ],
  },
  resolve: {
    extensions: [".js", ".css", ".html"],
  },
};