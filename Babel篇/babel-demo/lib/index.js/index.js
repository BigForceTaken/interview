"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.array.concat.js");

var _arguments = typeof arguments === "undefined" ? void 0 : arguments;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var curry = function curry(fn) {
  var args = [].slice.call(_arguments, 1);
  return function () {
    var newArgs = [].slice.call(arguments).concat(args);
    fn.apply(this, newArgs);
  };
}; //使用


function add(a, b) {
  console.log(a + b);
  return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry(); // 3
//或者

var addCurry = curry(add, 1);
addCurry(2); // 3
//或者

var addCurry = curry(add);
addCurry(1, 2); // 3

var Person = /*#__PURE__*/_createClass(function Person() {
  _classCallCheck(this, Person);
});