module.exports = {
  devtool: 'eval',
  resolve: {
    modulesDirectories: [
      'bower_components',
      'node_modules'
    ],
    extensions: [
      '',
      '.js',
      '.jsx'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|bower_components/,
        loaders: ['jshint', 'jsx-loader?harmony']
      }
    ]
  },
  jshint: {
    node: true,
    boss: true,
    curly: true,
    devel: true,
    eqnull: true,
    expr: true,
    funcscope: true,
    globalstrict: true,
    loopfunc: true,
    newcap: false,
    noempty: true,
    nonstandard: true,
    sub: true,
    undef: true,
    unused: 'vars',
    esnext: true,
    predef: [
      // testing tools
      'it',
      'before',
      'beforeEach',
      'after',
      'afterEach',
      'sinon',
      'describe',
      'expect'
    ]
  }
};
