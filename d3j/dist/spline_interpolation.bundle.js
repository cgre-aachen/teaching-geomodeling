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

/***/ "./node_modules/cubic-spline/index.js":
/*!********************************************!*\
  !*** ./node_modules/cubic-spline/index.js ***!
  \********************************************/
/***/ ((module) => {

eval("module.exports = class Spline {\n  constructor(xs, ys) {\n    this.xs = xs;\n    this.ys = ys;\n    this.ks = this.getNaturalKs(new Float64Array(this.xs.length));\n  }\n\n  getNaturalKs(ks) {\n    const n = this.xs.length - 1;\n    const A = zerosMat(n + 1, n + 2);\n\n    for (\n      let i = 1;\n      i < n;\n      i++ // rows\n    ) {\n      A[i][i - 1] = 1 / (this.xs[i] - this.xs[i - 1]);\n      A[i][i] =\n        2 *\n        (1 / (this.xs[i] - this.xs[i - 1]) + 1 / (this.xs[i + 1] - this.xs[i]));\n      A[i][i + 1] = 1 / (this.xs[i + 1] - this.xs[i]);\n      A[i][n + 1] =\n        3 *\n        ((this.ys[i] - this.ys[i - 1]) /\n          ((this.xs[i] - this.xs[i - 1]) * (this.xs[i] - this.xs[i - 1])) +\n          (this.ys[i + 1] - this.ys[i]) /\n            ((this.xs[i + 1] - this.xs[i]) * (this.xs[i + 1] - this.xs[i])));\n    }\n\n    A[0][0] = 2 / (this.xs[1] - this.xs[0]);\n    A[0][1] = 1 / (this.xs[1] - this.xs[0]);\n    A[0][n + 1] =\n      (3 * (this.ys[1] - this.ys[0])) /\n      ((this.xs[1] - this.xs[0]) * (this.xs[1] - this.xs[0]));\n\n    A[n][n - 1] = 1 / (this.xs[n] - this.xs[n - 1]);\n    A[n][n] = 2 / (this.xs[n] - this.xs[n - 1]);\n    A[n][n + 1] =\n      (3 * (this.ys[n] - this.ys[n - 1])) /\n      ((this.xs[n] - this.xs[n - 1]) * (this.xs[n] - this.xs[n - 1]));\n\n    return solve(A, ks);\n  }\n\n  /**\n   * inspired by https://stackoverflow.com/a/40850313/4417327\n   */\n  getIndexBefore(target) {\n    let low = 0;\n    let high = this.xs.length;\n    let mid = 0;\n    while (low < high) {\n      mid = Math.floor((low + high) / 2);\n      if (this.xs[mid] < target && mid !== low) {\n        low = mid;\n      } else if (this.xs[mid] >= target && mid !== high) {\n        high = mid;\n      } else {\n        high = low;\n      }\n    }\n    return low + 1;\n  }\n\n  at(x) {\n    let i = this.getIndexBefore(x);\n    const t = (x - this.xs[i - 1]) / (this.xs[i] - this.xs[i - 1]);\n    const a =\n      this.ks[i - 1] * (this.xs[i] - this.xs[i - 1]) -\n      (this.ys[i] - this.ys[i - 1]);\n    const b =\n      -this.ks[i] * (this.xs[i] - this.xs[i - 1]) +\n      (this.ys[i] - this.ys[i - 1]);\n    const q =\n      (1 - t) * this.ys[i - 1] +\n      t * this.ys[i] +\n      t * (1 - t) * (a * (1 - t) + b * t);\n    return q;\n  }\n};\n\nfunction solve(A, ks) {\n  const m = A.length;\n  let h = 0;\n  let k = 0;\n  while (h < m && k <= m) {\n    let i_max = 0;\n    let max = -Infinity;\n    for (let i = h; i < m; i++) {\n      const v = Math.abs(A[i][k]);\n      if (v > max) {\n        i_max = i;\n        max = v;\n      }\n    }\n\n    if (A[i_max][k] === 0) {\n      k++;\n    } else {\n      swapRows(A, h, i_max);\n      for (let i = h + 1; i < m; i++) {\n        const f = A[i][k] / A[h][k];\n        A[i][k] = 0;\n        for (let j = k + 1; j <= m; j++) A[i][j] -= A[h][j] * f;\n      }\n      h++;\n      k++;\n    }\n  }\n\n  for (\n    let i = m - 1;\n    i >= 0;\n    i-- // rows = columns\n  ) {\n    var v = 0;\n    if (A[i][i]) {\n      v = A[i][m] / A[i][i];\n    }\n    ks[i] = v;\n    for (\n      let j = i - 1;\n      j >= 0;\n      j-- // rows\n    ) {\n      A[j][m] -= A[j][i] * v;\n      A[j][i] = 0;\n    }\n  }\n  return ks;\n}\n\nfunction zerosMat(r, c) {\n  const A = [];\n  for (let i = 0; i < r; i++) A.push(new Float64Array(c));\n  return A;\n}\n\nfunction swapRows(m, k, l) {\n  let p = m[k];\n  m[k] = m[l];\n  m[l] = p;\n}\n\n\n//# sourceURL=webpack://sgm_interpolations/./node_modules/cubic-spline/index.js?");

/***/ }),

/***/ "./spline_interpolation.js":
/*!*********************************!*\
  !*** ./spline_interpolation.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var cubic_spline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cubic-spline */ \"./node_modules/cubic-spline/index.js\");\n/* harmony import */ var cubic_spline__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cubic_spline__WEBPACK_IMPORTED_MODULE_0__);\n// import { PolynomialRegressor } from '@rainij/polynomial-regression-js';\n\n\n\n\n// Sample Data\n// const data = [{x: 10, y: 20}, {x: 20, y: 40}]; //, ...];  // Replace with your data\n\n// ************************************\n// Create random points\n// ************************************\n\nfunction seededPRNG(seed) {\n    return function() {\n        seed = seed * 16807 % 2147483647;\n        return (seed - 1) / 2147483646;\n    };\n}\n\n// Set the seed for reproducibility\nconst seed = 12315;  // Change this value for different results\nconst random = seededPRNG(seed);\n\n// Generate 10 random x,y-pairs\nconst data = Array.from({ length: 10 }, () => ({\n    x: random() * 8 + 1,  // Assuming you want x and y values in the range [10, 10]\n    y: random() * 2 + 4\n}));\n\nconsole.log(data);\n\n// ************************************\n// Create (x,y)-plot\n// ************************************\n\nconst svg = d3.select(\"#plotArea\");\n\nconst margin = { top: 40, right: 40, bottom: 60, left: 100 };\nconst viewBoxWidth = 1600;\nconst viewBoxHeight = 800;\nconst width = viewBoxWidth - margin.left - margin.right;\nconst height = viewBoxHeight - margin.top - margin.bottom;\n\nconst x = d3.scaleLinear().rangeRound([0, width]);\nconst y = d3.scaleLinear().rangeRound([height, 0]);\n\n\n\nconst g = svg.append(\"g\").attr(\"transform\", `translate(${margin.left},${margin.top})`);\n// Set domain limits\n\n// from data\n// x.domain(d3.extent(data, d => d.x));\n// y.domain(d3.extent(data, d => d.y));\n\n// manually\nx.domain([0, 10]);\ny.domain([0, 10]);\n\n// Create the X and Y axes with class names for future reference\nconst xAxis = g.append(\"g\")\n    .attr(\"class\", \"x axis\")  // Assign class name\n    .attr(\"transform\", `translate(0,${height})`)\n    .call(d3.axisBottom(x));\n\nconst yAxis = g.append(\"g\")\n    .attr(\"class\", \"y axis\")  // Assign class name\n    .call(d3.axisLeft(y));\n\ng.selectAll(\".y.axis text\")\n    .style(\"font-size\", \"30px\");  // Update font size\n  \n\n    g.selectAll(\".x.axis text\")\n    .style(\"font-size\", \"30px\");  // Update font size\n\n\n// Gridlines\ng.append(\"g\")   \n    .attr(\"class\", \"grid\")\n    .attr(\"transform\", `translate(0,${height})`)\n    .call(d3.axisBottom(x)\n        .tickSize(-height)\n        .tickFormat(\"\"));\n\ng.append(\"g\")   \n    .attr(\"class\", \"grid\")\n    .call(d3.axisLeft(y)\n        .tickSize(-width)\n        .tickFormat(\"\"));\n\n\n// **************************\n// Spline function\n// **************************\n\n// Function to update spline curve\nfunction updateSpline() {\n    // Sort the data by x-values\n    data.sort((a, b) => a.x - b.x);\n\n    // get min/ max of data range\n    const xMin = d3.min(data, d => d.x);\n    const xMax = d3.max(data, d => d.x);\n\n    // Extract sorted xs and ys\n    const xs = data.map(d => d.x);\n    const ys = data.map(d => d.y);\n\n    // Create the spline with sorted data\n    const spline = new (cubic_spline__WEBPACK_IMPORTED_MODULE_0___default())(xs, ys);\n  \n     // Generate points for the curve at a higher resolution within the data range\n     const curvePoints = [];\n     const step = (xMax - xMin) / 500;  // Adjust the number of points for smoothness\n \n     for (let i = xMin; i <= xMax; i += step) {\n         curvePoints.push({ x: i, y: spline.at(i) });\n     }\n     \n    // Draw the curve (or update if already drawn)\n    const line = d3.line()\n        .x(d => x(d.x))\n        .y(d => y(d.y));\n\n    const path = g.selectAll('.spline-curve')\n        .data([curvePoints]);  // Bind the new curve data\n\n    path.enter().append('path')\n        .attr('class', 'spline-curve')\n        .merge(path)\n        .attr('fill', 'none')\n        .attr('stroke', 'green')\n        .attr('stroke-width', 3)\n        .attr('d', line);\n}\n\n\n// Initial drawing of the curve\nupdateSpline();\n\n// ************************************\n// Drag points\n// ************************************\n\n// Drag event handler\nfunction dragged(event, d) {\n    const [newX, newY] = d3.pointer(event, this);  // Get the correct coordinates\n\n    d.x = x.invert(newX);  // Convert from screen to data coordinates\n    d.y = y.invert(newY);  // Convert from screen to data coordinates\n\n    d3.select(this)\n    .attr('cx', x(d.x))  // Update the position using the data scale\n    .attr('cy', y(d.y));\n\n    // Update the spline curve after dragging a point\n    updateSpline();\n}\n\n// Apply drag behavior to the points\ng.selectAll(\".dot\")\n.data(data)\n.enter().append(\"circle\")\n    .attr(\"class\", \"dot\")\n    .attr(\"cx\", d => x(d.x))\n    .attr(\"cy\", d => y(d.y))\n    .attr(\"r\", 10)\n        .call(d3.drag().on(\"drag\", dragged));\n\n\n\n\n//# sourceURL=webpack://sgm_interpolations/./spline_interpolation.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./spline_interpolation.js");
/******/ 	
/******/ })()
;