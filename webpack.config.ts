import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {EnvironmentPlugin} from 'webpack';

import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Webpack configuration for web app.
 */
const webConfig = {
  target: ['web', 'es6'],
  entry: './src/renderer.ts',
  mode: process.env.NODE_ENV || 'development',
  output: {
    filename: 'bundle-[contenthash].js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
  },
  resolve: {
    alias: {'@': path.resolve(__dirname, 'src/')},
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({template: './public/index.html'}),
    new CleanWebpackPlugin(),
    isDev && new ESLintWebpackPlugin({extensions: ['ts', 'tsx']}),
    new Dotenv(),
    new EnvironmentPlugin({
      DESKTOP: false,
      LOCAL_SERVER: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'babel-loader',
        options: {
          exclude: ['/node_modules/'],
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(ttf|png|jpg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
};

export default webConfig;
