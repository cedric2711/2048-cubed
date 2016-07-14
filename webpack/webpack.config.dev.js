import { join } from 'path';
import webpack from 'webpack';
import { assign } from 'lodash';
import { PORT } from '../config/env';
import baseConfig from './webpack.config.base';

export default assign({}, baseConfig, {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack-hot-middleware/client?reload=true',
    join(__dirname, '../src')
  ],

  output: {
    path: join(__dirname, '../dist'),
    publicPath: `http://localhost:${PORT}/`,
    filename: `bundle.min.js`
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: true
    })
  ]
});
