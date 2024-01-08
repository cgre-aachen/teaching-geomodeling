// import * as d3 from 'd3';


// ************************************
// Create (x,y)-plot
// ************************************

const svg = d3.select("#bezierSpline");

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

// flag to link control points
let linkControlPoints = false;

document.getElementById('linkControlPoints').addEventListener('change', function() {
    linkControlPoints = this.checked;
});1

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
    { x: 0, y: 5, isEndPoint: true }, // Start at midpoint
    { x: 1, y: 7, isEndPoint: false }, // Control point at peak
    { x: 2, y: 7, isEndPoint: false }, // Control point at peak
    { x: 3, y: 5, isEndPoint: true },  // Midpoint, end of first and start of second curve
    { x: 4, y: 3, isEndPoint: false }, // Control point at trough
    { x: 5, y: 3, isEndPoint: false }, // Control point at trough
    { x: 6, y: 5, isEndPoint: true },  // Midpoint, end of second and start of third curve
    { x: 7, y: 7, isEndPoint: false }, // Control point at peak
    { x: 8, y: 7, isEndPoint: false }, // Control point at peak
    { x: 8, y: 5, isEndPoint: true }   // End at midpoint
];


function updateBezierCurve() {
    let path = d3.path();
    // Start at the first point
    path.moveTo(x(controlPoints[0].x), y(controlPoints[0].y));

    // Loop through control points in steps of 3, starting from the first control point of each curve
    for (let i = 1; i < controlPoints.length; i += 3) {
        path.bezierCurveTo(
            x(controlPoints[i].x), y(controlPoints[i].y),     // First control point
            x(controlPoints[i + 1].x), y(controlPoints[i + 1].y), // Second control point
            x(controlPoints[i + 2].x), y(controlPoints[i + 2].y)  // End point of the segment
        );
    }

    // Update or create the path element
    const pathSelection = g.selectAll('.bezier-path').data([null]);
    pathSelection.enter()
        .append('path')
        .merge(pathSelection)
        .attr('d', path.toString())
        .attr('class', 'bezier-path')
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 2);
}


function dragged(event, d) {
    // Translate the mouse coordinates to the group element
    const [newX, newY] = d3.pointer(event, g.node());

    // Update the dragged control point using the scales
    d.x = x.invert(newX);
    d.y = y.invert(newY);

    // If linking is enabled and the point is not an end point
    if (linkControlPoints && !d.isEndPoint) {
        // Determine the indices of the neighboring control points
        let prevIndex = (i - 1 >= 0) ? i - 1 : null;
        let nextIndex = (i + 1 < controlPoints.length) ? i + 1 : null;

        // Adjust the neighboring control points
        if (prevIndex !== null && controlPoints[prevIndex].isEndPoint) {
            // Calculate the mirrored position for the previous control point
            let dx = controlPoints[prevIndex].x - d.x;
            let dy = controlPoints[prevIndex].y - d.y;
            controlPoints[prevIndex].x -= dx;
            controlPoints[prevIndex].y -= dy;
        }
        if (nextIndex !== null && controlPoints[nextIndex].isEndPoint) {
            // Calculate the mirrored position for the next control point
            let dx = controlPoints[nextIndex].x - d.x;
            let dy = controlPoints[nextIndex].y - d.y;
            controlPoints[nextIndex].x -= dx;
            controlPoints[nextIndex].y -= dy;
        }
    }

    // Update the position of the circle and the curve
    d3.select(this).attr('cx', x(d.x)).attr('cy', y(d.y));
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
    .call(dragHandler); // Apply the drag behavior


// Initial drawing of the Bézier curve
updateBezierCurve();
