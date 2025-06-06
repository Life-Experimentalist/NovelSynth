/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/ContentDetector.js":
/*!**************************************!*\
  !*** ./src/utils/ContentDetector.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   detectContentType: () => (/* binding */ detectContentType),
/* harmony export */   detectWebsite: () => (/* binding */ detectWebsite)
/* harmony export */ });
/**
 * Utility for detecting content types
 */

// Keywords for different content types
var NOVEL_KEYWORDS = ["chapter", "novel", "story", "fiction", "book", "character", "plot"];
var NEWS_KEYWORDS = ["news", "article", "report", "journalist", "breaking", "press"];
var LEARNING_KEYWORDS = ["learn", "course", "education", "tutorial", "guide", "lesson"];

/**
 * Detect the type of content based on text analysis
 * @param {string} text - The content to analyze
 * @returns {string} - The detected content type: 'novels', 'news', 'learning', or 'general'
 */
var detectContentType = function detectContentType(text) {
  if (!text) return "general";

  // Convert to lowercase for easier matching
  var lowerText = text.toLowerCase();

  // Count keyword occurrences
  var novelScore = 0;
  var newsScore = 0;
  var learningScore = 0;

  // Check novel keywords
  NOVEL_KEYWORDS.forEach(function (keyword) {
    if (lowerText.includes(keyword)) {
      novelScore += 1;
    }
  });

  // Check news keywords
  NEWS_KEYWORDS.forEach(function (keyword) {
    if (lowerText.includes(keyword)) {
      newsScore += 1;
    }
  });

  // Check learning keywords
  LEARNING_KEYWORDS.forEach(function (keyword) {
    if (lowerText.includes(keyword)) {
      learningScore += 1;
    }
  });

  // Determine content type based on highest score
  if (novelScore > newsScore && novelScore > learningScore) {
    return "novels";
  } else if (newsScore > novelScore && newsScore > learningScore) {
    return "news";
  } else if (learningScore > novelScore && learningScore > newsScore) {
    return "learning";
  } else {
    return "general";
  }
};

/**
 * Detect the website type based on URL and page structure
 * @param {string} url - The URL to analyze
 * @returns {Object} - Website info object
 */
var detectWebsite = function detectWebsite(url) {
  try {
    var urlObj = new URL(url);
    var domain = urlObj.hostname.replace("www.", "");

    // Predefined popular sites
    var novelSites = ["royalroad.com", "wuxiaworld.com", "webnovel.com", "scribblehub.com", "novelupdates.com", "fanfiction.net", "archiveofourown.org"];
    var newsSites = ["cnn.com", "bbc.com", "nytimes.com", "reuters.com", "apnews.com", "washingtonpost.com", "theguardian.com", "huffpost.com"];
    var learningSites = ["coursera.org", "udemy.com", "khanacademy.org", "edx.org", "w3schools.com", "stackoverflow.com", "medium.com", "dev.to"];

    // Check against predefined sites
    if (novelSites.some(function (site) {
      return domain.includes(site);
    })) {
      return {
        site: domain,
        category: "novels",
        domain: domain
      };
    } else if (newsSites.some(function (site) {
      return domain.includes(site);
    })) {
      return {
        site: domain,
        category: "news",
        domain: domain
      };
    } else if (learningSites.some(function (site) {
      return domain.includes(site);
    })) {
      return {
        site: domain,
        category: "learning",
        domain: domain
      };
    }

    // Default to general
    return {
      site: domain,
      category: "general",
      domain: domain
    };
  } catch (error) {
    console.error("Error detecting website:", error);
    return {
      site: "unknown",
      category: "general",
      domain: "unknown"
    };
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  detectContentType: detectContentType,
  detectWebsite: detectWebsite
});

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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_StorageManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/StorageManager */ "./src/utils/StorageManager.js");
/* harmony import */ var _utils_ContentDetector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/ContentDetector */ "./src/utils/ContentDetector.js");
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
/**
 * Background script for NovelSynth extension
 * Handles API calls, storage management, and message routing
 */




// Define API clients
var apiClients = {
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    completionsEndpoint: "/chat/completions",
    modelsEndpoint: "/models",
    models: []
  },
  gemini: {
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1",
    completionsEndpoint: "/models/gemini-pro:generateContent",
    modelsEndpoint: "/models",
    models: []
  },
  claude: {
    name: "Anthropic Claude",
    baseUrl: "https://api.anthropic.com/v1",
    completionsEndpoint: "/messages",
    modelsEndpoint: "/models",
    models: []
  },
  local: {
    name: "Local Models",
    baseUrl: "http://localhost:11434/api",
    completionsEndpoint: "/generate",
    modelsEndpoint: "/models",
    models: []
  }
};

// Listen for installation or update
chrome.runtime.onInstalled.addListener(/*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(details) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(details.reason === "install")) {
            _context.n = 2;
            break;
          }
          console.log("NovelSynth extension installed");
          _context.n = 1;
          return initializeDefaultSettings();
        case 1:
          _context.n = 3;
          break;
        case 2:
          if (!(details.reason === "update")) {
            _context.n = 3;
            break;
          }
          console.log("NovelSynth extension updated");
          _context.n = 3;
          return updateSettings();
        case 3:
          return _context.a(2);
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Background received message:", message);
  switch (message.action) {
    case "enhanceContent":
      enhanceContent(message.settings).then(function (result) {
        return sendResponse({
          success: true,
          result: result
        });
      })["catch"](function (error) {
        return sendResponse({
          success: false,
          error: error.message
        });
      });
      return true;
    // Keep the message channel open for async response

    case "summarizeContent":
      summarizeContent(message.settings).then(function (result) {
        return sendResponse({
          success: true,
          result: result
        });
      })["catch"](function (error) {
        return sendResponse({
          success: false,
          error: error.message
        });
      });
      return true;
    case "analyzeContent":
      analyzeContent(message.settings).then(function (result) {
        return sendResponse({
          success: true,
          result: result
        });
      })["catch"](function (error) {
        return sendResponse({
          success: false,
          error: error.message
        });
      });
      return true;
    case "fetchModels":
      fetchModels(message.provider).then(function (models) {
        return sendResponse({
          success: true,
          models: models
        });
      })["catch"](function (error) {
        return sendResponse({
          success: false,
          error: error.message
        });
      });
      return true;
    case "testConnection":
      testConnection(message.provider, message.apiKey, message.endpoint).then(function (result) {
        return sendResponse({
          success: true,
          result: result
        });
      })["catch"](function (error) {
        return sendResponse({
          success: false,
          error: error.message
        });
      });
      return true;
    case "openPopup":
      openPopup();
      sendResponse({
        success: true
      });
      break;
    case "saveToLibrary":
      saveToLibrary(message.data).then(function () {
        return sendResponse({
          success: true
        });
      })["catch"](function (error) {
        return sendResponse({
          success: false,
          error: error.message
        });
      });
      return true;
  }
});

// Add message listener for popup actions
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "enhanceContent") {
    console.log("Background received enhance content request for tab:", request.tabId);

    // Get settings
    chrome.storage.sync.get(["settings", "prompts"], function (data) {
      var settings = data.settings || {};
      var prompts = data.prompts || {};

      // Determine content type and get appropriate prompt
      chrome.tabs.sendMessage(request.tabId, {
        action: "getContentInfo"
      }, function (contentInfo) {
        var _prompts$contentType;
        var contentType = (contentInfo === null || contentInfo === void 0 ? void 0 : contentInfo.type) || "general";
        var prompt = ((_prompts$contentType = prompts[contentType]) === null || _prompts$contentType === void 0 ? void 0 : _prompts$contentType.enhance) || "Enhance this text to improve readability.";

        // Send enhance request to content script
        chrome.tabs.sendMessage(request.tabId, {
          action: "processContent",
          operation: "enhance",
          settings: settings,
          prompt: prompt
        }, function (response) {
          sendResponse(response);
        });
      });
    });
    return true; // Keep the message channel open for async response
  }
});

// Initialize default settings
function initializeDefaultSettings() {
  return _initializeDefaultSettings.apply(this, arguments);
} // Update settings when extension updates
function _initializeDefaultSettings() {
  _initializeDefaultSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var defaultSettings, defaultPrompts, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          defaultSettings = {
            apiKey: "",
            model: "gpt-4o",
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            chunkingEnabled: true,
            chunkSize: 12000,
            useEmoji: false,
            showBanner: true,
            debugMode: false,
            customEndpoint: "",
            theme: "auto",
            accentColor: "#667eea"
          };
          defaultPrompts = {
            novels: {
              enhance: "Enhance this text to improve readability and flow while preserving the original meaning. Fix grammar, punctuation, and awkward phrasing. Make the narrative more engaging and natural-sounding.",
              summary: "Summarize this text, focusing on the main plot points, character development, and key events. Keep the summary concise but comprehensive.",
              analysis: "Analyze this text focusing on: writing style, character development, plot structure, themes, and overall quality. Provide constructive feedback."
            },
            news: {
              enhance: "Enhance this news article to improve clarity and readability while preserving all factual information. Fix grammar, punctuation, and awkward phrasing. Maintain the journalistic tone.",
              summary: "Summarize this news article, focusing on the key facts, main points, and essential details. Keep the summary objective and factual.",
              analysis: "Analyze this news article focusing on: clarity of reporting, factual presentation, balance of perspectives, and informational value."
            },
            learning: {
              enhance: "Enhance this educational content to improve clarity and readability while preserving all instructional information. Make complex concepts easier to understand without oversimplifying.",
              summary: "Summarize this educational content, focusing on key concepts, main points, and essential information. Structure the summary in a way that facilitates learning.",
              analysis: "Analyze this educational content focusing on: clarity of explanation, logical progression, educational value, and engagement level."
            },
            general: {
              enhance: "Enhance this text to improve readability and flow while preserving the original meaning. Fix grammar, punctuation, and awkward phrasing. Make the writing more clear and engaging.",
              summary: "Summarize this text, focusing on the main points and key information. Keep the summary concise but comprehensive.",
              analysis: "Analyze this text focusing on: clarity, structure, style, and overall effectiveness of communication."
            },
            permanent: 'Maintain all formatting from the original text including paragraph breaks, dialogue formatting, and any special text styles. Do not add "enhanced version" labels or any meta-commentary about the changes.'
          }; // Save default settings and prompts
          _context2.p = 1;
          _context2.n = 2;
          return chrome.storage.sync.set({
            settings: defaultSettings
          });
        case 2:
          _context2.n = 3;
          return chrome.storage.sync.set({
            prompts: defaultPrompts
          });
        case 3:
          console.log("Default settings and prompts initialized");
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t = _context2.v;
          console.error("Error initializing default settings:", _t);
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 4]]);
  }));
  return _initializeDefaultSettings.apply(this, arguments);
}
function updateSettings() {
  return _updateSettings.apply(this, arguments);
} // Enhance content
function _updateSettings() {
  _updateSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var _yield$chrome$storage, _yield$chrome$storage2, settings, updatedSettings, _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return chrome.storage.sync.get("settings");
        case 1:
          _yield$chrome$storage = _context3.v;
          _yield$chrome$storage2 = _yield$chrome$storage.settings;
          settings = _yield$chrome$storage2 === void 0 ? {} : _yield$chrome$storage2;
          // Add any new settings that might be missing
          updatedSettings = {
            apiKey: settings.apiKey || "",
            model: settings.model || "gpt-4o",
            temperature: settings.temperature || 0.7,
            topP: settings.topP || 0.95,
            topK: settings.topK || 40,
            maxOutputTokens: settings.maxOutputTokens || 8192,
            chunkingEnabled: settings.chunkingEnabled !== undefined ? settings.chunkingEnabled : true,
            chunkSize: settings.chunkSize || 12000,
            useEmoji: settings.useEmoji || false,
            showBanner: settings.showBanner !== undefined ? settings.showBanner : true,
            debugMode: settings.debugMode || false,
            customEndpoint: settings.customEndpoint || "",
            theme: settings.theme || "auto",
            accentColor: settings.accentColor || "#667eea"
          }; // Save updated settings
          _context3.n = 2;
          return chrome.storage.sync.set({
            settings: updatedSettings
          });
        case 2:
          console.log("Settings updated");
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t2 = _context3.v;
          console.error("Error updating settings:", _t2);
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 3]]);
  }));
  return _updateSettings.apply(this, arguments);
}
function enhanceContent(_x2) {
  return _enhanceContent.apply(this, arguments);
} // Summarize content
function _enhanceContent() {
  _enhanceContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(settings) {
    var _prompts$contentType2;
    var tabs, tabId, contentResponse, content, _yield$chrome$storage3, _yield$chrome$storage4, storedSettings, _yield$chrome$storage5, prompts, mergedSettings, contentType, enhancePrompt, permanentPrompt, finalPrompt;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return chrome.tabs.query({
            active: true,
            currentWindow: true
          });
        case 1:
          tabs = _context4.v;
          if (!(!tabs || tabs.length === 0)) {
            _context4.n = 2;
            break;
          }
          throw new Error("No active tab found");
        case 2:
          tabId = tabs[0].id; // Get content from the active tab
          _context4.n = 3;
          return chrome.tabs.sendMessage(tabId, {
            action: "getPageContent"
          });
        case 3:
          contentResponse = _context4.v;
          if (!(!contentResponse || !contentResponse.content)) {
            _context4.n = 4;
            break;
          }
          throw new Error("Failed to get page content");
        case 4:
          content = contentResponse.content; // Get settings
          _context4.n = 5;
          return chrome.storage.sync.get(["settings", "prompts"]);
        case 5:
          _yield$chrome$storage3 = _context4.v;
          _yield$chrome$storage4 = _yield$chrome$storage3.settings;
          storedSettings = _yield$chrome$storage4 === void 0 ? {} : _yield$chrome$storage4;
          _yield$chrome$storage5 = _yield$chrome$storage3.prompts;
          prompts = _yield$chrome$storage5 === void 0 ? {} : _yield$chrome$storage5;
          // Merge with provided settings
          mergedSettings = _objectSpread(_objectSpread({}, storedSettings), settings); // Get prompt based on content type
          contentType = (settings === null || settings === void 0 ? void 0 : settings.promptType) || "general";
          enhancePrompt = ((_prompts$contentType2 = prompts[contentType]) === null || _prompts$contentType2 === void 0 ? void 0 : _prompts$contentType2.enhance) || prompts.general.enhance;
          permanentPrompt = prompts.permanent || ""; // Combine prompts
          finalPrompt = "".concat(enhancePrompt, "\n\n").concat(permanentPrompt); // Process content through AI (implement the real API call here)
          // For demo purposes, we're returning the original content
          return _context4.a(2, {
            original: content,
            enhanced: "".concat(content, "\n\n[Enhanced version would appear here in real implementation]"),
            promptUsed: finalPrompt,
            model: mergedSettings.model,
            contentType: contentType
          });
      }
    }, _callee4);
  }));
  return _enhanceContent.apply(this, arguments);
}
function summarizeContent(_x3) {
  return _summarizeContent.apply(this, arguments);
} // Analyze content
function _summarizeContent() {
  _summarizeContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(settings) {
    var _prompts$contentType3;
    var tabs, tabId, contentResponse, content, _yield$chrome$storage6, _yield$chrome$storage7, storedSettings, _yield$chrome$storage8, prompts, mergedSettings, contentType, summaryPrompt;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return chrome.tabs.query({
            active: true,
            currentWindow: true
          });
        case 1:
          tabs = _context5.v;
          if (!(!tabs || tabs.length === 0)) {
            _context5.n = 2;
            break;
          }
          throw new Error("No active tab found");
        case 2:
          tabId = tabs[0].id; // Get content from the active tab
          _context5.n = 3;
          return chrome.tabs.sendMessage(tabId, {
            action: "getPageContent"
          });
        case 3:
          contentResponse = _context5.v;
          if (!(!contentResponse || !contentResponse.content)) {
            _context5.n = 4;
            break;
          }
          throw new Error("Failed to get page content");
        case 4:
          content = contentResponse.content; // Get settings
          _context5.n = 5;
          return chrome.storage.sync.get(["settings", "prompts"]);
        case 5:
          _yield$chrome$storage6 = _context5.v;
          _yield$chrome$storage7 = _yield$chrome$storage6.settings;
          storedSettings = _yield$chrome$storage7 === void 0 ? {} : _yield$chrome$storage7;
          _yield$chrome$storage8 = _yield$chrome$storage6.prompts;
          prompts = _yield$chrome$storage8 === void 0 ? {} : _yield$chrome$storage8;
          // Merge with provided settings
          mergedSettings = _objectSpread(_objectSpread({}, storedSettings), settings); // Get prompt based on content type
          contentType = (settings === null || settings === void 0 ? void 0 : settings.promptType) || "general";
          summaryPrompt = ((_prompts$contentType3 = prompts[contentType]) === null || _prompts$contentType3 === void 0 ? void 0 : _prompts$contentType3.summary) || prompts.general.summary; // Process content through AI (implement the real API call here)
          // For demo purposes, we're returning a mock summary
          return _context5.a(2, {
            original: content,
            summary: "[Summary would appear here in real implementation]\n\nThis text covers the following key points:\n- Point 1\n- Point 2\n- Point 3",
            promptUsed: summaryPrompt,
            model: mergedSettings.model,
            contentType: contentType
          });
      }
    }, _callee5);
  }));
  return _summarizeContent.apply(this, arguments);
}
function analyzeContent(_x4) {
  return _analyzeContent.apply(this, arguments);
} // Fetch available models from an API provider
function _analyzeContent() {
  _analyzeContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(settings) {
    var _prompts$contentType4;
    var tabs, tabId, contentResponse, content, _yield$chrome$storage9, _yield$chrome$storage0, storedSettings, _yield$chrome$storage1, prompts, mergedSettings, contentType, analysisPrompt;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return chrome.tabs.query({
            active: true,
            currentWindow: true
          });
        case 1:
          tabs = _context6.v;
          if (!(!tabs || tabs.length === 0)) {
            _context6.n = 2;
            break;
          }
          throw new Error("No active tab found");
        case 2:
          tabId = tabs[0].id; // Get content from the active tab
          _context6.n = 3;
          return chrome.tabs.sendMessage(tabId, {
            action: "getPageContent"
          });
        case 3:
          contentResponse = _context6.v;
          if (!(!contentResponse || !contentResponse.content)) {
            _context6.n = 4;
            break;
          }
          throw new Error("Failed to get page content");
        case 4:
          content = contentResponse.content; // Get settings
          _context6.n = 5;
          return chrome.storage.sync.get(["settings", "prompts"]);
        case 5:
          _yield$chrome$storage9 = _context6.v;
          _yield$chrome$storage0 = _yield$chrome$storage9.settings;
          storedSettings = _yield$chrome$storage0 === void 0 ? {} : _yield$chrome$storage0;
          _yield$chrome$storage1 = _yield$chrome$storage9.prompts;
          prompts = _yield$chrome$storage1 === void 0 ? {} : _yield$chrome$storage1;
          // Merge with provided settings
          mergedSettings = _objectSpread(_objectSpread({}, storedSettings), settings); // Get prompt based on content type
          contentType = (settings === null || settings === void 0 ? void 0 : settings.promptType) || "general";
          analysisPrompt = ((_prompts$contentType4 = prompts[contentType]) === null || _prompts$contentType4 === void 0 ? void 0 : _prompts$contentType4.analysis) || prompts.general.analysis; // Process content through AI (implement the real API call here)
          // For demo purposes, we're returning a mock analysis
          return _context6.a(2, {
            original: content,
            analysis: "[Analysis would appear here in real implementation]\n\nStrengths:\n- Point 1\n- Point 2\n\nAreas for Improvement:\n- Point 1\n- Point 2\n\nOverall assessment: This content is well structured but could benefit from more concise language.",
            promptUsed: analysisPrompt,
            model: mergedSettings.model,
            contentType: contentType
          });
      }
    }, _callee6);
  }));
  return _analyzeContent.apply(this, arguments);
}
function fetchModels(_x5) {
  return _fetchModels.apply(this, arguments);
} // Test connection to an API provider
function _fetchModels() {
  _fetchModels = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(provider) {
    var _yield$chrome$storage10, _yield$chrome$storage11, modelConfig, _modelConfig$provider, apiKey, endpoint, apiClient, baseUrl, url, _t3;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return chrome.storage.sync.get("modelConfig");
        case 1:
          _yield$chrome$storage10 = _context7.v;
          _yield$chrome$storage11 = _yield$chrome$storage10.modelConfig;
          modelConfig = _yield$chrome$storage11 === void 0 ? {} : _yield$chrome$storage11;
          if (modelConfig[provider]) {
            _context7.n = 2;
            break;
          }
          throw new Error("No configuration found for ".concat(provider));
        case 2:
          _modelConfig$provider = modelConfig[provider], apiKey = _modelConfig$provider.apiKey, endpoint = _modelConfig$provider.endpoint;
          if (!(!apiKey && provider !== "local")) {
            _context7.n = 3;
            break;
          }
          throw new Error("API key required for ".concat(provider));
        case 3:
          apiClient = apiClients[provider];
          if (apiClient) {
            _context7.n = 4;
            break;
          }
          throw new Error("Unknown provider: ".concat(provider));
        case 4:
          baseUrl = endpoint || apiClient.baseUrl;
          url = "".concat(baseUrl).concat(apiClient.modelsEndpoint); // For demo purposes, return mock models
          // In a real implementation, you would fetch models from the API
          _t3 = provider;
          _context7.n = _t3 === "openai" ? 5 : _t3 === "gemini" ? 6 : _t3 === "claude" ? 7 : _t3 === "local" ? 8 : 9;
          break;
        case 5:
          return _context7.a(2, ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"]);
        case 6:
          return _context7.a(2, ["gemini-1.0-pro", "gemini-1.0-ultra"]);
        case 7:
          return _context7.a(2, ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]);
        case 8:
          return _context7.a(2, ["llama3-8b", "mistral-7b", "vicuna-13b"]);
        case 9:
          return _context7.a(2, []);
        case 10:
          return _context7.a(2);
      }
    }, _callee7);
  }));
  return _fetchModels.apply(this, arguments);
}
function testConnection(_x6, _x7, _x8) {
  return _testConnection.apply(this, arguments);
} // Open the extension popup
function _testConnection() {
  _testConnection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(provider, apiKey, endpoint) {
    var apiClient;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          apiClient = apiClients[provider];
          if (apiClient) {
            _context8.n = 1;
            break;
          }
          throw new Error("Unknown provider: ".concat(provider));
        case 1:
          if (!(!apiKey && provider !== "local")) {
            _context8.n = 2;
            break;
          }
          throw new Error("API key required for ".concat(provider));
        case 2:
          return _context8.a(2, {
            status: "connected",
            provider: apiClient.name,
            endpoint: endpoint || apiClient.baseUrl
          });
      }
    }, _callee8);
  }));
  return _testConnection.apply(this, arguments);
}
function openPopup() {
  chrome.windows.getCurrent(function (win) {
    chrome.action.openPopup({
      windowId: win.id
    });
  });
}

// Save content to library
function saveToLibrary(_x9) {
  return _saveToLibrary.apply(this, arguments);
}
function _saveToLibrary() {
  _saveToLibrary = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(data) {
    var _yield$chrome$storage12, _yield$chrome$storage13, contentHistory, _t4;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          if (!(!data || !data.content || !data.url)) {
            _context9.n = 1;
            break;
          }
          throw new Error("Invalid data");
        case 1:
          _context9.p = 1;
          _context9.n = 2;
          return chrome.storage.local.get("contentHistory");
        case 2:
          _yield$chrome$storage12 = _context9.v;
          _yield$chrome$storage13 = _yield$chrome$storage12.contentHistory;
          contentHistory = _yield$chrome$storage13 === void 0 ? {} : _yield$chrome$storage13;
          // Add new entry
          contentHistory[data.url] = _objectSpread(_objectSpread({}, data), {}, {
            lastAccessed: Date.now()
          });

          // Save updated history
          _context9.n = 3;
          return chrome.storage.local.set({
            contentHistory: contentHistory
          });
        case 3:
          return _context9.a(2, {
            success: true,
            message: "Content saved to library"
          });
        case 4:
          _context9.p = 4;
          _t4 = _context9.v;
          console.error("Error saving to library:", _t4);
          throw _t4;
        case 5:
          return _context9.a(2);
      }
    }, _callee9, null, [[1, 4]]);
  }));
  return _saveToLibrary.apply(this, arguments);
}
})();

/******/ })()
;
//# sourceMappingURL=background.js.map