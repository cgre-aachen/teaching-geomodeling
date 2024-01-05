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
const seed = 12312;  // Change this value for different results
const random = seededPRNG(seed);

// Generate 10 random x,y-pairs
const data = Array.from({ length: 10 }, () => ({
    x: random() * 5 + 2.5,  // Assuming you want x and y values in the range [10, 10]
    y: random() * 5 + 2.5
}));

console.log(data);

// ************************************
// Create (x,y)-plot
// ************************************

const svg = d3.select("#plotArea");

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
// Slider
// **************************

// Select the slider and degree display elements
const slider = document.getElementById('degreeSlider');
const degreeDisplay = document.getElementById('degreeValue');

let degree = parseInt(slider.value);  // Initial degree from the slider


// **************************
// Regression function
// **************************

// Assuming 'data' is your array of {x, y} objects
// And assuming x and y scales (d3.scaleLinear()) and an SVG group 'g' are already set up


// Function to fit the polynomial regression and draw the curve
function updateRegressionCurve() {
    // Prepare data for the library
    const xs = data.map(d => [d.x]);
    const ys = data.map(d => [d.y]);

    // Create the polynomial regression model
    // const degree = 9;  // Adjust degree as necessary
    const model = new PolynomialRegressor(degree);
    model.fit(xs, ys);  // Fit the model to the data

    // Generate points for the curve
    const curvePoints = [];
    for (let i = x.domain()[0]; i <= x.domain()[1]; i += (x.domain()[1] - x.domain()[0]) / 100) {
        curvePoints.push({ x: i, y: model.predict([[i]])[0][0] });
    }

    // Draw the curve (or update if already drawn)
    const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));

    const path = g.selectAll('.regression-curve')
        .data([curvePoints]);  // Bind the new curve data

    path.enter().append('path')
        .attr('class', 'regression-curve')
        .merge(path)
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .attr('d', line);
}

// Initial drawing of the curve
updateRegressionCurve();

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

    // Update the regression curve after dragging a point
    updateRegressionCurve();
}

// Event listener for the slider
slider.addEventListener('input', function() {
    degree = parseInt(this.value);  // Update the degree
    degreeDisplay.textContent = degree;  // Update the displayed degree value
    updateRegressionCurve();  // Update the regression curve
});

// Apply drag behavior to the points
g.selectAll(".dot")
.data(data)
.enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 10)
        .call(d3.drag().on("drag", dragged));


