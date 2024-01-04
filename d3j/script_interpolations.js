import { PolynomialRegressor } from '@rainij/polynomial-regression-js';

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
const seed = 12345;  // Change this value for different results
const random = seededPRNG(seed);

// Generate 10 random x,y-pairs
const data = Array.from({ length: 10 }, () => ({
    x: random() * 10,  // Assuming you want x and y values in the range [10, 10]
    y: random() * 10
}));

console.log(data);

// ************************************
// Create (x,y)-plot
// ************************************

const svg = d3.select("#plotArea");
const margin = {top: 20, right: 20, bottom: 30, left: 50};
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;
const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// Scales
const x = d3.scaleLinear().rangeRound([0, width]);
const y = d3.scaleLinear().rangeRound([height, 0]);
x.domain(d3.extent(data, d => d.x));
y.domain(d3.extent(data, d => d.y));

// Axes
const xAxis = g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

const yAxis = g.append("g")
    .call(d3.axisLeft(y));

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
    // Update interpolation and redraw curve here, if necessary
}

// Apply drag behavior to the points
g.selectAll(".dot")
.data(data)
.enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 5)
        .call(d3.drag().on("drag", dragged));


// ************************************
// Perform polynomial regression
// ************************************

// Assuming 'data' is your array of {x, y} objects
// And assuming x and y scales (d3.scaleLinear()) and an SVG group 'g' are already set up

// Define the degree of the polynomial
const degree = 5;  // Change this to try different degrees

// Prepare data for the library
const xs = data.map(d => [d.x]);  // The fit method expects an array of arrays
const ys = data.map(d => [d.y]);  // y values also as an array of arrays

// Create the polynomial regression model
const model = new PolynomialRegressor(degree);
model.fit(xs, ys);  // Fit the model to the data

// Generate points for the curve
const curvePoints = [];
for (let i = x.domain()[0]; i <= x.domain()[1]; i += (x.domain()[1] - x.domain()[0]) / 100) {
    curvePoints.push({ x: i, y: model.predict([[i]])[0] });
}

// Create a line generator function
const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

// Create the line SVG element
g.append("path")
    .datum(curvePoints)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr("d", line);


