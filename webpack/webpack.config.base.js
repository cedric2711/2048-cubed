import { join } from 'path';

export default {
  debug: true,
  noInfo: true,
  target: 'web',

  module: {
    loaders: [
      { test: /(\.js)$/, include: join(__dirname, '../src'), loaders: ['babel'] }
    ]
  }
};
