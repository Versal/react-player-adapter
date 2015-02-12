'use strict';

// We need the webpack config so we can bundle the tests identically
var webpack = require('./webpack.config');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'spec.jsx'
    ],
    preprocessors: {
      'spec.jsx': ['webpack']
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
