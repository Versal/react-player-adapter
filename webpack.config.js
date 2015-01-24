module.exports = {
  devtool: 'inline-source-map',
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
  externals: {
    'react/addons': 'React'
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
      // pesky browsers
      'document',
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
