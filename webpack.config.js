const path = require('path');
const { library } = require('webpack');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    // filename: 'bundle.js',
    // path: path.resolve(__dirname, 'dist'),
    filename: 'shark.js',
    library: "sharkJS",
    path: path.resolve(__dirname, 'dist'),
  },
};