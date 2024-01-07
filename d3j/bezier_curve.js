// import * as d3 from 'd3';


// ************************************
// Create (x,y)-plot
// ************************************

const svg = d3.select("#bezierPlot");

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

// Initial control points for cubic Bézier curve
let controlPoints = [
    { x: 2, y: 2, isEndPoint: true },
    { x: 3, y: 5, isEndPoint: false },
    { x: 7, y: 5, isEndPoint: false },
    { x: 8, y: 2, isEndPoint: true }
];


function updateBezierCurve() {
    // Compute the Bézier curve path
    let path = d3.path();
    path.moveTo(x(controlPoints[0].x), y(controlPoints[0].y));

    path.bezierCurveTo(
        x(controlPoints[1].x), y(controlPoints[1].y),
        x(controlPoints[2].x), y(controlPoints[2].y),
        x(controlPoints[3].x), y(controlPoints[3].y)
    );

    // Select the path element, if it exists
    const pathSelection = g.selectAll('.bezier-path').data([null]);

    // Update or create the path element
    pathSelection.enter()
        .append('path')
        .merge(pathSelection)
        .attr('d', path.toString())
        .attr('class', 'bezier-path')
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 3);
}


// Function to drag control points
function dragged(event, d) {
    const [newX, newY] = d3.pointer(event, this);

    // Update the point's position using the x and y scales
    d.x = x.invert(newX);
    d.y = y.invert(newY);

    // Update the position of the circle
    d3.select(this)
        .attr('cx', x(d.x))
        .attr('cy', y(d.y));

    // Update the Bézier curve
    updateBezierCurve();
}


// Create draggable points
const dragHandler = d3.drag()
    .on('drag', dragged);

// Bind control points to circles and apply styles depending on the point type
g.selectAll('.control-point')
    .data(controlPoints)
    .enter()
    .append('circle')
    .attr('class', 'control-point')
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('r', 15)
    .style('fill', d => d.isEndPoint ? 'blue' : 'red')
    .style('stroke', 'black')
    .style('stroke-width', 1)
    .call(dragHandler);

// Initial drawing of the Bézier curve
updateBezierCurve();
