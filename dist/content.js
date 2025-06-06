/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/content/FloatingUI.css":
/*!**************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/content/FloatingUI.css ***!
  \**************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* NovelSynth Floating UI Styles */
:root {
    --ns-primary-color: #667eea;
    --ns-primary-hover: #5a6fd1;
    --ns-primary-active: #4a5db7;
    --ns-text-color: #333;
    --ns-text-secondary: #666;
    --ns-background-color: #fff;
    --ns-surface-color: #f8f9fa;
    --ns-border-color: #ddd;
    --ns-error-color: #dc3545;
    --ns-success-color: #28a745;
    --ns-warning-color: #ffc107;
    --ns-info-color: #17a2b8;
    --ns-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --ns-radius: 8px;
    --button-position-x: calc(100vw - 70px);
    --button-position-y: calc(100vh - 70px);
}

.novelsynth-floating-ui {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--ns-text-color);
    pointer-events: none;
}

.novelsynth-floating-ui * {
    box-sizing: border-box;
}

/* Main button */
.novelsynth-main-button {
    position: fixed;
    top: 0;
    left: 0;
    transform: translate(var(--button-position-x), var(--button-position-y));
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--ns-primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--ns-shadow);
    transition: transform 0.2s ease, background-color 0.2s ease;
    pointer-events: auto;
    z-index: 10000;
}

.novelsynth-main-button:hover {
    background-color: var(--ns-primary-hover);
    transform: translate(var(--button-position-x), var(--button-position-y)) scale(1.05);
}

.novelsynth-main-button.active {
    background-color: var(--ns-primary-active);
}

.novelsynth-main-button.dragging {
    opacity: 0.8;
    cursor: grabbing;
}

.novelsynth-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.novelsynth-status {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 10px;
    height: 10px;
}

.novelsynth-status-dot {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #4caf50;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    }
}

/* Panel */
.novelsynth-panel {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 320px;
    background-color: var(--ns-background-color);
    border-radius: var(--ns-radius);
    box-shadow: var(--ns-shadow);
    overflow: hidden;
    pointer-events: auto;
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 9999;
    max-height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
}

.novelsynth-panel.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.novelsynth-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--ns-primary-color);
    color: white;
}

.novelsynth-panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.novelsynth-panel-title h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
}

.novelsynth-panel-title img {
    width: 20px;
    height: 20px;
}

.novelsynth-panel-actions {
    display: flex;
    gap: 8px;
}

.novelsynth-close-panel,
.novelsynth-settings-toggle {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 18px;
    padding: 0;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.novelsynth-close-panel:hover,
.novelsynth-settings-toggle:hover {
    opacity: 1;
}

.novelsynth-panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

/* Main view */
.novelsynth-content-type {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
}

.novelsynth-badge {
    display: inline-block;
    padding: 4px 8px;
    background-color: var(--ns-surface-color);
    border: 1px solid var(--ns-border-color);
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
}

.novelsynth-action-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

.novelsynth-action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid var(--ns-border-color);
    border-radius: var(--ns-radius);
    background-color: var(--ns-surface-color);
    color: var(--ns-text-color);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.novelsynth-action-btn.primary {
    background-color: var(--ns-primary-color);
    border-color: var(--ns-primary-color);
    color: white;
}

.novelsynth-action-btn:hover {
    border-color: var(--ns-primary-color);
}

.novelsynth-action-btn.primary:hover {
    background-color: var(--ns-primary-hover);
    border-color: var(--ns-primary-hover);
}

/* Quick settings */
.novelsynth-quick-settings {
    background-color: var(--ns-surface-color);
    border-radius: var(--ns-radius);
    padding: 12px;
    margin-bottom: 16px;
}

.novelsynth-slider-setting {
    margin-bottom: 12px;
}

.novelsynth-slider-setting label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
}

.novelsynth-value {
    color: var(--ns-primary-color);
    font-weight: 600;
}

.novelsynth-slider-setting input[type="range"] {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--ns-border-color);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.novelsynth-slider-setting input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--ns-primary-color);
    cursor: pointer;
}

.novelsynth-slider-setting input[type="range"]::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--ns-primary-color);
    cursor: pointer;
    border: none;
}

.novelsynth-model-select {
    margin-bottom: 4px;
}

.novelsynth-model-select label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
}

.novelsynth-model-select select {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--ns-border-color);
    border-radius: 4px;
    background-color: var(--ns-background-color);
    font-size: 13px;
    color: var(--ns-text-color);
    outline: none;
}

/* Progress bar */
.novelsynth-progress {
    height: 24px;
    border-radius: 12px;
    background-color: var(--ns-surface-color);
    position: relative;
    overflow: hidden;
    margin-top: 16px;
}

.novelsynth-progress-bar {
    height: 100%;
    width: 0;
    background-color: var(--ns-primary-color);
    transition: width 0.3s ease;
}

.novelsynth-progress-bar.error {
    background-color: var(--ns-error-color);
}

.novelsynth-progress-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Settings view */
.novelsynth-settings-view h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--ns-primary-color);
}

.novelsynth-setting-group {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--ns-border-color);
}

.novelsynth-setting-group h5 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 500;
}

.novelsynth-setting {
    margin-bottom: 12px;
}

.novelsynth-setting label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
}

.novelsynth-setting input[type="text"],
.novelsynth-setting input[type="number"],
.novelsynth-setting select,
.novelsynth-setting textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--ns-border-color);
    border-radius: 4px;
    background-color: var(--ns-background-color);
    font-size: 13px;
    color: var(--ns-text-color);
    outline: none;
}

.novelsynth-setting textarea {
    resize: vertical;
    min-height: 80px;
}

.novelsynth-setting input[type="checkbox"] {
    margin-right: 6px;
}

.novelsynth-small-btn {
    background: none;
    border: 1px solid var(--ns-border-color);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    color: var(--ns-text-color);
    cursor: pointer;
    transition: all 0.2s;
}

.novelsynth-small-btn:hover {
    border-color: var(--ns-primary-color);
    color: var(--ns-primary-color);
}

.novelsynth-small-btn.primary {
    background-color: var(--ns-primary-color);
    border-color: var(--ns-primary-color);
    color: white;
}

.novelsynth-small-btn.primary:hover {
    background-color: var(--ns-primary-hover);
    border-color: var(--ns-primary-hover);
}

.novelsynth-setting-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
}

/* Notification */
.novelsynth-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 8px 16px;
    border-radius: 4px;
    background-color: var(--ns-info-color);
    color: white;
    font-size: 14px;
    z-index: 10001;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.novelsynth-notification.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.novelsynth-notification-success {
    background-color: var(--ns-success-color);
}

.novelsynth-notification-error {
    background-color: var(--ns-error-color);
}

.novelsynth-notification-warning {
    background-color: var(--ns-warning-color);
    color: #333;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
    :root {
        --ns-text-color: #e8eaed;
        --ns-text-secondary: #9aa0a6;
        --ns-background-color: #202124;
        --ns-surface-color: #292a2d;
        --ns-border-color: #5f6368;
    }
}`, "",{"version":3,"sources":["webpack://./src/content/FloatingUI.css"],"names":[],"mappings":"AAAA,kCAAkC;AAClC;IACI,2BAA2B;IAC3B,2BAA2B;IAC3B,4BAA4B;IAC5B,qBAAqB;IACrB,yBAAyB;IACzB,2BAA2B;IAC3B,2BAA2B;IAC3B,uBAAuB;IACvB,yBAAyB;IACzB,2BAA2B;IAC3B,2BAA2B;IAC3B,wBAAwB;IACxB,0CAA0C;IAC1C,gBAAgB;IAChB,uCAAuC;IACvC,uCAAuC;AAC3C;;AAEA;IACI,eAAe;IACf,aAAa;IACb,MAAM;IACN,OAAO;IACP,sHAAsH;IACtH,eAAe;IACf,gBAAgB;IAChB,2BAA2B;IAC3B,oBAAoB;AACxB;;AAEA;IACI,sBAAsB;AAC1B;;AAEA,gBAAgB;AAChB;IACI,eAAe;IACf,MAAM;IACN,OAAO;IACP,wEAAwE;IACxE,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,yCAAyC;IACzC,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,eAAe;IACf,4BAA4B;IAC5B,2DAA2D;IAC3D,oBAAoB;IACpB,cAAc;AAClB;;AAEA;IACI,yCAAyC;IACzC,oFAAoF;AACxF;;AAEA;IACI,0CAA0C;AAC9C;;AAEA;IACI,YAAY;IACZ,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA;IACI,kBAAkB;IAClB,QAAQ;IACR,UAAU;IACV,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,cAAc;IACd,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,yBAAyB;IACzB,4BAA4B;AAChC;;AAEA;IACI;QACI,sBAAsB;QACtB,0CAA0C;IAC9C;;IAEA;QACI,mBAAmB;QACnB,0CAA0C;IAC9C;;IAEA;QACI,sBAAsB;QACtB,wCAAwC;IAC5C;AACJ;;AAEA,UAAU;AACV;IACI,eAAe;IACf,YAAY;IACZ,WAAW;IACX,YAAY;IACZ,4CAA4C;IAC5C,+BAA+B;IAC/B,4BAA4B;IAC5B,gBAAgB;IAChB,oBAAoB;IACpB,UAAU;IACV,uCAAuC;IACvC,kDAAkD;IAClD,aAAa;IACb,+BAA+B;IAC/B,aAAa;IACb,sBAAsB;AAC1B;;AAEA;IACI,UAAU;IACV,iCAAiC;AACrC;;AAEA;IACI,aAAa;IACb,8BAA8B;IAC9B,mBAAmB;IACnB,kBAAkB;IAClB,yCAAyC;IACzC,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;AACZ;;AAEA;IACI,SAAS;IACT,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,QAAQ;AACZ;;AAEA;;IAEI,gBAAgB;IAChB,YAAY;IACZ,YAAY;IACZ,eAAe;IACf,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,WAAW;IACX,YAAY;IACZ,eAAe;IACf,UAAU;IACV,YAAY;IACZ,wBAAwB;AAC5B;;AAEA;;IAEI,UAAU;AACd;;AAEA;IACI,OAAO;IACP,gBAAgB;IAChB,aAAa;AACjB;;AAEA,cAAc;AACd;IACI,mBAAmB;IACnB,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,qBAAqB;IACrB,gBAAgB;IAChB,yCAAyC;IACzC,wCAAwC;IACxC,mBAAmB;IACnB,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,QAAQ;IACR,mBAAmB;AACvB;;AAEA;IACI,OAAO;IACP,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,QAAQ;IACR,iBAAiB;IACjB,wCAAwC;IACxC,+BAA+B;IAC/B,yCAAyC;IACzC,2BAA2B;IAC3B,eAAe;IACf,gBAAgB;IAChB,eAAe;IACf,oBAAoB;AACxB;;AAEA;IACI,yCAAyC;IACzC,qCAAqC;IACrC,YAAY;AAChB;;AAEA;IACI,qCAAqC;AACzC;;AAEA;IACI,yCAAyC;IACzC,qCAAqC;AACzC;;AAEA,mBAAmB;AACnB;IACI,yCAAyC;IACzC,+BAA+B;IAC/B,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,8BAA8B;IAC9B,kBAAkB;IAClB,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,8BAA8B;IAC9B,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,WAAW;IACX,kBAAkB;IAClB,kCAAkC;IAClC,aAAa;IACb,wBAAwB;IACxB,gBAAgB;AACpB;;AAEA;IACI,wBAAwB;IACxB,gBAAgB;IAChB,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,mCAAmC;IACnC,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,mCAAmC;IACnC,eAAe;IACf,YAAY;AAChB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,cAAc;IACd,kBAAkB;IAClB,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,gBAAgB;IAChB,wCAAwC;IACxC,kBAAkB;IAClB,4CAA4C;IAC5C,eAAe;IACf,2BAA2B;IAC3B,aAAa;AACjB;;AAEA,iBAAiB;AACjB;IACI,YAAY;IACZ,mBAAmB;IACnB,yCAAyC;IACzC,kBAAkB;IAClB,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,YAAY;IACZ,QAAQ;IACR,yCAAyC;IACzC,2BAA2B;AAC/B;;AAEA;IACI,uCAAuC;AAC3C;;AAEA;IACI,kBAAkB;IAClB,MAAM;IACN,OAAO;IACP,QAAQ;IACR,SAAS;IACT,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,YAAY;IACZ,eAAe;IACf,gBAAgB;IAChB,yCAAyC;AAC7C;;AAEA,kBAAkB;AAClB;IACI,kBAAkB;IAClB,eAAe;IACf,gBAAgB;IAChB,8BAA8B;AAClC;;AAEA;IACI,mBAAmB;IACnB,oBAAoB;IACpB,+CAA+C;AACnD;;AAEA;IACI,kBAAkB;IAClB,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,cAAc;IACd,kBAAkB;IAClB,eAAe;IACf,gBAAgB;AACpB;;AAEA;;;;IAII,WAAW;IACX,YAAY;IACZ,wCAAwC;IACxC,kBAAkB;IAClB,4CAA4C;IAC5C,eAAe;IACf,2BAA2B;IAC3B,aAAa;AACjB;;AAEA;IACI,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;AACrB;;AAEA;IACI,gBAAgB;IAChB,wCAAwC;IACxC,kBAAkB;IAClB,gBAAgB;IAChB,eAAe;IACf,2BAA2B;IAC3B,eAAe;IACf,oBAAoB;AACxB;;AAEA;IACI,qCAAqC;IACrC,8BAA8B;AAClC;;AAEA;IACI,yCAAyC;IACzC,qCAAqC;IACrC,YAAY;AAChB;;AAEA;IACI,yCAAyC;IACzC,qCAAqC;AACzC;;AAEA;IACI,aAAa;IACb,8BAA8B;IAC9B,gBAAgB;AACpB;;AAEA,iBAAiB;AACjB;IACI,eAAe;IACf,YAAY;IACZ,SAAS;IACT,4CAA4C;IAC5C,iBAAiB;IACjB,kBAAkB;IAClB,sCAAsC;IACtC,YAAY;IACZ,eAAe;IACf,cAAc;IACd,UAAU;IACV,kDAAkD;IAClD,wCAAwC;AAC5C;;AAEA;IACI,UAAU;IACV,yCAAyC;AAC7C;;AAEA;IACI,yCAAyC;AAC7C;;AAEA;IACI,uCAAuC;AAC3C;;AAEA;IACI,yCAAyC;IACzC,WAAW;AACf;;AAEA,uBAAuB;AACvB;IACI;QACI,wBAAwB;QACxB,4BAA4B;QAC5B,8BAA8B;QAC9B,2BAA2B;QAC3B,0BAA0B;IAC9B;AACJ","sourcesContent":["/* NovelSynth Floating UI Styles */\r\n:root {\r\n    --ns-primary-color: #667eea;\r\n    --ns-primary-hover: #5a6fd1;\r\n    --ns-primary-active: #4a5db7;\r\n    --ns-text-color: #333;\r\n    --ns-text-secondary: #666;\r\n    --ns-background-color: #fff;\r\n    --ns-surface-color: #f8f9fa;\r\n    --ns-border-color: #ddd;\r\n    --ns-error-color: #dc3545;\r\n    --ns-success-color: #28a745;\r\n    --ns-warning-color: #ffc107;\r\n    --ns-info-color: #17a2b8;\r\n    --ns-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\r\n    --ns-radius: 8px;\r\n    --button-position-x: calc(100vw - 70px);\r\n    --button-position-y: calc(100vh - 70px);\r\n}\r\n\r\n.novelsynth-floating-ui {\r\n    position: fixed;\r\n    z-index: 9999;\r\n    top: 0;\r\n    left: 0;\r\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;\r\n    font-size: 14px;\r\n    line-height: 1.5;\r\n    color: var(--ns-text-color);\r\n    pointer-events: none;\r\n}\r\n\r\n.novelsynth-floating-ui * {\r\n    box-sizing: border-box;\r\n}\r\n\r\n/* Main button */\r\n.novelsynth-main-button {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    transform: translate(var(--button-position-x), var(--button-position-y));\r\n    width: 48px;\r\n    height: 48px;\r\n    border-radius: 50%;\r\n    background-color: var(--ns-primary-color);\r\n    color: white;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    cursor: pointer;\r\n    box-shadow: var(--ns-shadow);\r\n    transition: transform 0.2s ease, background-color 0.2s ease;\r\n    pointer-events: auto;\r\n    z-index: 10000;\r\n}\r\n\r\n.novelsynth-main-button:hover {\r\n    background-color: var(--ns-primary-hover);\r\n    transform: translate(var(--button-position-x), var(--button-position-y)) scale(1.05);\r\n}\r\n\r\n.novelsynth-main-button.active {\r\n    background-color: var(--ns-primary-active);\r\n}\r\n\r\n.novelsynth-main-button.dragging {\r\n    opacity: 0.8;\r\n    cursor: grabbing;\r\n}\r\n\r\n.novelsynth-icon {\r\n    width: 24px;\r\n    height: 24px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.novelsynth-status {\r\n    position: absolute;\r\n    top: 3px;\r\n    right: 3px;\r\n    width: 10px;\r\n    height: 10px;\r\n}\r\n\r\n.novelsynth-status-dot {\r\n    display: block;\r\n    width: 10px;\r\n    height: 10px;\r\n    border-radius: 50%;\r\n    background-color: #4caf50;\r\n    animation: pulse 2s infinite;\r\n}\r\n\r\n@keyframes pulse {\r\n    0% {\r\n        transform: scale(0.95);\r\n        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);\r\n    }\r\n\r\n    70% {\r\n        transform: scale(1);\r\n        box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);\r\n    }\r\n\r\n    100% {\r\n        transform: scale(0.95);\r\n        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);\r\n    }\r\n}\r\n\r\n/* Panel */\r\n.novelsynth-panel {\r\n    position: fixed;\r\n    bottom: 80px;\r\n    right: 20px;\r\n    width: 320px;\r\n    background-color: var(--ns-background-color);\r\n    border-radius: var(--ns-radius);\r\n    box-shadow: var(--ns-shadow);\r\n    overflow: hidden;\r\n    pointer-events: auto;\r\n    opacity: 0;\r\n    transform: translateY(20px) scale(0.95);\r\n    transition: opacity 0.3s ease, transform 0.3s ease;\r\n    z-index: 9999;\r\n    max-height: calc(100vh - 120px);\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n.novelsynth-panel.visible {\r\n    opacity: 1;\r\n    transform: translateY(0) scale(1);\r\n}\r\n\r\n.novelsynth-panel-header {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    padding: 12px 16px;\r\n    background-color: var(--ns-primary-color);\r\n    color: white;\r\n}\r\n\r\n.novelsynth-panel-title {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n}\r\n\r\n.novelsynth-panel-title h3 {\r\n    margin: 0;\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n}\r\n\r\n.novelsynth-panel-title img {\r\n    width: 20px;\r\n    height: 20px;\r\n}\r\n\r\n.novelsynth-panel-actions {\r\n    display: flex;\r\n    gap: 8px;\r\n}\r\n\r\n.novelsynth-close-panel,\r\n.novelsynth-settings-toggle {\r\n    background: none;\r\n    border: none;\r\n    color: white;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: 24px;\r\n    height: 24px;\r\n    font-size: 18px;\r\n    padding: 0;\r\n    opacity: 0.8;\r\n    transition: opacity 0.2s;\r\n}\r\n\r\n.novelsynth-close-panel:hover,\r\n.novelsynth-settings-toggle:hover {\r\n    opacity: 1;\r\n}\r\n\r\n.novelsynth-panel-content {\r\n    flex: 1;\r\n    overflow-y: auto;\r\n    padding: 16px;\r\n}\r\n\r\n/* Main view */\r\n.novelsynth-content-type {\r\n    margin-bottom: 16px;\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n.novelsynth-badge {\r\n    display: inline-block;\r\n    padding: 4px 8px;\r\n    background-color: var(--ns-surface-color);\r\n    border: 1px solid var(--ns-border-color);\r\n    border-radius: 16px;\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n}\r\n\r\n.novelsynth-action-buttons {\r\n    display: flex;\r\n    gap: 8px;\r\n    margin-bottom: 16px;\r\n}\r\n\r\n.novelsynth-action-btn {\r\n    flex: 1;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 6px;\r\n    padding: 8px 12px;\r\n    border: 1px solid var(--ns-border-color);\r\n    border-radius: var(--ns-radius);\r\n    background-color: var(--ns-surface-color);\r\n    color: var(--ns-text-color);\r\n    font-size: 13px;\r\n    font-weight: 500;\r\n    cursor: pointer;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.novelsynth-action-btn.primary {\r\n    background-color: var(--ns-primary-color);\r\n    border-color: var(--ns-primary-color);\r\n    color: white;\r\n}\r\n\r\n.novelsynth-action-btn:hover {\r\n    border-color: var(--ns-primary-color);\r\n}\r\n\r\n.novelsynth-action-btn.primary:hover {\r\n    background-color: var(--ns-primary-hover);\r\n    border-color: var(--ns-primary-hover);\r\n}\r\n\r\n/* Quick settings */\r\n.novelsynth-quick-settings {\r\n    background-color: var(--ns-surface-color);\r\n    border-radius: var(--ns-radius);\r\n    padding: 12px;\r\n    margin-bottom: 16px;\r\n}\r\n\r\n.novelsynth-slider-setting {\r\n    margin-bottom: 12px;\r\n}\r\n\r\n.novelsynth-slider-setting label {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    margin-bottom: 6px;\r\n    font-size: 13px;\r\n    font-weight: 500;\r\n}\r\n\r\n.novelsynth-value {\r\n    color: var(--ns-primary-color);\r\n    font-weight: 600;\r\n}\r\n\r\n.novelsynth-slider-setting input[type=\"range\"] {\r\n    width: 100%;\r\n    height: 4px;\r\n    border-radius: 2px;\r\n    background: var(--ns-border-color);\r\n    outline: none;\r\n    -webkit-appearance: none;\r\n    appearance: none;\r\n}\r\n\r\n.novelsynth-slider-setting input[type=\"range\"]::-webkit-slider-thumb {\r\n    -webkit-appearance: none;\r\n    appearance: none;\r\n    width: 14px;\r\n    height: 14px;\r\n    border-radius: 50%;\r\n    background: var(--ns-primary-color);\r\n    cursor: pointer;\r\n}\r\n\r\n.novelsynth-slider-setting input[type=\"range\"]::-moz-range-thumb {\r\n    width: 14px;\r\n    height: 14px;\r\n    border-radius: 50%;\r\n    background: var(--ns-primary-color);\r\n    cursor: pointer;\r\n    border: none;\r\n}\r\n\r\n.novelsynth-model-select {\r\n    margin-bottom: 4px;\r\n}\r\n\r\n.novelsynth-model-select label {\r\n    display: block;\r\n    margin-bottom: 6px;\r\n    font-size: 13px;\r\n    font-weight: 500;\r\n}\r\n\r\n.novelsynth-model-select select {\r\n    width: 100%;\r\n    padding: 6px 8px;\r\n    border: 1px solid var(--ns-border-color);\r\n    border-radius: 4px;\r\n    background-color: var(--ns-background-color);\r\n    font-size: 13px;\r\n    color: var(--ns-text-color);\r\n    outline: none;\r\n}\r\n\r\n/* Progress bar */\r\n.novelsynth-progress {\r\n    height: 24px;\r\n    border-radius: 12px;\r\n    background-color: var(--ns-surface-color);\r\n    position: relative;\r\n    overflow: hidden;\r\n    margin-top: 16px;\r\n}\r\n\r\n.novelsynth-progress-bar {\r\n    height: 100%;\r\n    width: 0;\r\n    background-color: var(--ns-primary-color);\r\n    transition: width 0.3s ease;\r\n}\r\n\r\n.novelsynth-progress-bar.error {\r\n    background-color: var(--ns-error-color);\r\n}\r\n\r\n.novelsynth-progress-text {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    color: white;\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n/* Settings view */\r\n.novelsynth-settings-view h4 {\r\n    margin: 0 0 16px 0;\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n    color: var(--ns-primary-color);\r\n}\r\n\r\n.novelsynth-setting-group {\r\n    margin-bottom: 20px;\r\n    padding-bottom: 16px;\r\n    border-bottom: 1px solid var(--ns-border-color);\r\n}\r\n\r\n.novelsynth-setting-group h5 {\r\n    margin: 0 0 12px 0;\r\n    font-size: 14px;\r\n    font-weight: 500;\r\n}\r\n\r\n.novelsynth-setting {\r\n    margin-bottom: 12px;\r\n}\r\n\r\n.novelsynth-setting label {\r\n    display: block;\r\n    margin-bottom: 6px;\r\n    font-size: 13px;\r\n    font-weight: 500;\r\n}\r\n\r\n.novelsynth-setting input[type=\"text\"],\r\n.novelsynth-setting input[type=\"number\"],\r\n.novelsynth-setting select,\r\n.novelsynth-setting textarea {\r\n    width: 100%;\r\n    padding: 8px;\r\n    border: 1px solid var(--ns-border-color);\r\n    border-radius: 4px;\r\n    background-color: var(--ns-background-color);\r\n    font-size: 13px;\r\n    color: var(--ns-text-color);\r\n    outline: none;\r\n}\r\n\r\n.novelsynth-setting textarea {\r\n    resize: vertical;\r\n    min-height: 80px;\r\n}\r\n\r\n.novelsynth-setting input[type=\"checkbox\"] {\r\n    margin-right: 6px;\r\n}\r\n\r\n.novelsynth-small-btn {\r\n    background: none;\r\n    border: 1px solid var(--ns-border-color);\r\n    border-radius: 4px;\r\n    padding: 4px 8px;\r\n    font-size: 12px;\r\n    color: var(--ns-text-color);\r\n    cursor: pointer;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.novelsynth-small-btn:hover {\r\n    border-color: var(--ns-primary-color);\r\n    color: var(--ns-primary-color);\r\n}\r\n\r\n.novelsynth-small-btn.primary {\r\n    background-color: var(--ns-primary-color);\r\n    border-color: var(--ns-primary-color);\r\n    color: white;\r\n}\r\n\r\n.novelsynth-small-btn.primary:hover {\r\n    background-color: var(--ns-primary-hover);\r\n    border-color: var(--ns-primary-hover);\r\n}\r\n\r\n.novelsynth-setting-actions {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    margin-top: 16px;\r\n}\r\n\r\n/* Notification */\r\n.novelsynth-notification {\r\n    position: fixed;\r\n    bottom: 20px;\r\n    left: 50%;\r\n    transform: translateX(-50%) translateY(20px);\r\n    padding: 8px 16px;\r\n    border-radius: 4px;\r\n    background-color: var(--ns-info-color);\r\n    color: white;\r\n    font-size: 14px;\r\n    z-index: 10001;\r\n    opacity: 0;\r\n    transition: opacity 0.3s ease, transform 0.3s ease;\r\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.novelsynth-notification.visible {\r\n    opacity: 1;\r\n    transform: translateX(-50%) translateY(0);\r\n}\r\n\r\n.novelsynth-notification-success {\r\n    background-color: var(--ns-success-color);\r\n}\r\n\r\n.novelsynth-notification-error {\r\n    background-color: var(--ns-error-color);\r\n}\r\n\r\n.novelsynth-notification-warning {\r\n    background-color: var(--ns-warning-color);\r\n    color: #333;\r\n}\r\n\r\n/* Dark theme support */\r\n@media (prefers-color-scheme: dark) {\r\n    :root {\r\n        --ns-text-color: #e8eaed;\r\n        --ns-text-secondary: #9aa0a6;\r\n        --ns-background-color: #202124;\r\n        --ns-surface-color: #292a2d;\r\n        --ns-border-color: #5f6368;\r\n    }\r\n}"],"sourceRoot":""}]);
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

/***/ "./src/content/FloatingUI.css":
/*!************************************!*\
  !*** ./src/content/FloatingUI.css ***!
  \************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_FloatingUI_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./FloatingUI.css */ "./node_modules/css-loader/dist/cjs.js!./src/content/FloatingUI.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_FloatingUI_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_FloatingUI_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_FloatingUI_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_FloatingUI_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/content/FloatingUI.js":
/*!***********************************!*\
  !*** ./src/content/FloatingUI.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FloatingUI_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FloatingUI.css */ "./src/content/FloatingUI.css");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
 * FloatingUI component for NovelSynth
 * Provides quick access to settings and controls from the bottom right corner of the page
 */


var FloatingUI = /*#__PURE__*/function () {
  function FloatingUI() {
    _classCallCheck(this, FloatingUI);
    this.container = null;
    this.visible = false;
    this.currentWebsiteType = "general"; // Default to general type
    this.settingsVisible = false;
    this.dragging = false;
    this.dragOffset = {
      x: 0,
      y: 0
    };
    this.detectWebsiteType();
  }
  /**
   * Initialize the floating UI
   */
  return _createClass(FloatingUI, [{
    key: "init",
    value: function init() {
      // Create main container
      this.container = document.createElement("div");
      this.container.className = "novelsynth-floating-ui";
      this.container.id = "novelsynth-floating-ui";

      // Create main button
      this.createMainButton();

      // Create panel content
      this.createPanelContent();

      // Add to DOM
      document.body.appendChild(this.container);

      // Set up event listeners
      this.setupEventListeners();

      // Load settings
      this.loadSettings();
    }

    /**
     * Handle clicks outside the floating UI
     */
  }, {
    key: "handleClickOutside",
    value: function handleClickOutside(event) {
      // If the panel is visible and the click is outside the container
      if (this.panelVisible && this.container && !this.container.contains(event.target)) {
        // Check if click is on the result container
        var resultContainer = document.querySelector(".novelsynth-result-container");
        if (!resultContainer || !resultContainer.contains(event.target)) {
          // Hide the panel, but not the result container
          this.togglePanel(false);
          event.stopPropagation();
        }
      }
    }

    /**
     * Create the main floating button
     */
  }, {
    key: "createMainButton",
    value: function createMainButton() {
      var button = document.createElement("div");
      button.className = "novelsynth-main-button";
      button.innerHTML = "\n      <div class=\"novelsynth-icon\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\">\n          <path fill=\"currentColor\" d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm.5-8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z\"/>\n        </svg>\n      </div>\n      <div class=\"novelsynth-status\">\n        <span class=\"novelsynth-status-dot\"></span>\n      </div>\n    ";
      this.container.appendChild(button);
      this.mainButton = button;
    }

    /**
     * Create the panel content
     */
  }, {
    key: "createPanelContent",
    value: function createPanelContent() {
      var panel = document.createElement("div");
      panel.className = "novelsynth-panel";
      panel.innerHTML = "\n      <div class=\"novelsynth-panel-header\">\n        <div class=\"novelsynth-panel-title\">\n          <img src=\"".concat(chrome.runtime.getURL("icons/icon32.svg"), "\" alt=\"NovelSynth\" />\n          <h3>NovelSynth</h3>\n        </div>\n        <div class=\"novelsynth-panel-actions\">\n          <button class=\"novelsynth-settings-toggle\" title=\"Settings\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\">\n              <path fill=\"currentColor\" d=\"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z\"/>\n            </svg>\n          </button>\n          <button class=\"novelsynth-close-panel\" title=\"Close\">\xD7</button>\n        </div>\n      </div>\n\n      <div class=\"novelsynth-panel-content\">\n        <div class=\"novelsynth-main-view\">\n          <div class=\"novelsynth-content-type\">\n            <div class=\"novelsynth-badge\" id=\"novelsynth-content-type-badge\">General</div>\n          </div>\n\n          <div class=\"novelsynth-action-buttons\">\n            <button id=\"novelsynth-enhance-btn\" class=\"novelsynth-action-btn primary\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\">\n                <path fill=\"currentColor\" d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"/>\n              </svg>\n              Enhance\n            </button>\n            <button id=\"novelsynth-summarize-btn\" class=\"novelsynth-action-btn\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\">\n                <path fill=\"currentColor\" d=\"M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z\"/>\n              </svg>\n              Summarize\n            </button>\n            <button id=\"novelsynth-analyze-btn\" class=\"novelsynth-action-btn\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\">\n                <path fill=\"currentColor\" d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z\"/>\n              </svg>\n              Analyze\n            </button>\n          </div>\n\n          <div class=\"novelsynth-quick-settings\">\n            <div class=\"novelsynth-slider-setting\">\n              <label>\n                Temperature\n                <span class=\"novelsynth-value\" id=\"novelsynth-temperature-value\">0.7</span>\n              </label>\n              <input type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" value=\"0.7\" id=\"novelsynth-temperature-slider\">\n            </div>\n\n            <div class=\"novelsynth-model-select\">\n              <label for=\"novelsynth-model-select\">Model</label>\n              <select id=\"novelsynth-model-select\">\n                <option value=\"gpt-3.5-turbo\">GPT-3.5 Turbo</option>\n                <option value=\"gpt-4o\" selected>GPT-4o</option>\n                <option value=\"gpt-4-turbo\">GPT-4 Turbo</option>\n              </select>\n            </div>\n          </div>\n\n          <div class=\"novelsynth-progress\" id=\"novelsynth-progress\" style=\"display: none;\">\n            <div class=\"novelsynth-progress-bar\" id=\"novelsynth-progress-bar\"></div>\n            <div class=\"novelsynth-progress-text\" id=\"novelsynth-progress-text\">Processing...</div>\n          </div>\n        </div>\n\n        <div class=\"novelsynth-settings-view\" style=\"display: none;\">\n          <h4>Settings</h4>\n\n          <div class=\"novelsynth-setting-group\">\n            <h5>Prompt Settings</h5>\n\n            <div class=\"novelsynth-setting\">\n              <label for=\"novelsynth-prompt-type\">Content Type</label>\n              <select id=\"novelsynth-prompt-type\">\n                <option value=\"novels\">Novels</option>\n                <option value=\"news\">News</option>\n                <option value=\"learning\">Learning</option>\n                <option value=\"general\">General</option>\n              </select>\n            </div>\n\n            <div class=\"novelsynth-setting\">\n              <label for=\"novelsynth-custom-prompt\">Custom Prompt</label>\n              <textarea id=\"novelsynth-custom-prompt\" rows=\"3\" placeholder=\"Enter your custom instructions here...\"></textarea>\n              <button id=\"novelsynth-reset-prompt\" class=\"novelsynth-small-btn\">Reset to Default</button>\n            </div>\n          </div>\n\n          <div class=\"novelsynth-setting-group\">\n            <h5>Advanced Options</h5>\n\n            <div class=\"novelsynth-setting\">\n              <label>\n                <input type=\"checkbox\" id=\"novelsynth-chunking-enabled\" checked>\n                Split large content\n              </label>\n            </div>\n\n            <div class=\"novelsynth-setting\">\n              <label>\n                <input type=\"checkbox\" id=\"novelsynth-emoji-enabled\">\n                Add emotional emojis\n              </label>\n            </div>\n\n            <div class=\"novelsynth-slider-setting\">\n              <label>\n                Max Output Length\n                <span class=\"novelsynth-value\" id=\"novelsynth-max-tokens-value\">8192</span>\n              </label>\n              <input type=\"range\" min=\"1000\" max=\"16000\" step=\"1000\" value=\"8192\" id=\"novelsynth-max-tokens-slider\">\n            </div>\n          </div>\n\n          <div class=\"novelsynth-setting-actions\">\n            <button id=\"novelsynth-open-full-settings\" class=\"novelsynth-small-btn\">Open Full Settings</button>\n            <button id=\"novelsynth-save-settings\" class=\"novelsynth-small-btn primary\">Save Settings</button>\n          </div>\n        </div>\n      </div>\n    ");
      this.container.appendChild(panel);
      this.panel = panel;
    }
    /**
     * Set up event listeners
     */
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      // Main button click
      this.mainButton.addEventListener("click", function () {
        _this.togglePanel();
      });

      // Make main button draggable
      this.mainButton.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return; // Only left click
        _this.startDrag(e);
      });
      document.addEventListener("mousemove", function (e) {
        if (_this.dragging) {
          _this.drag(e);
        }
      });
      document.addEventListener("mouseup", function () {
        if (_this.dragging) {
          _this.stopDrag();
        }
      });

      // Document click to close panel but not results
      document.addEventListener("click", function (e) {
        // If panel is visible and click is outside container
        if (_this.panelVisible && !_this.container.contains(e.target)) {
          // Check if it's also not on the result container
          var resultContainer = document.querySelector(".novelsynth-result-container");
          if (!resultContainer || !resultContainer.contains(e.target)) {
            _this.hidePanel();
          }
        }
      });

      // Panel buttons
      var closeButton = this.panel.querySelector(".novelsynth-close-panel");
      closeButton.addEventListener("click", function () {
        _this.hidePanel();
      });
      var settingsToggle = this.panel.querySelector(".novelsynth-settings-toggle");
      settingsToggle.addEventListener("click", function () {
        _this.toggleSettings();
      });

      // Action buttons
      var enhanceBtn = this.panel.querySelector("#novelsynth-enhance-btn");
      enhanceBtn.addEventListener("click", function () {
        _this.enhanceContent();
      });
      var summarizeBtn = this.panel.querySelector("#novelsynth-summarize-btn");
      summarizeBtn.addEventListener("click", function () {
        _this.summarizeContent();
      });
      var analyzeBtn = this.panel.querySelector("#novelsynth-analyze-btn");
      analyzeBtn.addEventListener("click", function () {
        _this.analyzeContent();
      });

      // Quick settings
      var temperatureSlider = this.panel.querySelector("#novelsynth-temperature-slider");
      temperatureSlider.addEventListener("input", function (e) {
        _this.updateTemperatureValue(e.target.value);
      });

      // Settings view
      var openFullSettings = this.panel.querySelector("#novelsynth-open-full-settings");
      openFullSettings.addEventListener("click", function () {
        chrome.runtime.sendMessage({
          action: "openPopup"
        });
      });
      var saveSettings = this.panel.querySelector("#novelsynth-save-settings");
      saveSettings.addEventListener("click", function () {
        _this.saveSettings();
      });
      var resetPrompt = this.panel.querySelector("#novelsynth-reset-prompt");
      resetPrompt.addEventListener("click", function () {
        _this.resetPromptToDefault();
      });
      var promptType = this.panel.querySelector("#novelsynth-prompt-type");
      promptType.addEventListener("change", function (e) {
        _this.changePromptType(e.target.value);
      });
    }

    /**
     * Toggle the panel visibility
     * @param {boolean} [show] - Force panel to show or hide
     */
  }, {
    key: "togglePanel",
    value: function togglePanel(show) {
      var panel = this.container.querySelector(".novelsynth-panel");
      if (!panel) return;

      // If show is provided, set panel visibility to that value
      if (typeof show !== "undefined") {
        this.panelVisible = show;
        panel.style.display = show ? "block" : "none";

        // Also toggle the active class on the main button
        var _button = this.container.querySelector(".novelsynth-main-button");
        if (_button) {
          if (show) {
            _button.classList.add("active");
          } else {
            _button.classList.remove("active");
          }
        }
        return;
      }

      // Toggle panel visibility
      this.panelVisible = !this.panelVisible;
      panel.style.display = this.panelVisible ? "block" : "none";

      // Also toggle the active class on the main button
      var button = this.container.querySelector(".novelsynth-main-button");
      if (button) {
        button.classList.toggle("active", this.panelVisible);
      }
    }

    /**
     * Show the panel
     */
  }, {
    key: "showPanel",
    value: function showPanel() {
      this.togglePanel(true);
    }

    /**
     * Hide the panel
     */
  }, {
    key: "hidePanel",
    value: function hidePanel() {
      this.togglePanel(false);

      // Also hide settings if open
      if (this.settingsVisible) {
        this.toggleSettings();
      }
    }

    /**
     * Toggle settings view
     */
  }, {
    key: "toggleSettings",
    value: function toggleSettings() {
      var mainView = this.panel.querySelector(".novelsynth-main-view");
      var settingsView = this.panel.querySelector(".novelsynth-settings-view");
      if (this.settingsVisible) {
        mainView.style.display = "block";
        settingsView.style.display = "none";
        this.settingsVisible = false;
      } else {
        mainView.style.display = "none";
        settingsView.style.display = "block";
        this.settingsVisible = true;
      }
    }

    /**
     * Start dragging the button
     */
  }, {
    key: "startDrag",
    value: function startDrag(e) {
      this.dragging = true;
      var rect = this.mainButton.getBoundingClientRect();
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      this.mainButton.classList.add("dragging");
    }

    /**
     * Handle dragging
     */
  }, {
    key: "drag",
    value: function drag(e) {
      if (!this.dragging) return;
      var x = e.clientX - this.dragOffset.x;
      var y = e.clientY - this.dragOffset.y;

      // Keep button within viewport
      var buttonSize = this.mainButton.offsetWidth;
      var maxX = window.innerWidth - buttonSize;
      var maxY = window.innerHeight - buttonSize;
      var boundedX = Math.max(0, Math.min(x, maxX));
      var boundedY = Math.max(0, Math.min(y, maxY));
      this.container.style.setProperty("--button-position-x", "".concat(boundedX, "px"));
      this.container.style.setProperty("--button-position-y", "".concat(boundedY, "px"));
    }

    /**
     * Stop dragging
     */
  }, {
    key: "stopDrag",
    value: function stopDrag() {
      this.dragging = false;
      this.mainButton.classList.remove("dragging");

      // Save position
      var style = getComputedStyle(this.container);
      var x = style.getPropertyValue("--button-position-x");
      var y = style.getPropertyValue("--button-position-y");
      chrome.storage.local.set({
        floatingButtonPosition: {
          x: x,
          y: y
        }
      });
    }

    /**
     * Detect website type
     */
  }, {
    key: "detectWebsiteType",
    value: function detectWebsiteType() {
      // Simple detection based on URL and page content
      var url = window.location.href;
      var content = document.body.textContent;

      // Check for novel sites
      if (url.includes("royalroad.com") || url.includes("wuxiaworld.com") || url.includes("webnovel.com") || url.includes("scribblehub.com") || url.includes("novelupdates.com") || content && content.length > 10000 && /chapter|volume|book/i.test(document.title)) {
        this.currentWebsiteType = "novels";
        return;
      }

      // Check for news sites
      if (url.includes("cnn.com") || url.includes("bbc.com") || url.includes("nytimes.com") || url.includes("reuters.com") || url.includes("theguardian.com") || url.includes("news.") || document.querySelector('article[data-category="news"]')) {
        this.currentWebsiteType = "news";
        return;
      }

      // Check for learning sites
      if (url.includes("coursera.org") || url.includes("udemy.com") || url.includes("edx.org") || url.includes("khanacademy.org") || url.includes("study.") || url.includes("learn.") || url.includes("course.") || document.querySelector(".course-content, .lesson-content")) {
        this.currentWebsiteType = "learning";
        return;
      }

      // Default to general
      this.currentWebsiteType = "general";
    }

    /**
     * Update temperature display value
     */
  }, {
    key: "updateTemperatureValue",
    value: function updateTemperatureValue(value) {
      var valueDisplay = this.panel.querySelector("#novelsynth-temperature-value");
      valueDisplay.textContent = value;
    }

    /**
     * Load settings from storage
     */
  }, {
    key: "loadSettings",
    value: (function () {
      var _loadSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var data, settings, prompts, posData, slider, modelSelect, _slider, valueDisplay, checkbox, _checkbox, promptTypeSelect, badge, customPrompt, _posData$floatingButt, x, y, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return new Promise(function (resolve) {
                chrome.storage.sync.get(["settings", "prompts"], resolve);
              });
            case 1:
              data = _context.v;
              settings = data.settings || {};
              prompts = data.prompts || {}; // Get floating button position
              _context.n = 2;
              return new Promise(function (resolve) {
                chrome.storage.local.get(["floatingButtonPosition"], resolve);
              });
            case 2:
              posData = _context.v;
              // Apply settings to UI
              if (settings.temperature) {
                slider = this.panel.querySelector("#novelsynth-temperature-slider");
                slider.value = settings.temperature;
                this.updateTemperatureValue(settings.temperature);
              }
              if (settings.model) {
                modelSelect = this.panel.querySelector("#novelsynth-model-select");
                if (modelSelect.querySelector("option[value=\"".concat(settings.model, "\"]"))) {
                  modelSelect.value = settings.model;
                }
              }
              if (settings.maxOutputTokens) {
                _slider = this.panel.querySelector("#novelsynth-max-tokens-slider");
                valueDisplay = this.panel.querySelector("#novelsynth-max-tokens-value");
                _slider.value = settings.maxOutputTokens;
                valueDisplay.textContent = settings.maxOutputTokens;
              }
              if (typeof settings.chunkingEnabled !== "undefined") {
                checkbox = this.panel.querySelector("#novelsynth-chunking-enabled");
                checkbox.checked = settings.chunkingEnabled;
              }
              if (typeof settings.useEmoji !== "undefined") {
                _checkbox = this.panel.querySelector("#novelsynth-emoji-enabled");
                _checkbox.checked = settings.useEmoji;
              }

              // Set content type based on website detection
              promptTypeSelect = this.panel.querySelector("#novelsynth-prompt-type");
              promptTypeSelect.value = this.currentWebsiteType;

              // Update badge
              badge = this.panel.querySelector("#novelsynth-content-type-badge");
              badge.textContent = this.currentWebsiteType.charAt(0).toUpperCase() + this.currentWebsiteType.slice(1);

              // Set custom prompt if available
              if (prompts && prompts[this.currentWebsiteType] && prompts[this.currentWebsiteType].enhance) {
                customPrompt = this.panel.querySelector("#novelsynth-custom-prompt");
                customPrompt.value = prompts[this.currentWebsiteType].enhance;
              }

              // Set button position if available
              if (posData.floatingButtonPosition) {
                _posData$floatingButt = posData.floatingButtonPosition, x = _posData$floatingButt.x, y = _posData$floatingButt.y;
                this.container.style.setProperty("--button-position-x", x);
                this.container.style.setProperty("--button-position-y", y);
              }
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              console.error("Error loading settings:", _t);
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[0, 3]]);
      }));
      function loadSettings() {
        return _loadSettings.apply(this, arguments);
      }
      return loadSettings;
    }()
    /**
     * Save settings to storage
     */
    )
  }, {
    key: "saveSettings",
    value: (function () {
      var _saveSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var temperature, model, maxOutputTokens, chunkingEnabled, useEmoji, promptType, customPrompt, data, settings, prompts, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.p = 0;
              // Get values from UI
              temperature = parseFloat(this.panel.querySelector("#novelsynth-temperature-slider").value);
              model = this.panel.querySelector("#novelsynth-model-select").value;
              maxOutputTokens = parseInt(this.panel.querySelector("#novelsynth-max-tokens-slider").value);
              chunkingEnabled = this.panel.querySelector("#novelsynth-chunking-enabled").checked;
              useEmoji = this.panel.querySelector("#novelsynth-emoji-enabled").checked;
              promptType = this.panel.querySelector("#novelsynth-prompt-type").value;
              customPrompt = this.panel.querySelector("#novelsynth-custom-prompt").value; // Get existing settings and prompts
              _context2.n = 1;
              return new Promise(function (resolve) {
                chrome.storage.sync.get(["settings", "prompts"], resolve);
              });
            case 1:
              data = _context2.v;
              settings = data.settings || {};
              prompts = data.prompts || {}; // Update settings
              settings.temperature = temperature;
              settings.model = model;
              settings.maxOutputTokens = maxOutputTokens;
              settings.chunkingEnabled = chunkingEnabled;
              settings.useEmoji = useEmoji;

              // Update prompts
              if (!prompts[promptType]) {
                prompts[promptType] = {};
              }
              prompts[promptType].enhance = customPrompt;

              // Save to storage
              _context2.n = 2;
              return new Promise(function (resolve) {
                chrome.storage.sync.set({
                  settings: settings,
                  prompts: prompts
                }, resolve);
              });
            case 2:
              // Show success message
              this.showNotification("Settings saved successfully", "success");
              _context2.n = 4;
              break;
            case 3:
              _context2.p = 3;
              _t2 = _context2.v;
              console.error("Error saving settings:", _t2);
              this.showNotification("Error saving settings", "error");
            case 4:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 3]]);
      }));
      function saveSettings() {
        return _saveSettings.apply(this, arguments);
      }
      return saveSettings;
    }()
    /**
     * Reset prompt to default
     */
    )
  }, {
    key: "resetPromptToDefault",
    value: function resetPromptToDefault() {
      var promptType = this.panel.querySelector("#novelsynth-prompt-type").value;
      var defaultPrompts = {
        novels: "Enhance this text to improve readability and flow while preserving the original meaning. Fix grammar, punctuation, and awkward phrasing. Make the narrative more engaging and natural-sounding.",
        news: "Enhance this news article to improve clarity and readability while preserving all factual information. Fix grammar, punctuation, and awkward phrasing. Maintain the journalistic tone.",
        learning: "Enhance this educational content to improve clarity and readability while preserving all instructional information. Make complex concepts easier to understand without oversimplifying.",
        general: "Enhance this text to improve readability and flow while preserving the original meaning. Fix grammar, punctuation, and awkward phrasing. Make the writing more clear and engaging."
      };
      var customPrompt = this.panel.querySelector("#novelsynth-custom-prompt");
      customPrompt.value = defaultPrompts[promptType] || defaultPrompts.general;
    }

    /**
     * Change prompt type
     */
  }, {
    key: "changePromptType",
    value: function changePromptType(type) {
      var _this2 = this;
      this.currentWebsiteType = type;

      // Update badge
      var badge = this.panel.querySelector("#novelsynth-content-type-badge");
      badge.textContent = type.charAt(0).toUpperCase() + type.slice(1);

      // Load prompt for this type
      chrome.storage.sync.get("prompts", function (data) {
        var prompts = data.prompts || {};
        var customPrompt = _this2.panel.querySelector("#novelsynth-custom-prompt");
        if (prompts[type] && prompts[type].enhance) {
          customPrompt.value = prompts[type].enhance;
        } else {
          // Reset to default for this type
          _this2.resetPromptToDefault();
        }
      });
    }

    /**
     * Enhance content
     */
  }, {
    key: "enhanceContent",
    value: function enhanceContent() {
      this.processContent("enhance");
    }

    /**
     * Summarize content
     */
  }, {
    key: "summarizeContent",
    value: function summarizeContent() {
      this.processContent("summarize");
    }

    /**
     * Analyze content
     */
  }, {
    key: "analyzeContent",
    value: function analyzeContent() {
      this.processContent("analyze");
    }

    /**
     * Process content with specified action
     */
  }, {
    key: "processContent",
    value: function processContent(action) {
      var _this3 = this;
      // Show progress bar
      var progress = this.panel.querySelector("#novelsynth-progress");
      var progressBar = this.panel.querySelector("#novelsynth-progress-bar");
      var progressText = this.panel.querySelector("#novelsynth-progress-text");
      progress.style.display = "block";
      progressBar.style.width = "5%";
      switch (action) {
        case "enhance":
          progressText.textContent = "Enhancing content...";
          break;
        case "summarize":
          progressText.textContent = "Summarizing content...";
          break;
        case "analyze":
          progressText.textContent = "Analyzing content...";
          break;
      }

      // Simulate progress
      var progressValue = 5;
      var progressInterval = setInterval(function () {
        if (progressValue < 90) {
          progressValue += Math.random() * 10;
          progressBar.style.width = "".concat(progressValue, "%");
        }
      }, 1000);

      // Send message to background script
      chrome.runtime.sendMessage({
        action: action + "Content",
        settings: {
          temperature: parseFloat(this.panel.querySelector("#novelsynth-temperature-slider").value),
          model: this.panel.querySelector("#novelsynth-model-select").value,
          maxOutputTokens: parseInt(this.panel.querySelector("#novelsynth-max-tokens-slider").value),
          chunkingEnabled: this.panel.querySelector("#novelsynth-chunking-enabled").checked,
          useEmoji: this.panel.querySelector("#novelsynth-emoji-enabled").checked,
          promptType: this.currentWebsiteType
        }
      }, function (response) {
        clearInterval(progressInterval);
        if (response && response.success) {
          progressBar.style.width = "100%";
          progressText.textContent = "Complete!";
          setTimeout(function () {
            progress.style.display = "none";
          }, 1500);
          _this3.showNotification("Content processed successfully", "success");
        } else {
          progressBar.style.width = "100%";
          progressText.textContent = "Error!";
          progressBar.classList.add("error");
          setTimeout(function () {
            progress.style.display = "none";
            progressBar.classList.remove("error");
          }, 3000);
          _this3.showNotification((response === null || response === void 0 ? void 0 : response.error) || "Error processing content", "error");
        }
      });
    }

    /**
     * Show a notification
     */
  }, {
    key: "showNotification",
    value: function showNotification(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
      // Check if notification element exists
      var notification = document.querySelector(".novelsynth-notification");
      if (!notification) {
        notification = document.createElement("div");
        notification.className = "novelsynth-notification";
        document.body.appendChild(notification);
      }
      notification.textContent = message;
      notification.className = "novelsynth-notification";
      notification.classList.add("novelsynth-notification-".concat(type));
      notification.classList.add("visible");
      setTimeout(function () {
        notification.classList.remove("visible");
      }, 3000);
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FloatingUI);

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
/*!********************************!*\
  !*** ./src/content/content.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FloatingUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FloatingUI */ "./src/content/FloatingUI.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (c = i[4] || 3, u = i[5] === e ? i[3] : i[5], i[4] = 3, i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Content script for NovelSynth extension
 * Handles content enhancement, summarization, and analysis
 */


// Store content and session state
var currentContent = "";
var selectedText = "";
var processingContent = false;
var floatingUI = null;

/**
 * Initialize the content script
 */
function initialize() {
  console.log("NovelSynth content script initialized");

  // Create the floating UI
  floatingUI = new _FloatingUI__WEBPACK_IMPORTED_MODULE_0__["default"]();
  floatingUI.init();

  // Listen for messages from popup or background script
  chrome.runtime.onMessage.addListener(handleMessage);

  // Handle messages from popup and background script
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Content script received message:", request.action);
    if (request.action === "getContentInfo") {
      // Get info about the current page content
      var contentInfo = {
        type: floatingUI.currentWebsiteType,
        url: window.location.href,
        title: document.title
      };
      sendResponse(contentInfo);
    }
    if (request.action === "processContent") {
      // Process the content with the provided settings
      var operation = request.operation,
        settings = request.settings,
        prompt = request.prompt;
      if (operation === "enhance") {
        floatingUI.enhanceContent();
        sendResponse({
          success: true
        });
      } else if (operation === "summarize") {
        floatingUI.summarizeContent();
        sendResponse({
          success: true
        });
      } else if (operation === "analyze") {
        floatingUI.analyzeContent();
        sendResponse({
          success: true
        });
      } else {
        sendResponse({
          success: false,
          error: "Unknown operation"
        });
      }
    }
    return true; // Keep the message channel open for async response
  });

  // Listen for text selection changes
  document.addEventListener("mouseup", handleTextSelection);

  // Add keyboard shortcut listener
  document.addEventListener("keydown", handleKeyboardShortcut);
}

/**
 * Handle messages from popup or background
 */
function handleMessage(message, sender, sendResponse) {
  switch (message.action) {
    case "enhanceContent":
      enhanceContent(sendResponse);
      return true;
    // Keep the message channel open for async response

    case "summarizeContent":
      summarizeContent(sendResponse);
      return true;
    case "analyzeContent":
      analyzeContent(sendResponse);
      return true;
    case "getSelectedText":
      sendResponse({
        selectedText: selectedText
      });
      break;
    case "getPageContent":
      getPageContent(sendResponse);
      return true;
  }
}

/**
 * Handle text selection
 */
function handleTextSelection() {
  var selection = window.getSelection();
  if (selection.toString().trim().length > 0) {
    selectedText = selection.toString();
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcut(e) {
  // Alt+E for enhance
  if (e.altKey && e.key === "e") {
    enhanceContent();
  }

  // Alt+S for summarize
  if (e.altKey && e.key === "s") {
    summarizeContent();
  }

  // Alt+A for analyze
  if (e.altKey && e.key === "a") {
    analyzeContent();
  }
}

/**
 * Get page content
 */
function getPageContent(sendResponse) {
  // Check if we have selected text
  if (selectedText.length > 100) {
    currentContent = selectedText;
    sendResponse({
      content: currentContent,
      source: "selection"
    });
    return;
  }

  // Find main content
  var article = findMainContent();
  if (article) {
    currentContent = article.innerText;
    sendResponse({
      content: currentContent,
      title: document.title,
      url: window.location.href,
      source: "article"
    });
  } else {
    // Fallback to body content
    currentContent = document.body.innerText;
    sendResponse({
      content: currentContent,
      title: document.title,
      url: window.location.href,
      source: "body"
    });
  }
}

/**
 * Find the main content element on the page
 */
function findMainContent() {
  // First, try to find common article elements
  var articleSelectors = ["article", '[role="article"]', ".post-content", ".article-content", ".entry-content", ".post-body", ".content-body", "#content", ".content", ".chapter-content", ".chapter-inner", ".chapter-text", ".chapter"];
  for (var _i = 0, _articleSelectors = articleSelectors; _i < _articleSelectors.length; _i++) {
    var selector = _articleSelectors[_i];
    var element = document.querySelector(selector);
    if (element) {
      return element;
    }
  }

  // Try to find the element with the most text
  var maxTextLength = 0;
  var mainElement = null;
  var contentElements = document.querySelectorAll("p, .p");
  var paragraphContainers = new Map();

  // Group paragraphs by their parent elements
  contentElements.forEach(function (el) {
    var parent = el.parentElement;
    if (!paragraphContainers.has(parent)) {
      paragraphContainers.set(parent, 0);
    }
    paragraphContainers.set(parent, paragraphContainers.get(parent) + el.innerText.length);
  });

  // Find the parent with the most text content
  paragraphContainers.forEach(function (textLength, element) {
    if (textLength > maxTextLength) {
      maxTextLength = textLength;
      mainElement = element;
    }
  });
  return mainElement;
}

/**
 * Enhance the content
 */
function enhanceContent(_x) {
  return _enhanceContent.apply(this, arguments);
}
/**
 * Summarize the content
 */
function _enhanceContent() {
  _enhanceContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(sendResponse) {
    var _prompts$contentType, _yield$Promise, settings, _yield$Promise2, prompts, contentType, enhancePrompt, enhancedContent, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!processingContent) {
            _context.n = 1;
            break;
          }
          if (sendResponse) sendResponse({
            success: false,
            error: "Already processing content"
          });
          return _context.a(2);
        case 1:
          processingContent = true;
          _context.p = 2;
          if (currentContent) {
            _context.n = 3;
            break;
          }
          _context.n = 3;
          return new Promise(function (resolve) {
            return getPageContent(resolve);
          });
        case 3:
          if (!(!currentContent || currentContent.length < 50)) {
            _context.n = 4;
            break;
          }
          if (sendResponse) sendResponse({
            success: false,
            error: "No substantial content found"
          });
          processingContent = false;
          return _context.a(2);
        case 4:
          _context.n = 5;
          return new Promise(function (resolve) {
            chrome.storage.sync.get("settings", resolve);
          });
        case 5:
          _yield$Promise = _context.v;
          settings = _yield$Promise.settings;
          _context.n = 6;
          return new Promise(function (resolve) {
            chrome.storage.sync.get("prompts", resolve);
          });
        case 6:
          _yield$Promise2 = _context.v;
          prompts = _yield$Promise2.prompts;
          // Detect content type if not specified
          contentType = detectContentType(); // Prepare the API request
          enhancePrompt = (prompts === null || prompts === void 0 || (_prompts$contentType = prompts[contentType]) === null || _prompts$contentType === void 0 ? void 0 : _prompts$contentType.enhance) || "Enhance this text to improve readability and flow while preserving the original meaning."; // Send the API request (this would normally go through the background script)
          // Here, we're simulating the response for demonstration purposes
          _context.n = 7;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          });
        case 7:
          // Process the result
          enhancedContent = "".concat(currentContent, "\n\n[Enhanced version would appear here in real implementation]"); // Display the result
          displayResult(enhancedContent, "enhanced");
          if (sendResponse) sendResponse({
            success: true
          });
          _context.n = 9;
          break;
        case 8:
          _context.p = 8;
          _t = _context.v;
          console.error("Error enhancing content:", _t);
          if (sendResponse) sendResponse({
            success: false,
            error: _t.message
          });
        case 9:
          _context.p = 9;
          processingContent = false;
          return _context.f(9);
        case 10:
          return _context.a(2);
      }
    }, _callee, null, [[2, 8, 9, 10]]);
  }));
  return _enhanceContent.apply(this, arguments);
}
function summarizeContent(_x2) {
  return _summarizeContent.apply(this, arguments);
}
/**
 * Analyze the content
 */
function _summarizeContent() {
  _summarizeContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(sendResponse) {
    var _prompts$contentType2, _yield$Promise3, settings, _yield$Promise4, prompts, contentType, summarizePrompt, summary, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (!processingContent) {
            _context2.n = 1;
            break;
          }
          if (sendResponse) sendResponse({
            success: false,
            error: "Already processing content"
          });
          return _context2.a(2);
        case 1:
          processingContent = true;
          _context2.p = 2;
          if (currentContent) {
            _context2.n = 3;
            break;
          }
          _context2.n = 3;
          return new Promise(function (resolve) {
            return getPageContent(resolve);
          });
        case 3:
          if (!(!currentContent || currentContent.length < 50)) {
            _context2.n = 4;
            break;
          }
          if (sendResponse) sendResponse({
            success: false,
            error: "No substantial content found"
          });
          processingContent = false;
          return _context2.a(2);
        case 4:
          _context2.n = 5;
          return new Promise(function (resolve) {
            chrome.storage.sync.get("settings", resolve);
          });
        case 5:
          _yield$Promise3 = _context2.v;
          settings = _yield$Promise3.settings;
          _context2.n = 6;
          return new Promise(function (resolve) {
            chrome.storage.sync.get("prompts", resolve);
          });
        case 6:
          _yield$Promise4 = _context2.v;
          prompts = _yield$Promise4.prompts;
          // Detect content type if not specified
          contentType = detectContentType(); // Prepare the API request
          summarizePrompt = (prompts === null || prompts === void 0 || (_prompts$contentType2 = prompts[contentType]) === null || _prompts$contentType2 === void 0 ? void 0 : _prompts$contentType2.summary) || "Summarize this text, focusing on the main points and key information."; // Send the API request (this would normally go through the background script)
          // Here, we're simulating the response for demonstration purposes
          _context2.n = 7;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          });
        case 7:
          // Process the result
          summary = "[Summary would appear here in real implementation]\n\nThis text covers the following key points:\n- Point 1\n- Point 2\n- Point 3"; // Display the result
          displayResult(summary, "summary");
          if (sendResponse) sendResponse({
            success: true
          });
          _context2.n = 9;
          break;
        case 8:
          _context2.p = 8;
          _t2 = _context2.v;
          console.error("Error summarizing content:", _t2);
          if (sendResponse) sendResponse({
            success: false,
            error: _t2.message
          });
        case 9:
          _context2.p = 9;
          processingContent = false;
          return _context2.f(9);
        case 10:
          return _context2.a(2);
      }
    }, _callee2, null, [[2, 8, 9, 10]]);
  }));
  return _summarizeContent.apply(this, arguments);
}
function analyzeContent(_x3) {
  return _analyzeContent.apply(this, arguments);
}
/**
 * Detect the type of content on the page
 */
function _analyzeContent() {
  _analyzeContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(sendResponse) {
    var _prompts$contentType3, _yield$Promise5, settings, _yield$Promise6, prompts, contentType, analysisPrompt, analysis, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (!processingContent) {
            _context3.n = 1;
            break;
          }
          if (sendResponse) sendResponse({
            success: false,
            error: "Already processing content"
          });
          return _context3.a(2);
        case 1:
          processingContent = true;
          _context3.p = 2;
          if (currentContent) {
            _context3.n = 3;
            break;
          }
          _context3.n = 3;
          return new Promise(function (resolve) {
            return getPageContent(resolve);
          });
        case 3:
          if (!(!currentContent || currentContent.length < 50)) {
            _context3.n = 4;
            break;
          }
          if (sendResponse) sendResponse({
            success: false,
            error: "No substantial content found"
          });
          processingContent = false;
          return _context3.a(2);
        case 4:
          _context3.n = 5;
          return new Promise(function (resolve) {
            chrome.storage.sync.get("settings", resolve);
          });
        case 5:
          _yield$Promise5 = _context3.v;
          settings = _yield$Promise5.settings;
          _context3.n = 6;
          return new Promise(function (resolve) {
            chrome.storage.sync.get("prompts", resolve);
          });
        case 6:
          _yield$Promise6 = _context3.v;
          prompts = _yield$Promise6.prompts;
          // Detect content type if not specified
          contentType = detectContentType(); // Prepare the API request
          analysisPrompt = (prompts === null || prompts === void 0 || (_prompts$contentType3 = prompts[contentType]) === null || _prompts$contentType3 === void 0 ? void 0 : _prompts$contentType3.analysis) || "Analyze this text focusing on: clarity, structure, style, and overall effectiveness of communication."; // Send the API request (this would normally go through the background script)
          // Here, we're simulating the response for demonstration purposes
          _context3.n = 7;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          });
        case 7:
          // Process the result
          analysis = "[Analysis would appear here in real implementation]\n\nStrengths:\n- Point 1\n- Point 2\n\nAreas for Improvement:\n- Point 1\n- Point 2\n\nOverall assessment: This content is well structured but could benefit from more concise language."; // Display the result
          displayResult(analysis, "analysis");
          if (sendResponse) sendResponse({
            success: true
          });
          _context3.n = 9;
          break;
        case 8:
          _context3.p = 8;
          _t3 = _context3.v;
          console.error("Error analyzing content:", _t3);
          if (sendResponse) sendResponse({
            success: false,
            error: _t3.message
          });
        case 9:
          _context3.p = 9;
          processingContent = false;
          return _context3.f(9);
        case 10:
          return _context3.a(2);
      }
    }, _callee3, null, [[2, 8, 9, 10]]);
  }));
  return _analyzeContent.apply(this, arguments);
}
function detectContentType() {
  var url = window.location.href;
  var content = document.body.textContent;

  // Check for novel sites
  if (url.includes("royalroad.com") || url.includes("wuxiaworld.com") || url.includes("webnovel.com") || url.includes("scribblehub.com") || url.includes("novelupdates.com") || content && content.length > 10000 && /chapter|volume|book/i.test(document.title)) {
    return "novels";
  }

  // Check for news sites
  if (url.includes("cnn.com") || url.includes("bbc.com") || url.includes("nytimes.com") || url.includes("reuters.com") || url.includes("theguardian.com") || url.includes("news.") || document.querySelector('article[data-category="news"]')) {
    return "news";
  }

  // Check for learning sites
  if (url.includes("coursera.org") || url.includes("udemy.com") || url.includes("edx.org") || url.includes("khanacademy.org") || url.includes("study.") || url.includes("learn.") || url.includes("course.") || document.querySelector(".course-content, .lesson-content")) {
    return "learning";
  }

  // Default to general
  return "general";
}

/**
 * Display the result in a floating window
 */
function displayResult(content, type) {
  // Check if a result container already exists
  var resultContainer = document.querySelector(".novelsynth-result-container");
  if (!resultContainer) {
    // Create result container
    resultContainer = document.createElement("div");
    resultContainer.className = "novelsynth-result-container";
    resultContainer.dataset.persistDisplay = "true"; // Flag to prevent auto-closing

    // Add styles
    var styles = document.createElement("style");
    styles.textContent = "\n      .novelsynth-result-container {\n        position: fixed;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n        width: 80%;\n        max-width: 800px;\n        max-height: 80vh;\n        background-color: white;\n        border-radius: 8px;\n        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n        z-index: 10000;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n      }\n\n      @media (prefers-color-scheme: dark) {\n        .novelsynth-result-container {\n          background-color: #292a2d;\n          color: #e8eaed;\n        }\n\n        .novelsynth-result-header {\n          background-color: #202124;\n        }\n      }\n\n      .novelsynth-result-header {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        padding: 12px 16px;\n        background-color: #f8f9fa;\n        border-bottom: 1px solid #ddd;\n      }\n\n      .novelsynth-result-title {\n        display: flex;\n        align-items: center;\n        gap: 8px;\n        font-weight: 500;\n        font-size: 16px;\n      }\n\n      .novelsynth-result-actions {\n        display: flex;\n        gap: 8px;\n      }\n\n      .novelsynth-result-close,\n      .novelsynth-result-copy {\n        background: none;\n        border: none;\n        cursor: pointer;\n        padding: 4px;\n        border-radius: 4px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      }\n\n      .novelsynth-result-close:hover,\n      .novelsynth-result-copy:hover {\n        background-color: rgba(0, 0, 0, 0.05);\n      }\n\n      .novelsynth-result-content {\n        padding: 16px;\n        overflow-y: auto;\n        flex: 1;\n        line-height: 1.5;\n        font-size: 15px;\n        white-space: pre-wrap;\n      }\n\n      .novelsynth-result-footer {\n        padding: 12px 16px;\n        border-top: 1px solid #ddd;\n        display: flex;\n        justify-content: space-between;\n        font-size: 12px;\n        color: #666;\n      }\n    ";
    document.head.appendChild(styles);

    // Create header
    var header = document.createElement("div");
    header.className = "novelsynth-result-header";
    var _title = document.createElement("div");
    _title.className = "novelsynth-result-title";

    // Set title based on type
    var _titleText;
    switch (type) {
      case "enhanced":
        _titleText = "Enhanced Content";
        break;
      case "summary":
        _titleText = "Content Summary";
        break;
      case "analysis":
        _titleText = "Content Analysis";
        break;
      default:
        _titleText = "NovelSynth Result";
    }
    _title.textContent = _titleText;
    header.appendChild(_title);
    var actions = document.createElement("div");
    actions.className = "novelsynth-result-actions";
    var copyButton = document.createElement("button");
    copyButton.className = "novelsynth-result-copy";
    copyButton.title = "Copy to clipboard";
    copyButton.innerHTML = "\n      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18\" height=\"18\">\n        <path fill=\"currentColor\" d=\"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z\"/>\n      </svg>\n    ";
    copyButton.addEventListener("click", function () {
      navigator.clipboard.writeText(content).then(function () {
        copyButton.innerHTML = "\n          <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18\" height=\"18\">\n            <path fill=\"#4caf50\" d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"/>\n          </svg>\n        ";
        setTimeout(function () {
          copyButton.innerHTML = "\n            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18\" height=\"18\">\n              <path fill=\"currentColor\" d=\"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z\"/>\n            </svg>\n          ";
        }, 2000);
      });
    });
    var closeButton = document.createElement("button");
    closeButton.className = "novelsynth-result-close";
    closeButton.title = "Close";
    closeButton.innerHTML = "\n      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18\" height=\"18\">\n        <path fill=\"currentColor\" d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>\n      </svg>\n    ";
    closeButton.addEventListener("click", function () {
      resultContainer.remove();
    });
    actions.appendChild(copyButton);
    actions.appendChild(closeButton);
    header.appendChild(actions);

    // Create content area
    var _contentArea = document.createElement("div");
    _contentArea.className = "novelsynth-result-content";

    // Create footer
    var footer = document.createElement("div");
    footer.className = "novelsynth-result-footer";
    footer.innerHTML = "\n      <div>Generated by NovelSynth</div>\n      <div>".concat(new Date().toLocaleString(), "</div>\n    ");

    // Add all elements to container
    resultContainer.appendChild(header);
    resultContainer.appendChild(_contentArea);
    resultContainer.appendChild(footer);

    // Add to DOM
    document.body.appendChild(resultContainer);
  }

  // Update content
  var contentArea = resultContainer.querySelector(".novelsynth-result-content");
  contentArea.textContent = content;

  // Update header title
  var title = resultContainer.querySelector(".novelsynth-result-title");

  // Set title based on type
  var titleText;
  switch (type) {
    case "enhanced":
      titleText = "Enhanced Content";
      break;
    case "summary":
      titleText = "Content Summary";
      break;
    case "analysis":
      titleText = "Content Analysis";
      break;
    default:
      titleText = "NovelSynth Result";
  }
  title.textContent = titleText;

  // Update footer time
  var timeElement = resultContainer.querySelector(".novelsynth-result-footer div:last-child");
  timeElement.textContent = new Date().toLocaleString();
}

// Initialize the content script
initialize();
})();

/******/ })()
;
//# sourceMappingURL=content.js.map