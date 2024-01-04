const path = require('path');

module.exports = {
  entry: './script_interpolations.js',  // Your main JavaScript file
  output: {
    filename: 'bundle.js',  // The bundled output file
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  mode: 'development',  // Can be 'development' or 'production'
};

