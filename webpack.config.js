const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: ['./src/client'],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'build/main.js',
    publicPath: '/',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'src'), query: { stage: 0, plugins: [] }},
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap!autoprefixer?browsers=last 2 version') },
    ],
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
  plugins: [
    new ExtractTextPlugin('build/main.css', { allChunks: true }),
  ],
};

module.exports = config;
