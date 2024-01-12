var RBF = require('rbf');

var points = [
  [0, 0],
  [0, 100]
];

// values could be vectors of any dimensionality.
// The computed interpolant function will return values or vectors accordingly.
var values = [
  0.0,
  1.0
]

// RBF accepts a distance function as a third parameter :
// either one of the following strings or a custom distance function (defaults to 'linear').
//
// - linear: r
// - cubic: r**3
// - quintic: r**5
// - thin-plate: r**2 * log(r)
// - gaussian: exp(-(r/epsilon) ** 2)
// - multiquadric: sqrt((r/epsilon) ** 2 + 1)
// - inverse-multiquadric: 1 / sqrt((r/epsilon) ** 2 + 1)
//
// epsilon can be provided as a 4th parameter. Defaults to the average 
// euclidean distance between points.
//
var rbf = RBF(points, values /*, distanceFunction, epsilon */);

console.log(rbf([0, 50])); // => 0.5
