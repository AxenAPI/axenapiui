import Dotenv from 'dotenv-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {EnvironmentPlugin} from 'webpack';

export const plugins = [
  new ForkTsCheckerWebpackPlugin({logger: 'webpack-infrastructure'}),
  new Dotenv(),
  new EnvironmentPlugin({
    LOCAL_SERVER: false,
    DESKTOP: true,
  }),
];
