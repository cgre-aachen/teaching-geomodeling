// import { PolynomialRegressor } from '@rainij/polynomial-regression-js';


import Spline from 'cubic-spline';

const RBF = require('rbf');

const points = [
    [0, 0],
    [0, 100]
  ];
  
  // values could be vectors of any dimensionality.
  // The computed interpolant function will return values or vectors accordingly.
  const values = [
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

// Sample Data
// const data = [{x: 10, y: 20}, {x: 20, y: 40}]; //, ...];  // Replace with your data

// ************************************
// Create random points
// ************************************

function seededPRNG(seed) {
    return function() {
        seed = seed * 16807 % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

// Set the seed for reproducibility
const seed = 12315;  // Change this value for different results
const random = seededPRNG(seed);

// Generate 10 random x,y-pairs
const data = Array.from({ length: 10 }, () => ({
    x: random() * 8 + 1,  // Assuming you want x and y values in the range [10, 10]
    y: random() * 2 + 4
}));

console.log(data);

// ************************************
// Create (x,y)-plot
// ************************************

const svg = d3.select("#rbfPlot");

const margin = { top: 40, right: 40, bottom: 60, left: 100 };
const viewBoxWidth = 1600;
const viewBoxHeight = 800;
const width = viewBoxWidth - margin.left - margin.right;
const height = viewBoxHeight - margin.top - margin.bottom;

const x = d3.scaleLinear().rangeRound([0, width]);
const y = d3.scaleLinear().rangeRound([height, 0]);



const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
// Set domain limits

// from data
// x.domain(d3.extent(data, d => d.x));
// y.domain(d3.extent(data, d => d.y));

// manually
x.domain([0, 10]);
y.domain([0, 10]);

// Create the X and Y axes with class names for future reference
const xAxis = g.append("g")
    .attr("class", "x axis")  // Assign class name
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

const yAxis = g.append("g")
    .attr("class", "y axis")  // Assign class name
    .call(d3.axisLeft(y));

g.selectAll(".y.axis text")
    .style("font-size", "30px");  // Update font size
  

    g.selectAll(".x.axis text")
    .style("font-size", "30px");  // Update font size


// Gridlines
g.append("g")   
    .attr("class", "grid")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat(""));

g.append("g")   
    .attr("class", "grid")
    .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(""));



// **************************
// RBF function
// **************************

// Function to update spline curve
function updateRBF() {
    // Sort the data by x-values
    data.sort((a, b) => a.x - b.x);

    // Extract sorted xs and ys
    const xs = data.map(d => d.x);
    const ys = data.map(d => d.y);

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

    // create RBF function
    var rbf = RBF(xs, ys, 'multiquadric', .5 /*, distanceFunction, epsilon */);

    // Generate points for the curve at a higher resolution
    const curvePoints = [];
    const start = x.domain()[0];
    const end = x.domain()[1];
    const step = (end - start) / 500;  // Adjust the number of points for smoothness

    for (let i = start; i <= end; i += step) {
        curvePoints.push({ x: i, y: rbf(i) });
    }
    // Draw the curve (or update if already drawn)
    const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));

    const path = g.selectAll('.spline-curve')
        .data([curvePoints]);  // Bind the new curve data

    path.enter().append('path')
        .attr('class', 'spline-curve')
        .merge(path)
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .attr('d', line);
}


// Initial drawing of the curve
updateRBF();

// ************************************
// Drag points
// ************************************

// Drag event handler
function dragged(event, d) {
    const [newX, newY] = d3.pointer(event, this);  // Get the correct coordinates

    d.x = x.invert(newX);  // Convert from screen to data coordinates
    d.y = y.invert(newY);  // Convert from screen to data coordinates

    d3.select(this)
    .attr('cx', x(d.x))  // Update the position using the data scale
    .attr('cy', y(d.y));

    // Update the spline curve after dragging a point
    updateRBF();
}

// Apply drag behavior to the points
g.selectAll(".dot")
.data(data)
.enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 10)
        .call(d3.drag().on("drag", dragged));


