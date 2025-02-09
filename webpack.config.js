const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: [
    './src/app/app-boot.ts'
  ],
  // devtool: 'inline-source-map',
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
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          esModule: true,
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
        type: 'asset/resource',
      }
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          mangle: true,
          module: true,
        },
      }),
    ],
  },
  plugins: [],
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.css'],
  },
  output: {
    filename: 'shark.js',
    library: "sharkJS",
    path: path.resolve(__dirname, 'dist'),
  }  
};