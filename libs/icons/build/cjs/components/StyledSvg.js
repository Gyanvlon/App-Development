"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyledSvg = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _propTypes = require("prop-types");

var _propTypes2 = require("../propTypes");

var _colors = require("../colors");

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n                fill: ", ";\n            "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n                margin: auto;\n                width: ", "px;\n                height: ", "px;\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    width: 24px;\n    height: 24px;\n    flex-shrink: 0;\n    ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledSvg = _styledComponents.default.svg(_templateObject(), function (_ref) {
  var size = _ref.size,
      color = _ref.color;
  if (size) return (0, _styledComponents.css)(_templateObject2(), size, size);
  if (color) return (0, _styledComponents.css)(_templateObject3(), _colors.colors[color]);
});

exports.StyledSvg = StyledSvg;
StyledSvg.propTypes = {
  size: _propTypes.number,
  color: _propTypes2.colorsPropType
};