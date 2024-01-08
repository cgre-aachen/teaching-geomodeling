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

/***/ "./modal.js":
/*!******************!*\
  !*** ./modal.js ***!
  \******************/
/***/ (() => {

eval("// modal.js\ndocument.addEventListener('DOMContentLoaded', function() {\n    var modal = document.getElementById(\"infoModal\");\n    var btn = document.getElementById(\"infoBtn\");\n    var span = document.getElementsByClassName(\"close\")[0];\n\n    btn.onclick = function() {\n        modal.style.display = \"block\";\n    };\n\n    span.onclick = function() {\n        modal.style.display = \"none\";\n    };\n\n    window.onclick = function(event) {\n        if (event.target == modal) {\n            modal.style.display = \"none\";\n        }\n    };\n});\n\n// for home button\ndocument.getElementById('homeBtn').addEventListener('click', function() {\n    window.location.href = '../index.html';  // Replace 'index.html' with the correct path if different\n});\n\n// For CG3 button\ndocument.getElementById('CG3Btn').addEventListener('click', function() {\n    window.open('https://www.cg3.rwth-aachen.de', '_blank');\n});\n\n//# sourceURL=webpack://sgm_interpolations/./modal.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./modal.js"]();
/******/ 	
/******/ })()
;