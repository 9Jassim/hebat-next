"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/es-define-property";
exports.ids = ["vendor-chunks/es-define-property"];
exports.modules = {

/***/ "(ssr)/./node_modules/es-define-property/index.js":
/*!**************************************************!*\
  !*** ./node_modules/es-define-property/index.js ***!
  \**************************************************/
/***/ ((module) => {

eval("\n\n/** @type {import('.')} */\nvar $defineProperty = Object.defineProperty || false;\nif ($defineProperty) {\n\ttry {\n\t\t$defineProperty({}, 'a', { value: 1 });\n\t} catch (e) {\n\t\t// IE 8 has a broken defineProperty\n\t\t$defineProperty = false;\n\t}\n}\n\nmodule.exports = $defineProperty;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXMtZGVmaW5lLXByb3BlcnR5L2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsU0FBUyxVQUFVO0FBQ3ZDLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2hlYmF0LW5leHQvLi9ub2RlX21vZHVsZXMvZXMtZGVmaW5lLXByb3BlcnR5L2luZGV4LmpzPzRhYjQiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB8fCBmYWxzZTtcbmlmICgkZGVmaW5lUHJvcGVydHkpIHtcblx0dHJ5IHtcblx0XHQkZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyB2YWx1ZTogMSB9KTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIElFIDggaGFzIGEgYnJva2VuIGRlZmluZVByb3BlcnR5XG5cdFx0JGRlZmluZVByb3BlcnR5ID0gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAkZGVmaW5lUHJvcGVydHk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/es-define-property/index.js\n");

/***/ }),

/***/ "(action-browser)/./node_modules/es-define-property/index.js":
/*!**************************************************!*\
  !*** ./node_modules/es-define-property/index.js ***!
  \**************************************************/
/***/ ((module) => {

eval("\n/** @type {import('.')} */ var $defineProperty = Object.defineProperty || false;\nif ($defineProperty) {\n    try {\n        $defineProperty({}, \"a\", {\n            value: 1\n        });\n    } catch (e) {\n        // IE 8 has a broken defineProperty\n        $defineProperty = false;\n    }\n}\nmodule.exports = $defineProperty;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9lcy1kZWZpbmUtcHJvcGVydHkvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFFQSx3QkFBd0IsR0FDeEIsSUFBSUEsa0JBQWtCQyxPQUFPQyxjQUFjLElBQUk7QUFDL0MsSUFBSUYsaUJBQWlCO0lBQ3BCLElBQUk7UUFDSEEsZ0JBQWdCLENBQUMsR0FBRyxLQUFLO1lBQUVHLE9BQU87UUFBRTtJQUNyQyxFQUFFLE9BQU9DLEdBQUc7UUFDWCxtQ0FBbUM7UUFDbkNKLGtCQUFrQjtJQUNuQjtBQUNEO0FBRUFLLE9BQU9DLE9BQU8sR0FBR04iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWJhdC1uZXh0Ly4vbm9kZV9tb2R1bGVzL2VzLWRlZmluZS1wcm9wZXJ0eS9pbmRleC5qcz9iMGIzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgfHwgZmFsc2U7XG5pZiAoJGRlZmluZVByb3BlcnR5KSB7XG5cdHRyeSB7XG5cdFx0JGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgdmFsdWU6IDEgfSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBJRSA4IGhhcyBhIGJyb2tlbiBkZWZpbmVQcm9wZXJ0eVxuXHRcdCRkZWZpbmVQcm9wZXJ0eSA9IGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gJGRlZmluZVByb3BlcnR5O1xuIl0sIm5hbWVzIjpbIiRkZWZpbmVQcm9wZXJ0eSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/es-define-property/index.js\n");

/***/ })

};
;