const jsdom = require('jsdom');

process.env.NODE_ENV = 'test';

['.css', '.scss', '.png', '.jpg'].forEach(ext => {
  require.extensions[ext] = () => null;
});

require('babel-register')();

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
