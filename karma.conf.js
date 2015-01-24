'use strict';

// We need the webpack config so we can bundle the tests identically
var webpack = require('./webpack.config');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'node_modules/react/dist/react-with-addons.js',
      'tests/**/*_spec.js?(x)'
    ],
    preprocessors: {
      'tests/**/*_spec.js?(x)': ['webpack', 'sourcemap']
    },
    webpack: webpack,
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: false,
    browsers: ['Chrome']
  });
};
