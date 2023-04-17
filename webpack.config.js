const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = (nodeEnv === 'production');

module.exports = {
  mode: nodeEnv,
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress:{
            drop_console: true,
          }
        }
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'h5peditor-boilerplate.css'
    })
  ],
  entry: {
    dist: './src/entries/h5peditor-boilerplate.js'
  },
  output: {
    filename: 'h5peditor-boilerplate.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env','@babel/preset-react'] }
      },
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        include: path.join(__dirname, 'src/images'),
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        include: path.join(__dirname, 'src/fonts'),
        type: 'asset/resource'
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: (isProd) ? undefined : 'eval-cheap-module-source-map'
};
