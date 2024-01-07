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

/***/ "./bezier_curve.js":
/*!*************************!*\
  !*** ./bezier_curve.js ***!
  \*************************/
/***/ (() => {

eval("// import * as d3 from 'd3';\n\n\n// ************************************\n// Create (x,y)-plot\n// ************************************\n\nconst svg = d3.select(\"#bezierPlot\");\n\nconst margin = { top: 40, right: 40, bottom: 60, left: 100 };\nconst viewBoxWidth = 1600;\nconst viewBoxHeight = 800;\nconst width = viewBoxWidth - margin.left - margin.right;\nconst height = viewBoxHeight - margin.top - margin.bottom;\n\nconst x = d3.scaleLinear().rangeRound([0, width]);\nconst y = d3.scaleLinear().rangeRound([height, 0]);\n\n\nconst g = svg.append(\"g\").attr(\"transform\", `translate(${margin.left},${margin.top})`);\n// Set domain limits\n\n// from data\n// x.domain(d3.extent(data, d => d.x));\n// y.domain(d3.extent(data, d => d.y));\n\n// manually\nx.domain([0, 10]);\ny.domain([0, 10]);\n\n// Create the X and Y axes with class names for future reference\nconst xAxis = g.append(\"g\")\n    .attr(\"class\", \"x axis\")  // Assign class name\n    .attr(\"transform\", `translate(0,${height})`)\n    .call(d3.axisBottom(x));\n\nconst yAxis = g.append(\"g\")\n    .attr(\"class\", \"y axis\")  // Assign class name\n    .call(d3.axisLeft(y));\n\ng.selectAll(\".y.axis text\")\n    .style(\"font-size\", \"30px\");  // Update font size\n  \n\n    g.selectAll(\".x.axis text\")\n    .style(\"font-size\", \"30px\");  // Update font size\n\n\n// Gridlines\ng.append(\"g\")   \n    .attr(\"class\", \"grid\")\n    .attr(\"transform\", `translate(0,${height})`)\n    .call(d3.axisBottom(x)\n        .tickSize(-height)\n        .tickFormat(\"\"));\n\ng.append(\"g\")   \n    .attr(\"class\", \"grid\")\n    .call(d3.axisLeft(y)\n        .tickSize(-width)\n        .tickFormat(\"\"));\n\n// Initial control points for cubic Bézier curve\nlet controlPoints = [\n    { x: 2, y: 2, isEndPoint: true },\n    { x: 3, y: 5, isEndPoint: false },\n    { x: 7, y: 5, isEndPoint: false },\n    { x: 8, y: 2, isEndPoint: true }\n];\n\n\nfunction updateBezierCurve() {\n    // Compute the Bézier curve path\n    let path = d3.path();\n    path.moveTo(x(controlPoints[0].x), y(controlPoints[0].y));\n\n    path.bezierCurveTo(\n        x(controlPoints[1].x), y(controlPoints[1].y),\n        x(controlPoints[2].x), y(controlPoints[2].y),\n        x(controlPoints[3].x), y(controlPoints[3].y)\n    );\n\n    // Select the path element, if it exists\n    const pathSelection = g.selectAll('.bezier-path').data([null]);\n\n    // Update or create the path element\n    pathSelection.enter()\n        .append('path')\n        .merge(pathSelection)\n        .attr('d', path.toString())\n        .attr('class', 'bezier-path')\n        .attr('fill', 'none')\n        .attr('stroke', 'orange')\n        .attr('stroke-width', 3);\n}\n\n\n// Function to drag control points\nfunction dragged(event, d) {\n    const [newX, newY] = d3.pointer(event, this);\n\n    // Update the point's position using the x and y scales\n    d.x = x.invert(newX);\n    d.y = y.invert(newY);\n\n    // Update the position of the circle\n    d3.select(this)\n        .attr('cx', x(d.x))\n        .attr('cy', y(d.y));\n\n    // Update the Bézier curve\n    updateBezierCurve();\n}\n\n\n// Create draggable points\nconst dragHandler = d3.drag()\n    .on('drag', dragged);\n\n// Bind control points to circles and apply styles depending on the point type\ng.selectAll('.control-point')\n    .data(controlPoints)\n    .enter()\n    .append('circle')\n    .attr('class', 'control-point')\n    .attr('cx', d => x(d.x))\n    .attr('cy', d => y(d.y))\n    .attr('r', 15)\n    .style('fill', d => d.isEndPoint ? 'blue' : 'red')\n    .style('stroke', 'black')\n    .style('stroke-width', 1)\n    .call(dragHandler);\n\n// Initial drawing of the Bézier curve\nupdateBezierCurve();\n\n\n//# sourceURL=webpack://sgm_interpolations/./bezier_curve.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./bezier_curve.js"]();
/******/ 	
/******/ })()
;