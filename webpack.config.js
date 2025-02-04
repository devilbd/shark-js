const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// const { library } = require('webpack');

module.exports = {
  mode: 'development',
  entry: [
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
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       defaultVendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         minChunks: 2,
  //         maxInitialRequests: 5,
  //         priority: -10,
  //         reuseExistingChunk: true,
  //       },
  //       default: {
  //         minChunks: 2,
  //         maxInitialRequests: 5,
  //         priority: -20,
  //         reuseExistingChunk: true,
  //       },
  //     },
  //   },
  // },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['json', 'typescript', 'html', 'scss']
    }),
    // new CompressionPlugin({
    //   algorithm: 'gzip',
    // })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.css'],
  },
  output: {
    // filename: 'bundle.js',
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'shark.[contenthash].js',
    filename: 'shark.js',
    library: "sharkJS",
    path: path.resolve(__dirname, 'dist'),
  }  
};