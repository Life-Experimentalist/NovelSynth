/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/popup/popup.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/popup/popup.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* NovelSynth Popup Styles */

:root {
--primary-color: #667eea;
    --primary-hover: #5a6fd1;
    --primary-active: #4a5db7;
    --text-color: #333;
    --text-secondary: #666;
    --background-color: #fff;
    --surface-color: #f8f9fa;
    --border-color: #ddd;
    --error-color: #dc3545;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --radius: 6px;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
:root {
    --text-color: #e8eaed;
        --text-secondary: #9aa0a6;
        --background-color: #202124;
        --surface-color: #292a2d;
        --border-color: #5f6368;
    }
}
.dark-theme {
    --text-color: #e8eaed;
    --text-secondary: #9aa0a6;
    --background-color: #202124;
    --surface-color: #292a2d;
    --border-color: #5f6368;
}

.light-theme {
    --text-color: #333;
    --text-secondary: #666;
    --background-color: #fff;
    --surface-color: #f8f9fa;
    --border-color: #ddd;
}

/* Base styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-color);
    background-color: var(--background-color);
    width: 400px;
    overflow-x: hidden;
}
.container {
min-height: 300px;
    max-height: 600px;
    display: flex;
    flex-direction: column;
}

/* Header */
.header {
display: flex;
justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
}

.logo-section {
    display: flex;
align-items: center;
gap: 8px;
}

.logo-icon {
    width: 24px;
    height: 24px;
}

.logo-text h1 {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-color);
    margin: 0;
}

.version {
    font-size: 12px;
    color: var(--text-secondary);
}

.theme-toggle {
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.theme-toggle:hover {
    background-color: var(--surface-color);
}

/* Tabs */
.tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--surface-color);
    overflow-x: auto;
    scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
    display: none;
}

.tab-btn {
    padding: 10px 16px;
    background: none;
    border: none;
    color: var(--text-secondary);
cursor: pointer;
    font-size: 14px;
    font-weight: 500;
white-space: nowrap;
    position: relative;
transition: color 0.2s;
}

.tab-btn:hover {
    color: var(--primary-color);
}

.tab-btn.active {
    color: var(--primary-color);
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--primary-color);
}

/* Tab content */
.tab-content {
    display: none;
    padding: 16px;
    overflow-y: auto;
    flex: 1;
}

.tab-content.active {
    display: block;
}

/* Form controls */
.setting {
margin-bottom: 16px;
}

label {
    display: block;
margin-bottom: 6px;
font-weight: 500;
    color: var(--text-color);
}

input[type="text"],
input[type="password"],
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 8px 10px;
border: 1px solid var(--border-color);
    border-radius: var(--radius);
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 14px;
    transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
    border-color: var(--primary-color);
    outline: none;
}

.description {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
}

.api-key-container {
    display: flex;
gap: 8px;
}

.model-select-container {
    display: flex;
    gap: 8px;
}

.slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.slider-value {
font-weight: 500;
color: var(--primary-color);
}

.slider {
width: 100%;
height: 4px;
    border-radius: 2px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--border-color);
    outline: none;
}

.slider::-webkit-slider-thumb {
-webkit-appearance: none;
    appearance: none;
width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
background: var(--primary-color);
    cursor: pointer;
border: none;
}

/* Buttons */
button {
    padding: 8px 12px;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    color: var(--text-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

button:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.small-btn {
    padding: 6px 8px;
    font-size: 12px;
}

.icon-button {
    padding: 6px;
    width: 30px;
    height: 30px;
    display: flex;
align-items: center;
    justify-content: center;
}

#enhancePageBtn {
    background-color: var(--primary-color);
    color: white;
border-color: var(--primary-color);
}

#enhancePageBtn:hover {
    background-color: var(--primary-hover);
    border-color: var(--primary-hover);
}

#saveSettings {
    background-color: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

#saveSettings:hover {
    background-color: #218838;
    border-color: #218838;
}

.actions {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
}

/* Status area */
.status-area {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 8px 16px;
    border-radius: var(--radius);
    background-color: var(--info-color);
    color: white;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    z-index: 100;
    pointer-events: none;
    max-width: 90%;
    text-align: center;
}

.status-area.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.status-area.success {
    background-color: var(--success-color);
}

.status-area.error {
    background-color: var(--error-color);
}

.status-area.warning {
    background-color: var(--warning-color);
    color: #333;
}

/* Resize handle */
.resize-handle {
position: absolute;
bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
    opacity: 0.3;
    transition: opacity 0.2s;
}

.resize-handle:hover {
opacity: 0.7;
}

.resize-handle::before {
    content: '';
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 10px;
    height: 10px;
    border-right: 2px solid var(--text-secondary);
    border-bottom: 2px solid var(--text-secondary);
}

/* Size indicator */
.size-indicator {
    position: fixed;
    bottom: 8px;
    left: 8px;
    font-size: 10px;
    color: var(--text-secondary);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
}

.size-indicator.visible {
    opacity: 0.7;
}`, "",{"version":3,"sources":["webpack://./src/popup/popup.css"],"names":[],"mappings":"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","sourcesContent":["/* NovelSynth Popup Styles */\r\n\r\n:root {\r\n--primary-color: #667eea;\r\n    --primary-hover: #5a6fd1;\r\n    --primary-active: #4a5db7;\r\n    --text-color: #333;\r\n    --text-secondary: #666;\r\n    --background-color: #fff;\r\n    --surface-color: #f8f9fa;\r\n    --border-color: #ddd;\r\n    --error-color: #dc3545;\r\n    --success-color: #28a745;\r\n    --warning-color: #ffc107;\r\n    --info-color: #17a2b8;\r\n    --radius: 6px;\r\n    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n@media (prefers-color-scheme: dark) {\r\n:root {\r\n    --text-color: #e8eaed;\r\n        --text-secondary: #9aa0a6;\r\n        --background-color: #202124;\r\n        --surface-color: #292a2d;\r\n        --border-color: #5f6368;\r\n    }\r\n}\r\n.dark-theme {\r\n    --text-color: #e8eaed;\r\n    --text-secondary: #9aa0a6;\r\n    --background-color: #202124;\r\n    --surface-color: #292a2d;\r\n    --border-color: #5f6368;\r\n}\r\n\r\n.light-theme {\r\n    --text-color: #333;\r\n    --text-secondary: #666;\r\n    --background-color: #fff;\r\n    --surface-color: #f8f9fa;\r\n    --border-color: #ddd;\r\n}\r\n\r\n/* Base styles */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\r\n    font-size: 14px;\r\n    line-height: 1.5;\r\n    color: var(--text-color);\r\n    background-color: var(--background-color);\r\n    width: 400px;\r\n    overflow-x: hidden;\r\n}\r\n.container {\r\nmin-height: 300px;\r\n    max-height: 600px;\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n/* Header */\r\n.header {\r\ndisplay: flex;\r\njustify-content: space-between;\r\n    align-items: center;\r\n    padding: 12px 16px;\r\n    border-bottom: 1px solid var(--border-color);\r\n}\r\n\r\n.logo-section {\r\n    display: flex;\r\nalign-items: center;\r\ngap: 8px;\r\n}\r\n\r\n.logo-icon {\r\n    width: 24px;\r\n    height: 24px;\r\n}\r\n\r\n.logo-text h1 {\r\n    font-size: 18px;\r\n    font-weight: 600;\r\n    color: var(--primary-color);\r\n    margin: 0;\r\n}\r\n\r\n.version {\r\n    font-size: 12px;\r\n    color: var(--text-secondary);\r\n}\r\n\r\n.theme-toggle {\r\n    cursor: pointer;\r\n    padding: 6px;\r\n    border-radius: 50%;\r\n    transition: background-color 0.2s;\r\n}\r\n\r\n.theme-toggle:hover {\r\n    background-color: var(--surface-color);\r\n}\r\n\r\n/* Tabs */\r\n.tabs {\r\n    display: flex;\r\n    border-bottom: 1px solid var(--border-color);\r\n    background-color: var(--surface-color);\r\n    overflow-x: auto;\r\n    scrollbar-width: none;\r\n}\r\n\r\n.tabs::-webkit-scrollbar {\r\n    display: none;\r\n}\r\n\r\n.tab-btn {\r\n    padding: 10px 16px;\r\n    background: none;\r\n    border: none;\r\n    color: var(--text-secondary);\r\ncursor: pointer;\r\n    font-size: 14px;\r\n    font-weight: 500;\r\nwhite-space: nowrap;\r\n    position: relative;\r\ntransition: color 0.2s;\r\n}\r\n\r\n.tab-btn:hover {\r\n    color: var(--primary-color);\r\n}\r\n\r\n.tab-btn.active {\r\n    color: var(--primary-color);\r\n}\r\n\r\n.tab-btn.active::after {\r\n    content: '';\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    height: 2px;\r\n    background-color: var(--primary-color);\r\n}\r\n\r\n/* Tab content */\r\n.tab-content {\r\n    display: none;\r\n    padding: 16px;\r\n    overflow-y: auto;\r\n    flex: 1;\r\n}\r\n\r\n.tab-content.active {\r\n    display: block;\r\n}\r\n\r\n/* Form controls */\r\n.setting {\r\nmargin-bottom: 16px;\r\n}\r\n\r\nlabel {\r\n    display: block;\r\nmargin-bottom: 6px;\r\nfont-weight: 500;\r\n    color: var(--text-color);\r\n}\r\n\r\ninput[type=\"text\"],\r\ninput[type=\"password\"],\r\ninput[type=\"number\"],\r\nselect,\r\ntextarea {\r\n    width: 100%;\r\n    padding: 8px 10px;\r\nborder: 1px solid var(--border-color);\r\n    border-radius: var(--radius);\r\n    background-color: var(--background-color);\r\n    color: var(--text-color);\r\n    font-size: 14px;\r\n    transition: border-color 0.2s;\r\n}\r\n\r\ninput[type=\"text\"]:focus,\r\ninput[type=\"password\"]:focus,\r\ninput[type=\"number\"]:focus,\r\nselect:focus,\r\ntextarea:focus {\r\n    border-color: var(--primary-color);\r\n    outline: none;\r\n}\r\n\r\n.description {\r\n    font-size: 12px;\r\n    color: var(--text-secondary);\r\n    margin-top: 4px;\r\n}\r\n\r\n.api-key-container {\r\n    display: flex;\r\ngap: 8px;\r\n}\r\n\r\n.model-select-container {\r\n    display: flex;\r\n    gap: 8px;\r\n}\r\n\r\n.slider-header {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-bottom: 6px;\r\n}\r\n\r\n.slider-value {\r\nfont-weight: 500;\r\ncolor: var(--primary-color);\r\n}\r\n\r\n.slider {\r\nwidth: 100%;\r\nheight: 4px;\r\n    border-radius: 2px;\r\n    -webkit-appearance: none;\r\n    appearance: none;\r\n    background: var(--border-color);\r\n    outline: none;\r\n}\r\n\r\n.slider::-webkit-slider-thumb {\r\n-webkit-appearance: none;\r\n    appearance: none;\r\nwidth: 14px;\r\n    height: 14px;\r\n    border-radius: 50%;\r\n    background: var(--primary-color);\r\n    cursor: pointer;\r\n}\r\n\r\n.slider::-moz-range-thumb {\r\n    width: 14px;\r\n    height: 14px;\r\n    border-radius: 50%;\r\nbackground: var(--primary-color);\r\n    cursor: pointer;\r\nborder: none;\r\n}\r\n\r\n/* Buttons */\r\nbutton {\r\n    padding: 8px 12px;\r\n    background-color: var(--surface-color);\r\n    border: 1px solid var(--border-color);\r\n    border-radius: var(--radius);\r\n    color: var(--text-color);\r\n    font-size: 14px;\r\n    font-weight: 500;\r\n    cursor: pointer;\r\n    transition: all 0.2s;\r\n}\r\n\r\nbutton:hover {\r\n    border-color: var(--primary-color);\r\n    color: var(--primary-color);\r\n}\r\n\r\n.small-btn {\r\n    padding: 6px 8px;\r\n    font-size: 12px;\r\n}\r\n\r\n.icon-button {\r\n    padding: 6px;\r\n    width: 30px;\r\n    height: 30px;\r\n    display: flex;\r\nalign-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n#enhancePageBtn {\r\n    background-color: var(--primary-color);\r\n    color: white;\r\nborder-color: var(--primary-color);\r\n}\r\n\r\n#enhancePageBtn:hover {\r\n    background-color: var(--primary-hover);\r\n    border-color: var(--primary-hover);\r\n}\r\n\r\n#saveSettings {\r\n    background-color: var(--success-color);\r\n    color: white;\r\n    border-color: var(--success-color);\r\n}\r\n\r\n#saveSettings:hover {\r\n    background-color: #218838;\r\n    border-color: #218838;\r\n}\r\n\r\n.actions {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    margin-top: 24px;\r\n}\r\n\r\n/* Status area */\r\n.status-area {\r\n    position: fixed;\r\n    bottom: 16px;\r\n    left: 50%;\r\n    transform: translateX(-50%) translateY(20px);\r\n    padding: 8px 16px;\r\n    border-radius: var(--radius);\r\n    background-color: var(--info-color);\r\n    color: white;\r\n    font-size: 14px;\r\n    opacity: 0;\r\n    transition: opacity 0.3s, transform 0.3s;\r\n    z-index: 100;\r\n    pointer-events: none;\r\n    max-width: 90%;\r\n    text-align: center;\r\n}\r\n\r\n.status-area.visible {\r\n    opacity: 1;\r\n    transform: translateX(-50%) translateY(0);\r\n}\r\n\r\n.status-area.success {\r\n    background-color: var(--success-color);\r\n}\r\n\r\n.status-area.error {\r\n    background-color: var(--error-color);\r\n}\r\n\r\n.status-area.warning {\r\n    background-color: var(--warning-color);\r\n    color: #333;\r\n}\r\n\r\n/* Resize handle */\r\n.resize-handle {\r\nposition: absolute;\r\nbottom: 0;\r\n    right: 0;\r\n    width: 16px;\r\n    height: 16px;\r\n    cursor: nwse-resize;\r\n    opacity: 0.3;\r\n    transition: opacity 0.2s;\r\n}\r\n\r\n.resize-handle:hover {\r\nopacity: 0.7;\r\n}\r\n\r\n.resize-handle::before {\r\n    content: '';\r\n    position: absolute;\r\n    right: 3px;\r\n    bottom: 3px;\r\n    width: 10px;\r\n    height: 10px;\r\n    border-right: 2px solid var(--text-secondary);\r\n    border-bottom: 2px solid var(--text-secondary);\r\n}\r\n\r\n/* Size indicator */\r\n.size-indicator {\r\n    position: fixed;\r\n    bottom: 8px;\r\n    left: 8px;\r\n    font-size: 10px;\r\n    color: var(--text-secondary);\r\n    opacity: 0;\r\n    transition: opacity 0.2s;\r\n    pointer-events: none;\r\n}\r\n\r\n.size-indicator.visible {\r\n    opacity: 0.7;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/popup/popup.css":
/*!*****************************!*\
  !*** ./src/popup/popup.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_popup_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./popup.css */ "./node_modules/css-loader/dist/cjs.js!./src/popup/popup.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_popup_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_popup_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_popup_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_popup_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/utils/StorageManager.js":
/*!*************************************!*\
  !*** ./src/utils/StorageManager.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (c = i[4] || 3, u = i[5] === e ? i[3] : i[5], i[4] = 3, i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * StorageManager utility for handling extension storage
 * Provides functions for getting and setting items in storage
 */
var StorageManager = /*#__PURE__*/function () {
  function StorageManager() {
    _classCallCheck(this, StorageManager);
  }
  return _createClass(StorageManager, null, [{
    key: "getItem",
    value: (
    /**
     * Get an item from storage
     * @param {string} key - The key to get
     * @returns {Promise<any>} - The stored value
     */
    function () {
      var _getItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(key) {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              console.log("Getting item from storage:", key);
              return _context.a(2, new Promise(function (resolve) {
                chrome.storage.sync.get(key, function (result) {
                  console.log("Retrieved item:", key, result[key]);
                  resolve(result[key]);
                });
              }));
          }
        }, _callee);
      }));
      function getItem(_x) {
        return _getItem.apply(this, arguments);
      }
      return getItem;
    }()
    /**
     * Set an item in storage
     * @param {string} key - The key to set
     * @param {any} value - The value to store
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "setItem",
    value: (function () {
      var _setItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(key, value) {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              console.log("Setting item in storage:", key, value);
              return _context2.a(2, new Promise(function (resolve) {
                var data = {};
                data[key] = value;
                chrome.storage.sync.set(data, function () {
                  console.log("Item set successfully:", key);
                  resolve();
                });
              }));
          }
        }, _callee2);
      }));
      function setItem(_x2, _x3) {
        return _setItem.apply(this, arguments);
      }
      return setItem;
    }()
    /**
     * Remove an item from storage
     * @param {string} key - The key to remove
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "removeItem",
    value: (function () {
      var _removeItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(key) {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              return _context3.a(2, new Promise(function (resolve) {
                chrome.storage.sync.remove(key, function () {
                  resolve();
                });
              }));
          }
        }, _callee3);
      }));
      function removeItem(_x4) {
        return _removeItem.apply(this, arguments);
      }
      return removeItem;
    }()
    /**
     * Get all settings
     * @returns {Promise<Object>} - All settings
     */
    )
  }, {
    key: "getSettings",
    value: (function () {
      var _getSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var settings, _t;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              console.log("Getting all settings");
              _context4.n = 1;
              return this.getItem("settings");
            case 1:
              _t = _context4.v;
              if (_t) {
                _context4.n = 2;
                break;
              }
              _t = {};
            case 2:
              settings = _t;
              console.log("Retrieved settings:", settings);
              return _context4.a(2, settings);
          }
        }, _callee4, this);
      }));
      function getSettings() {
        return _getSettings.apply(this, arguments);
      }
      return getSettings;
    }()
    /**
     * Save all settings
     * @param {Object} settings - The settings object to save
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "saveSettings",
    value: (function () {
      var _saveSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(settings) {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              console.log("Saving settings:", settings);
              return _context5.a(2, this.setItem("settings", settings));
          }
        }, _callee5, this);
      }));
      function saveSettings(_x5) {
        return _saveSettings.apply(this, arguments);
      }
      return saveSettings;
    }()
    /**
     * Get local storage item (for larger data)
     * @param {string} key - The key to get
     * @returns {Promise<any>} - The stored value
     */
    )
  }, {
    key: "getLocalItem",
    value: (function () {
      var _getLocalItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(key) {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              return _context6.a(2, new Promise(function (resolve) {
                chrome.storage.local.get(key, function (result) {
                  resolve(result[key]);
                });
              }));
          }
        }, _callee6);
      }));
      function getLocalItem(_x6) {
        return _getLocalItem.apply(this, arguments);
      }
      return getLocalItem;
    }()
    /**
     * Set local storage item (for larger data)
     * @param {string} key - The key to set
     * @param {any} value - The value to store
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "setLocalItem",
    value: (function () {
      var _setLocalItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(key, value) {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              return _context7.a(2, new Promise(function (resolve) {
                var data = {};
                data[key] = value;
                chrome.storage.local.set(data, function () {
                  resolve();
                });
              }));
          }
        }, _callee7);
      }));
      function setLocalItem(_x7, _x8) {
        return _setLocalItem.apply(this, arguments);
      }
      return setLocalItem;
    }()
    /**
     * Get content history
     * @returns {Promise<Object>} - Content history object
     */
    )
  }, {
    key: "getContentHistory",
    value: (function () {
      var _getContentHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              return _context8.a(2, this.getLocalItem("contentHistory") || {});
          }
        }, _callee8, this);
      }));
      function getContentHistory() {
        return _getContentHistory.apply(this, arguments);
      }
      return getContentHistory;
    }()
    /**
     * Add item to content history
     * @param {string} url - The URL of the content
     * @param {Object} data - The content data
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "addToContentHistory",
    value: (function () {
      var _addToContentHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(url, data) {
        var history;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              _context9.n = 1;
              return this.getContentHistory();
            case 1:
              history = _context9.v;
              history[url] = _objectSpread(_objectSpread(_objectSpread({}, history[url]), data), {}, {
                lastAccessed: Date.now()
              });
              return _context9.a(2, this.setLocalItem("contentHistory", history));
          }
        }, _callee9, this);
      }));
      function addToContentHistory(_x9, _x0) {
        return _addToContentHistory.apply(this, arguments);
      }
      return addToContentHistory;
    }()
    /**
     * Get cached result for URL
     * @param {string} url - The URL to get cached result for
     * @returns {Promise<Object|null>} - The cached result or null
     */
    )
  }, {
    key: "getCachedResult",
    value: (function () {
      var _getCachedResult = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(url) {
        var _history$url;
        var history;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              _context0.n = 1;
              return this.getContentHistory();
            case 1:
              history = _context0.v;
              return _context0.a(2, ((_history$url = history[url]) === null || _history$url === void 0 ? void 0 : _history$url.result) || null);
          }
        }, _callee0, this);
      }));
      function getCachedResult(_x1) {
        return _getCachedResult.apply(this, arguments);
      }
      return getCachedResult;
    }()
    /**
     * Clear all storage
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "clearAll",
    value: (function () {
      var _clearAll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              return _context1.a(2, new Promise(function (resolve) {
                chrome.storage.sync.clear(function () {
                  chrome.storage.local.clear(function () {
                    resolve();
                  });
                });
              }));
          }
        }, _callee1);
      }));
      function clearAll() {
        return _clearAll.apply(this, arguments);
      }
      return clearAll;
    }()
    /**
     * Get storage usage information
     * @returns {Promise<Object>} - Storage usage information
     */
    )
  }, {
    key: "getStorageUsage",
    value: (function () {
      var _getStorageUsage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              return _context10.a(2, new Promise(function (resolve) {
                chrome.storage.sync.getBytesInUse(null, function (syncBytes) {
                  chrome.storage.local.getBytesInUse(null, function (localBytes) {
                    resolve({
                      sync: {
                        bytesUsed: syncBytes,
                        bytesTotal: chrome.storage.sync.QUOTA_BYTES,
                        percentUsed: syncBytes / chrome.storage.sync.QUOTA_BYTES * 100
                      },
                      local: {
                        bytesUsed: localBytes,
                        bytesTotal: chrome.storage.local.QUOTA_BYTES,
                        percentUsed: localBytes / chrome.storage.local.QUOTA_BYTES * 100
                      }
                    });
                  });
                });
              }));
          }
        }, _callee10);
      }));
      function getStorageUsage() {
        return _getStorageUsage.apply(this, arguments);
      }
      return getStorageUsage;
    }())
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StorageManager);

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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/popup/popup.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_StorageManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/StorageManager */ "./src/utils/StorageManager.js");
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./popup.css */ "./src/popup/popup.css");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (c = i[4] || 3, u = i[5] === e ? i[3] : i[5], i[4] = 3, i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Popup script for NovelSynth extension



// Log initialization for debugging
console.log("NovelSynth popup initializing...");

// DOM elements
var elements = {};

// Default settings
var DEFAULT_SETTINGS = {
  apiKey: "",
  model: "gpt-4o",
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 8192,
  chunkingEnabled: true,
  chunkSize: 12000,
  useEmoji: false,
  showBanner: true,
  theme: "auto"
};

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
  var settings, _t;
  return _regenerator().w(function (_context) {
    while (1) switch (_context.n) {
      case 0:
        console.log("NovelSynth popup DOM loaded");
        _context.p = 1;
        // Cache DOM elements
        cacheElements();

        // Load settings
        _context.n = 2;
        return loadSettings();
      case 2:
        settings = _context.v;
        // Initialize UI
        initializeUI(settings);

        // Set up event listeners
        setupEventListeners();
        console.log("NovelSynth popup initialized successfully");
        _context.n = 4;
        break;
      case 3:
        _context.p = 3;
        _t = _context.v;
        console.error("Error initializing popup:", _t);
        showStatus("Error initializing popup. Please check console for details.", "error");
      case 4:
        return _context.a(2);
    }
  }, _callee, null, [[1, 3]]);
})));

// Cache DOM elements for faster access
function cacheElements() {
  // Tab navigation
  elements.tabButtons = document.querySelectorAll(".tab-btn");
  elements.tabContents = document.querySelectorAll(".tab-content");

  // Settings tab elements
  elements.apiKeyInput = document.getElementById("apiKey");
  elements.modelSelect = document.getElementById("modelSelect");
  elements.temperatureSlider = document.getElementById("temperatureSlider");
  elements.temperatureValue = document.getElementById("temperatureValue");
  elements.saveSettingsBtn = document.getElementById("saveSettings");
  elements.enhancePageBtn = document.getElementById("enhancePageBtn");

  // Theme toggle
  elements.themeToggle = document.getElementById("theme-toggle");

  // Status area
  elements.statusArea = document.getElementById("status");

  // Resize handle
  elements.resizeHandle = document.getElementById("resize-handle");
  elements.sizeIndicator = document.getElementById("sizeIndicator");
}

// Load settings from storage
function loadSettings() {
  return _loadSettings.apply(this, arguments);
} // Initialize UI based on loaded settings
function _loadSettings() {
  _loadSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var storedSettings, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.p = 0;
          console.log("Loading settings from storage");
          _context2.n = 1;
          return _utils_StorageManager__WEBPACK_IMPORTED_MODULE_0__["default"].getSettings();
        case 1:
          storedSettings = _context2.v;
          console.log("Settings loaded:", storedSettings);
          return _context2.a(2, _objectSpread(_objectSpread({}, DEFAULT_SETTINGS), storedSettings));
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          console.error("Error loading settings:", _t2);
          showStatus("Error loading settings. Using defaults.", "error");
          return _context2.a(2, DEFAULT_SETTINGS);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return _loadSettings.apply(this, arguments);
}
function initializeUI(settings) {
  console.log("Initializing UI with settings:", settings);

  // Apply theme
  applyTheme(settings.theme);

  // Set form values
  if (elements.apiKeyInput) {
    elements.apiKeyInput.value = settings.apiKey || "";
  }
  if (elements.modelSelect) {
    elements.modelSelect.value = settings.model || "gpt-4o";
  }
  if (elements.temperatureSlider) {
    elements.temperatureSlider.value = settings.temperature || 0.7;
    updateTemperatureDisplay(settings.temperature || 0.7);
  }

  // Show initial tab
  var initialTab = document.querySelector(".tab-btn.active");
  if (initialTab) {
    var tabName = initialTab.getAttribute("data-tab");
    switchTab(tabName);
  }
}

// Apply theme (light, dark, or auto)
function applyTheme(theme) {
  var root = document.documentElement;
  var container = document.getElementById("app-container");
  if (!container) return;

  // Remove existing theme classes
  container.classList.remove("dark-theme", "light-theme");
  if (theme === "auto") {
    // Use system preference
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    container.classList.add(prefersDark ? "dark-theme" : "light-theme");
  } else {
    // Use specified theme
    container.classList.add("".concat(theme, "-theme"));
  }
}

// Set up event listeners
function setupEventListeners() {
  // Tab switching
  if (elements.tabButtons) {
    elements.tabButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var tabName = button.getAttribute("data-tab");
        console.log("Tab clicked:", tabName);
        switchTab(tabName);
      });
    });
  }

  // Temperature slider
  if (elements.temperatureSlider) {
    elements.temperatureSlider.addEventListener("input", function (e) {
      updateTemperatureDisplay(e.target.value);
    });
  }

  // Theme toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener("click", toggleTheme);
  }

  // Save settings button
  if (elements.saveSettingsBtn) {
    elements.saveSettingsBtn.addEventListener("click", saveSettings);
  }

  // Enhance page button
  if (elements.enhancePageBtn) {
    elements.enhancePageBtn.addEventListener("click", enhanceCurrentPage);
  }

  // Resize handle
  if (elements.resizeHandle) {
    elements.resizeHandle.addEventListener("mousedown", initResize);
  }
}

// Switch between tabs
function switchTab(tabName) {
  if (!elements.tabButtons || !elements.tabContents) {
    console.error("Tab elements not found");
    return;
  }
  console.log("Switching to tab:", tabName);
  elements.tabButtons.forEach(function (btn) {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  elements.tabContents.forEach(function (content) {
    if (content.id === tabName) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });
}

// Update temperature display
function updateTemperatureDisplay(value) {
  if (elements.temperatureValue) {
    elements.temperatureValue.textContent = value;
  }
}

// Toggle between light and dark theme
function toggleTheme() {
  var container = document.getElementById("app-container");
  if (container.classList.contains("dark-theme")) {
    container.classList.remove("dark-theme");
    container.classList.add("light-theme");
    saveThemePreference("light");
  } else {
    container.classList.remove("light-theme");
    container.classList.add("dark-theme");
    saveThemePreference("dark");
  }
}

// Save theme preference
function saveThemePreference(_x) {
  return _saveThemePreference.apply(this, arguments);
} // Save settings
function _saveThemePreference() {
  _saveThemePreference = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(theme) {
    var settings, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return _utils_StorageManager__WEBPACK_IMPORTED_MODULE_0__["default"].getSettings();
        case 1:
          settings = _context3.v;
          settings.theme = theme;
          _context3.n = 2;
          return _utils_StorageManager__WEBPACK_IMPORTED_MODULE_0__["default"].saveSettings(settings);
        case 2:
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t3 = _context3.v;
          console.error("Error saving theme preference:", _t3);
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 3]]);
  }));
  return _saveThemePreference.apply(this, arguments);
}
function saveSettings() {
  return _saveSettings.apply(this, arguments);
} // Enhance current page
function _saveSettings() {
  _saveSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var settings, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return _utils_StorageManager__WEBPACK_IMPORTED_MODULE_0__["default"].getSettings();
        case 1:
          settings = _context4.v;
          // Update settings with form values
          if (elements.apiKeyInput) {
            settings.apiKey = elements.apiKeyInput.value;
          }
          if (elements.modelSelect) {
            settings.model = elements.modelSelect.value;
          }
          if (elements.temperatureSlider) {
            settings.temperature = parseFloat(elements.temperatureSlider.value);
          }
          console.log("Saving settings:", settings);
          _context4.n = 2;
          return _utils_StorageManager__WEBPACK_IMPORTED_MODULE_0__["default"].saveSettings(settings);
        case 2:
          showStatus("Settings saved successfully", "success");
          _context4.n = 4;
          break;
        case 3:
          _context4.p = 3;
          _t4 = _context4.v;
          console.error("Error saving settings:", _t4);
          showStatus("Error saving settings", "error");
        case 4:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 3]]);
  }));
  return _saveSettings.apply(this, arguments);
}
function enhanceCurrentPage() {
  showStatus("Processing current page...", "info");
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs && tabs[0]) {
      chrome.runtime.sendMessage({
        action: "enhanceContent",
        tabId: tabs[0].id
      }, function (response) {
        if (response && response.success) {
          showStatus("Page enhancement started", "success");
        } else {
          showStatus((response === null || response === void 0 ? void 0 : response.error) || "Failed to enhance page", "error");
        }
      });
    } else {
      showStatus("No active tab found", "error");
    }
  });
}

// Initialize resize functionality
function initResize(e) {
  e.preventDefault();
  var popup = document.body;
  var startWidth = popup.offsetWidth;
  var startHeight = popup.offsetHeight;
  var startX = e.clientX;
  var startY = e.clientY;
  if (elements.sizeIndicator) {
    elements.sizeIndicator.textContent = "".concat(startWidth, "\xD7").concat(startHeight);
    elements.sizeIndicator.classList.add("visible");
  }
  function resize(e) {
    var width = startWidth + (e.clientX - startX);
    var height = startHeight + (e.clientY - startY);

    // Apply minimum and maximum constraints
    var constrainedWidth = Math.max(300, Math.min(800, width));
    var constrainedHeight = Math.max(300, Math.min(600, height));
    popup.style.width = "".concat(constrainedWidth, "px");
    popup.style.height = "".concat(constrainedHeight, "px");
    if (elements.sizeIndicator) {
      elements.sizeIndicator.textContent = "".concat(constrainedWidth, "\xD7").concat(constrainedHeight);
    }
  }
  function stopResize() {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
    if (elements.sizeIndicator) {
      elements.sizeIndicator.classList.remove("visible");
    }

    // Save size preference
    var newWidth = popup.offsetWidth;
    var newHeight = popup.offsetHeight;
    chrome.storage.local.set({
      popupSize: {
        width: newWidth,
        height: newHeight
      }
    });
  }
  window.addEventListener("mousemove", resize);
  window.addEventListener("mouseup", stopResize);
}

// Show status message
function showStatus(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
  if (!elements.statusArea) {
    console.error("Status area element not found");
    return;
  }
  console.log("Status (".concat(type, "): ").concat(message));
  elements.statusArea.textContent = message;
  elements.statusArea.className = "status-area visible";
  if (type) {
    elements.statusArea.classList.add(type);
  }
  setTimeout(function () {
    elements.statusArea.classList.remove("visible");
  }, 3000);
}
})();

/******/ })()
;
//# sourceMappingURL=popup.js.map