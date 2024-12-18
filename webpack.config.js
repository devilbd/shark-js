const path = require('path');
// const { library } = require('webpack');

module.exports = {
  entry:  [
    './src/app/app-boot.ts'
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          esModule: true,
        },
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
  },
  output: {
    // filename: 'bundle.js',
    // path: path.resolve(__dirname, 'dist'),
    filename: 'shark.js',
    library: "sharkJS",
    path: path.resolve(__dirname, 'dist'),
  },
};