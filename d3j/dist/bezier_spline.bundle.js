/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./bezier_spline.js":
/*!**************************!*\
  !*** ./bezier_spline.js ***!
  \**************************/
/***/ (() => {

eval("// import * as d3 from 'd3';\n\n\n// ************************************\n// Create (x,y)-plot\n// ************************************\n\nconst svg = d3.select(\"#bezierSpline\");\n\nconst margin = { top: 40, right: 40, bottom: 60, left: 100 };\nconst viewBoxWidth = 1600;\nconst viewBoxHeight = 800;\nconst width = viewBoxWidth - margin.left - margin.right;\nconst height = viewBoxHeight - margin.top - margin.bottom;\n\nconst x = d3.scaleLinear().rangeRound([0, width]);\nconst y = d3.scaleLinear().rangeRound([height, 0]);\n\n\nconst g = svg.append(\"g\").attr(\"transform\", `translate(${margin.left},${margin.top})`);\n// Set domain limits\n\n// from data\n// x.domain(d3.extent(data, d => d.x));\n// y.domain(d3.extent(data, d => d.y));\n\n// manually\nx.domain([0, 10]);\ny.domain([0, 10]);\n\n// flag to link control points\nlet linkControlPoints = false;\n\ndocument.getElementById('linkControlPoints').addEventListener('change', function() {\n    linkControlPoints = this.checked;\n});1\n\n// Create the X and Y axes with class names for future reference\nconst xAxis = g.append(\"g\")\n    .attr(\"class\", \"x axis\")  // Assign class name\n    .attr(\"transform\", `translate(0,${height})`)\n    .call(d3.axisBottom(x));\n\nconst yAxis = g.append(\"g\")\n    .attr(\"class\", \"y axis\")  // Assign class name\n    .call(d3.axisLeft(y));\n\ng.selectAll(\".y.axis text\")\n    .style(\"font-size\", \"30px\");  // Update font size\n  \n\n    g.selectAll(\".x.axis text\")\n    .style(\"font-size\", \"30px\");  // Update font size\n\n\n// Gridlines\ng.append(\"g\")   \n    .attr(\"class\", \"grid\")\n    .attr(\"transform\", `translate(0,${height})`)\n    .call(d3.axisBottom(x)\n        .tickSize(-height)\n        .tickFormat(\"\"));\n\ng.append(\"g\")   \n    .attr(\"class\", \"grid\")\n    .call(d3.axisLeft(y)\n        .tickSize(-width)\n        .tickFormat(\"\"));\n\n// Initial control points for cubic Bézier curve\nlet controlPoints = [\n    { x: 0, y: 5, isEndPoint: true }, // Start at midpoint\n    { x: 1, y: 7, isEndPoint: false }, // Control point at peak\n    { x: 2, y: 7, isEndPoint: false }, // Control point at peak\n    { x: 3, y: 5, isEndPoint: true },  // Midpoint, end of first and start of second curve\n    { x: 4, y: 3, isEndPoint: false }, // Control point at trough\n    { x: 5, y: 3, isEndPoint: false }, // Control point at trough\n    { x: 6, y: 5, isEndPoint: true },  // Midpoint, end of second and start of third curve\n    { x: 7, y: 7, isEndPoint: false }, // Control point at peak\n    { x: 8, y: 7, isEndPoint: false }, // Control point at peak\n    { x: 8, y: 5, isEndPoint: true }   // End at midpoint\n];\n\n\nfunction updateBezierCurve() {\n    let path = d3.path();\n    // Start at the first point\n    path.moveTo(x(controlPoints[0].x), y(controlPoints[0].y));\n\n    // Loop through control points in steps of 3, starting from the first control point of each curve\n    for (let i = 1; i < controlPoints.length; i += 3) {\n        path.bezierCurveTo(\n            x(controlPoints[i].x), y(controlPoints[i].y),     // First control point\n            x(controlPoints[i + 1].x), y(controlPoints[i + 1].y), // Second control point\n            x(controlPoints[i + 2].x), y(controlPoints[i + 2].y)  // End point of the segment\n        );\n    }\n\n    // Update or create the path element\n    const pathSelection = g.selectAll('.bezier-path').data([null]);\n    pathSelection.enter()\n        .append('path')\n        .merge(pathSelection)\n        .attr('d', path.toString())\n        .attr('class', 'bezier-path')\n        .attr('fill', 'none')\n        .attr('stroke', 'orange')\n        .attr('stroke-width', 2);\n}\n\n\nfunction dragged(event, d) {\n    // Translate the mouse coordinates to the group element\n    const [newX, newY] = d3.pointer(event, g.node());\n\n    // Update the dragged control point using the scales\n    d.x = x.invert(newX);\n    d.y = y.invert(newY);\n\n    // If linking is enabled and the point is not an end point\n    if (linkControlPoints && !d.isEndPoint) {\n        // Determine the indices of the neighboring control points\n        let prevIndex = (i - 1 >= 0) ? i - 1 : null;\n        let nextIndex = (i + 1 < controlPoints.length) ? i + 1 : null;\n\n        // Adjust the neighboring control points\n        if (prevIndex !== null && controlPoints[prevIndex].isEndPoint) {\n            // Calculate the mirrored position for the previous control point\n            let dx = controlPoints[prevIndex].x - d.x;\n            let dy = controlPoints[prevIndex].y - d.y;\n            controlPoints[prevIndex].x -= dx;\n            controlPoints[prevIndex].y -= dy;\n        }\n        if (nextIndex !== null && controlPoints[nextIndex].isEndPoint) {\n            // Calculate the mirrored position for the next control point\n            let dx = controlPoints[nextIndex].x - d.x;\n            let dy = controlPoints[nextIndex].y - d.y;\n            controlPoints[nextIndex].x -= dx;\n            controlPoints[nextIndex].y -= dy;\n        }\n    }\n\n    // Update the position of the circle and the curve\n    d3.select(this).attr('cx', x(d.x)).attr('cy', y(d.y));\n    updateBezierCurve();\n}\n\n// Create draggable points\nconst dragHandler = d3.drag()\n    .on('drag', dragged);\n\n\n// Bind control points to circles and apply styles depending on the point type\ng.selectAll('.control-point')\n    .data(controlPoints)\n    .enter()\n    .append('circle')\n    .attr('class', 'control-point')\n    .attr('cx', d => x(d.x))\n    .attr('cy', d => y(d.y))\n    .attr('r', 15)\n    .style('fill', d => d.isEndPoint ? 'blue' : 'red')\n    .style('stroke', 'black')\n    .style('stroke-width', 1)\n    .call(dragHandler); // Apply the drag behavior\n\n\n// Initial drawing of the Bézier curve\nupdateBezierCurve();\n\n\n//# sourceURL=webpack://sgm_interpolations/./bezier_spline.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./bezier_spline.js"]();
/******/ 	
/******/ })()
;