const path = require('path');

const config = {
  entry: ['./src/client'],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'build/main.js',
    publicPath: '/',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src'),
      query: {
        stage: 0,
        plugins: [],
      },
    }],
  },
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules',
    ],
    extensions: ['', '.js', '.jsx'],
  },
  devtool: 'eval',
  debug: true,
};

module.exports = config;
