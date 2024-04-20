const path = require('path');

module.exports = {
  entry: './background.js', // The entry point of your background script
  output: {
    path: path.resolve(__dirname, 'dist'), // The output directory for your bundled files
    filename: 'background.bundle.js', // The name of the bundled background script
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Use babel-loader for .js files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Preset used for env setup
          },
        },
      },
    ],
  },
  mode: 'production', // 'development' if you want the source maps
};