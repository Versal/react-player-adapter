module.exports = {
  devtool: 'eval',
  resolve: {
    modulesDirectories: [
      'node_modules'
    ],
    extensions: [
      '',
      '.js',
      '.jsx'
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
      'sinon',
      'describe',
      'expect'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'jsx-loader?harmony'
      }
    ],
    postLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'jshint-loader'
      }
    ]
  }
};
