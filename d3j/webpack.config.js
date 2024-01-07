const path = require('path');

module.exports = {
  mode: 'development', // 'production' or 'none'
  entry: {
    script_interpolations: './script_interpolations.js',
    spline_interpolation: './spline_interpolation.js',
    modal: './modal.js'
    // Add more entry points if needed
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Other configuration like loaders, plugins, etc.
};

