/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = readFromConsumerApi;
function readFromConsumerApi(key) {
    return function () {
        if (window['@Neos:HostPluginAPI'] && window['@Neos:HostPluginAPI']['@' + key]) {
            var _window$NeosHostPlu;

            return (_window$NeosHostPlu = window['@Neos:HostPluginAPI'])['@' + key].apply(_window$NeosHostPlu, arguments);
        }

        throw new Error('You are trying to read from a consumer api that hasn\'t been initialized yet!');
    };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('vendor')().React;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('vendor')().PropTypes;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _neosUiExtensibility = __webpack_require__(5);

var _neosUiExtensibility2 = _interopRequireDefault(_neosUiExtensibility);

var _Repeatable = __webpack_require__(9);

var _Repeatable2 = _interopRequireDefault(_Repeatable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _neosUiExtensibility2.default)('Mireo.RepeatableFields:RepeatableField', {}, function (globalRegistry) {
    var editorsRegistry = globalRegistry.get('inspector').get('editors');

    editorsRegistry.set('Mireo.RepeatableFields/Inspector/Editors/RepeatableFieldEditor', {
        component: _Repeatable2.default
    });
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createConsumerApi = undefined;

var _createConsumerApi = __webpack_require__(6);

var _createConsumerApi2 = _interopRequireDefault(_createConsumerApi);

var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _readFromConsumerApi2.default)('manifest');
exports.createConsumerApi = _createConsumerApi2.default;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createConsumerApi;

var _package = __webpack_require__(7);

var _manifest = __webpack_require__(8);

var _manifest2 = _interopRequireDefault(_manifest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createReadOnlyValue = function createReadOnlyValue(value) {
    return {
        value: value,
        writable: false,
        enumerable: false,
        configurable: true
    };
};

function createConsumerApi(manifests, exposureMap) {
    var api = {};

    Object.keys(exposureMap).forEach(function (key) {
        Object.defineProperty(api, key, createReadOnlyValue(exposureMap[key]));
    });

    Object.defineProperty(api, '@manifest', createReadOnlyValue((0, _manifest2.default)(manifests)));

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
    Object.defineProperty(window['@Neos:HostPluginAPI'], 'VERSION', createReadOnlyValue(_package.version));
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {"name":"@neos-project/neos-ui-extensibility","version":"1.0.14","description":"Extensibility mechanisms for the Neos CMS UI","main":"./src/index.js","scripts":{"prebuild":"check-dependencies && yarn clean","test":"yarn jest -- -w 2 --coverage","test:watch":"yarn jest -- --watch","build":"exit 0","build:watch":"exit 0","clean":"rimraf ./lib ./dist","lint":"eslint src","jest":"NODE_ENV=test jest"},"devDependencies":{"@neos-project/babel-preset-neos-ui":"1.0.14","@neos-project/jest-preset-neos-ui":"1.0.14"},"dependencies":{"@neos-project/build-essentials":"1.0.14","@neos-project/positional-array-sorter":"1.0.14","babel-core":"^6.13.2","babel-eslint":"^7.1.1","babel-loader":"^7.1.2","babel-plugin-transform-decorators-legacy":"^1.3.4","babel-plugin-transform-object-rest-spread":"^6.20.1","babel-plugin-webpack-alias":"^2.1.1","babel-preset-es2015":"^6.13.2","babel-preset-react":"^6.3.13","babel-preset-stage-0":"^6.3.13","chalk":"^1.1.3","css-loader":"^0.28.4","file-loader":"^1.1.5","json-loader":"^0.5.4","postcss-loader":"^2.0.10","react-dev-utils":"^0.5.0","style-loader":"^0.19.0"},"bin":{"neos-react-scripts":"./bin/neos-react-scripts.js"},"jest":{"preset":"@neos-project/jest-preset-neos-ui"}}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (manifests) {
    return function manifest(identifier, options, bootstrap) {
        manifests.push(_defineProperty({}, identifier, {
            options: options,
            bootstrap: bootstrap
        }));
    };
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _style = __webpack_require__(10);

var _style2 = _interopRequireDefault(_style);

var _neosUiDecorators = __webpack_require__(15);

var _plowJs = __webpack_require__(16);

var _neosUiReduxStore = __webpack_require__(17);

var _reactRedux = __webpack_require__(18);

var _reactSortableHoc = __webpack_require__(19);

var _neosUiBackendConnector = __webpack_require__(21);

var _neosUiBackendConnector2 = _interopRequireDefault(_neosUiBackendConnector);

var _arrayMove = __webpack_require__(22);

var _arrayMove2 = _interopRequireDefault(_arrayMove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SortableItem = (0, _reactSortableHoc.sortableElement)(function (_ref) {
    var value = _ref.value;
    return _react2.default.createElement(
        'div',
        null,
        value
    );
});

var SortableContainer = (0, _reactSortableHoc.sortableContainer)(function (_ref2) {
    var children = _ref2.children;

    return _react2.default.createElement(
        'div',
        null,
        children
    );
});

var defaultOptions = {
    autoFocus: false,
    disabled: false,
    maxlength: null,
    readonly: false,
    buttonAddLabel: 'Add row',
    controls: {
        move: true,
        remove: true,
        add: true
    }
};

var RepeatableField = (_dec = (0, _neosUiDecorators.neos)(function (globalRegistry) {
    return {
        i18nRegistry: globalRegistry.get('i18n'),
        secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors')
    };
}), _dec(_class = (_temp = _class2 = function (_PureComponent) {
    _inherits(RepeatableField, _PureComponent);

    function RepeatableField(props) {
        _classCallCheck(this, RepeatableField);

        // this.endpoint = false;
        // this.state = {
        //     fields: []
        // };
        var _this = _possibleConstructorReturn(this, (RepeatableField.__proto__ || Object.getPrototypeOf(RepeatableField)).call(this, props));

        _this.init = function () {
            var options = _this.props.options;

            _this.options = Object.assign({}, defaultOptions, options);
            // this.handleValueChange(value);
            _this.getFromEndpoint();
        };

        _this.getEmptyValue = function () {
            if (_this.empytValue) return _this.empytValue;
            var options = _this.props.options;

            var fields = options.fields;
            var length = fields.length;
            _this.empytValue = {};
            Object.keys(fields).map(function (value) {
                _this.empytValue[value] = '';
            });
            return _this.empytValue;
        };

        _this.handleAdd = function () {
            var value = _this.getValue();

            value = [].concat(_toConsumableArray(value), [_this.getEmptyValue()]);
            _this.handleValueChange(value);
        };

        _this.handleRemove = function (idx) {
            var value = _this.getValue().filter(function (s, sidx) {
                return idx !== sidx;
            });
            _this.handleValueChange(value);
        };

        _this.repetableWrapper = function (idx) {
            var options = _this.options;


            var DragHandle = (0, _reactSortableHoc.sortableHandle)(function () {
                return _react2.default.createElement(
                    'span',
                    { type: 'button', className: _style2.default['btn-move'] },
                    '='
                );
            });

            return _react2.default.createElement(
                'div',
                { className: _style2.default['repeatable-wrapper'] },
                options.controls.move && _this.getValue().length > 1 ? _react2.default.createElement(DragHandle, null) : '',
                _react2.default.createElement(
                    'div',
                    { className: _style2.default['repeatable-field-wrapper'] },
                    Object.keys(options.fields).map(function (identifier) {
                        return _this.getEditorDefinition(idx, identifier);
                    })
                ),
                options.controls.remove ? _react2.default.createElement(
                    'button',
                    { type: 'button', onClick: function onClick() {
                            return _this.handleRemove(idx);
                        }, className: _style2.default['btn-delete'] },
                    '-'
                ) : ''
            );
        };

        _this.onSortEnd = function (_ref3) {
            var oldIndex = _ref3.oldIndex,
                newIndex = _ref3.newIndex;

            _this.handleValueChange((0, _arrayMove2.default)(_this.getValue(), oldIndex, newIndex));
        };

        _this.init();
        return _this;
    }

    _createClass(RepeatableField, [{
        key: 'getFromEndpoint',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _this2 = this;

                var params, dataSource;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(!(0, _plowJs.$get)('options.endpointData.url', this.props) && !(0, _plowJs.$get)('options.endpointData.dataSourceIdentifier', this.props))) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 2:
                                params = (0, _plowJs.$get)('options.endpointData.params', this.props);

                                if ((0, _plowJs.$get)('options.endpointData.dataSourceIdentifier', this.props)) params['node'] = sessionStorage['Neos.Neos.lastVisitedNode'];
                                dataSource = _neosUiBackendConnector2.default.get().endpoints.dataSource;

                                dataSource((0, _plowJs.$get)('options.endpointData.dataSourceIdentifier', this.props) ? (0, _plowJs.$get)('options.endpointData.dataSourceIdentifier', this.props) : null, (0, _plowJs.$get)('options.endpointData.url', this.props) ? (0, _plowJs.$get)('options.endpointData.url', this.props) : null, params).then(function (json) {
                                    if (!json) return;
                                    var length = json.length;
                                    var values = [];
                                    var currentValues = _this2.getValue();
                                    for (var i = 0; i < length; i++) {
                                        var fieldsArray = Object.keys(_this2.props.options.fields);
                                        values[i] = {};
                                        fieldsArray.map(function (identifier, idx) {
                                            var valueIdentifier = (0, _plowJs.$get)('options.endpointData.parseValues.' + identifier, _this2.props);
                                            var value = valueIdentifier ? (0, _plowJs.$get)(valueIdentifier, json[i]) : null;
                                            var currentValue = currentValues ? (0, _plowJs.$get)(identifier, currentValues[i]) : '';
                                            if (currentValue && !valueIdentifier) values[i][identifier] = currentValue;else values[i][identifier] = value ? value : '';
                                            if (i + 1 === length && idx + 1 === fieldsArray.length) {
                                                _this2.handleValueChange(values);
                                            }
                                        });
                                    }
                                });

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getFromEndpoint() {
                return _ref4.apply(this, arguments);
            }

            return getFromEndpoint;
        }()
    }, {
        key: 'getValue',
        value: function getValue() {
            var value = this.props.value;

            return value ? value : [];
        }
    }, {
        key: 'handleValueChange',
        value: function handleValueChange(value) {
            this.props.commit(value);
        }
    }, {
        key: 'getEditorDefinition',
        value: function getEditorDefinition(idx, identifier) {
            var _this3 = this;

            var _props = this.props,
                editorRegistry = _props.editorRegistry,
                options = _props.options;

            var fields = this.getValue();

            var field = (0, _plowJs.$get)('fields.' + identifier, options);

            var commitChange = function commitChange(event) {
                var value = _this3.getValue();
                value[idx][identifier] = event;
                _this3.handleValueChange(value);
            };

            var editorDefinition = editorRegistry.get(field.editor ? field.editor : 'Neos.Neos/Inspector/Editors/TextFieldEditor');

            if (editorDefinition && editorDefinition.component) {
                var EditorComponent = editorDefinition && editorDefinition.component;
                var editorOptions = field.editorOptions;
                var propertyValue = fields[idx][identifier];

                // console.log(this.props);

                return _react2.default.createElement(
                    _react.Fragment,
                    null,
                    field.label ? _react2.default.createElement(
                        'label',
                        null,
                        field.label
                    ) : '',
                    _react2.default.createElement(EditorComponent, _extends({
                        id: 'repetable-' + idx + '-' + identifier,
                        name: '[' + idx + ']' + identifier,
                        commit: commitChange.bind(this)
                        // onChange={commitChange()}
                        // onchange={commitChange()}
                        // onChangeValue={commitChange()}
                        , value: propertyValue,
                        options: editorOptions ? editorOptions : [],
                        neos: this.props.neos
                        // editorRegistry = {this.props.editorRegistry}
                        , renderSecondaryInspector: this.props.renderSecondaryInspector
                        // nodeTypesRegistry = {this.props.nodeTypesRegistry}
                        // i18nRegistry = {this.props.i18nRegistry}
                        // validatorRegistry = {this.props.validatorRegistry}
                    }, field))
                )

                // {...restProps} />
                ;
            }

            return _react2.default.createElement(
                'div',
                { className: _style2.default['envelope--invalid'] },
                'Missing Editor ',
                'error'
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var options = this.options;


            return _react2.default.createElement(
                _react.Fragment,
                null,
                _react2.default.createElement(
                    SortableContainer,
                    { onSortEnd: this.onSortEnd, useDragHandle: true },
                    this.getValue().map(function (fields, idx) {
                        return (
                            // this.repetableWrapper(idx)
                            _react2.default.createElement(SortableItem, { key: 'item-' + idx, index: idx, value: _this4.repetableWrapper(idx) })
                        );
                    })
                ),
                options.controls.add ? _react2.default.createElement(
                    'button',
                    { type: 'button', onClick: function onClick() {
                            return _this4.handleAdd();
                        }, className: _style2.default.btn },
                    options.buttonAddLabel
                ) : ''
            );
        }
    }]);

    return RepeatableField;
}(_react.PureComponent), _class2.propTypes = {
    value: _propTypes2.default.arrayOf(_propTypes2.default.object),
    commit: _propTypes2.default.func.isRequired,
    validationErrors: _propTypes2.default.array,
    highlight: _propTypes2.default.bool,
    options: _propTypes2.default.object,
    onKeyPress: _propTypes2.default.func,
    onEnterKey: _propTypes2.default.func,
    id: _propTypes2.default.string,
    i18nRegistry: _propTypes2.default.object.isRequired
}, _temp)) || _class);
exports.default = RepeatableField;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(13)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--3-2!../node_modules/postcss-loader/lib/index.js??ref--3-3!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--3-2!../node_modules/postcss-loader/lib/index.js??ref--3-3!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(12)(false);
// imports


// module
exports.push([module.i, ".style__repeatable-wrapper___cbr4W{\n    position: relative;\n    display: inline-block;\n    width: 100%;\n    text-align: center;\n    display: -ms-flexbox;\n    display: flex;\n    margin-bottom: 5px;\n}\n\n.style__repeatable-field-wrapper____KQr8{\n    width: 100%;\n    max-width: 230px;\n}\n\n.style__btn___Pc503{\n    margin:auto!important;\n    position: relative;\n    height: 40px;\n    min-width: 40px;\n    padding: 0 16px;\n    border: 0;\n    -webkit-font-smoothing: antialiased;\n    vertical-align: middle;\n    width: auto;\n    color: #FFF;\n    cursor: pointer;\n    background-color: #323232;\n    font-size: 14px;\n\n    /*&:hover:enabled{*/\n        /*background-color: #ff460d!important;*/\n}\n\n/*}*/\n\n.style__btn___Pc503.style__btn--wide___kIk-G{\n        margin:10px 0 10px 0!important;\n        width: 100%;\n    }\n\n.style__btn-delete___2F6DJ{\n    margin:auto!important;\n    margin-left: 10px!important;\n    position: relative;\n    height: 40px;\n    min-width: 20px;\n    padding: 0 0px;\n    border: 0;\n    -webkit-font-smoothing: antialiased;\n    vertical-align: middle;\n    width: auto;\n    color: #FFF;\n    cursor: pointer;\n    background-color: #323232;\n    font-size: 14px;\n}\n\n.style__btn-delete___2F6DJ:hover:enabled{\n        background-color: #ff460d!important;\n    }\n\n.style__btn-delete___2F6DJ.style__btn--wide___kIk-G{\n         margin:10px 0 10px 0!important;\n        width: 100%;\n    }\n\n.style__btn-move___3Jlfn{\n    margin:auto!important;\n    position: relative;\n    height: 40px;\n    min-width: 20px;\n    padding: 0 0px;\n    border: 0;\n    -webkit-font-smoothing: antialiased;\n    vertical-align: middle;\n    width: auto;\n    color: #FFF;\n    background-color: #3f3f3f;\n    font-size: 14px;\n\n    display: -ms-inline-grid;\n\n    display: inline-grid;\n    cursor: row-resize;\n    -ms-flex-align: center;\n        align-items: center;\n}\n\n", ""]);

// exports
exports.locals = {
	"repeatable-wrapper": "style__repeatable-wrapper___cbr4W",
	"repeatable-field-wrapper": "style__repeatable-field-wrapper____KQr8",
	"btn": "style__btn___Pc503",
	"btn--wide": "style__btn--wide___kIk-G",
	"btn-delete": "style__btn-delete___2F6DJ",
	"btn-move": "style__btn-move___3Jlfn"
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(14);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 14 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('NeosProjectPackages')().NeosUiDecorators;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('vendor')().plow;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('NeosProjectPackages')().NeosUiReduxStore;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('vendor')().reactRedux;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? factory(exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(20)) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types', 'react-dom'], factory) :
	(global = global || self, factory(global.SortableHOC = {}, global.React, global.PropTypes, global.ReactDOM));
}(this, function (exports, React, PropTypes, reactDom) { 'use strict';

	PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _extends_1 = createCommonjsModule(function (module) {
	function _extends() {
	  module.exports = _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	module.exports = _extends;
	});

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	var arrayWithHoles = _arrayWithHoles;

	function _iterableToArrayLimit(arr, i) {
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	var iterableToArrayLimit = _iterableToArrayLimit;

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	var nonIterableRest = _nonIterableRest;

	function _slicedToArray(arr, i) {
	  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
	}

	var slicedToArray = _slicedToArray;

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  }
	}

	var arrayWithoutHoles = _arrayWithoutHoles;

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	var iterableToArray = _iterableToArray;

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	var nonIterableSpread = _nonIterableSpread;

	function _toConsumableArray(arr) {
	  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
	}

	var toConsumableArray = _toConsumableArray;

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var classCallCheck = _classCallCheck;

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	var createClass = _createClass;

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

	function _typeof(obj) {
	  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
	    module.exports = _typeof = function _typeof(obj) {
	      return _typeof2(obj);
	    };
	  } else {
	    module.exports = _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
	    };
	  }

	  return _typeof(obj);
	}

	module.exports = _typeof;
	});

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	var assertThisInitialized = _assertThisInitialized;

	function _possibleConstructorReturn(self, call) {
	  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
	    return call;
	  }

	  return assertThisInitialized(self);
	}

	var possibleConstructorReturn = _possibleConstructorReturn;

	var getPrototypeOf = createCommonjsModule(function (module) {
	function _getPrototypeOf(o) {
	  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	module.exports = _getPrototypeOf;
	});

	var setPrototypeOf = createCommonjsModule(function (module) {
	function _setPrototypeOf(o, p) {
	  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	module.exports = _setPrototypeOf;
	});

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) setPrototypeOf(subClass, superClass);
	}

	var inherits = _inherits;

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	var defineProperty = _defineProperty;

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	var invariant_1 = invariant;

	var Manager = function () {
	  function Manager() {
	    classCallCheck(this, Manager);

	    defineProperty(this, "refs", {});
	  }

	  createClass(Manager, [{
	    key: "add",
	    value: function add(collection, ref) {
	      if (!this.refs[collection]) {
	        this.refs[collection] = [];
	      }

	      this.refs[collection].push(ref);
	    }
	  }, {
	    key: "remove",
	    value: function remove(collection, ref) {
	      var index = this.getIndex(collection, ref);

	      if (index !== -1) {
	        this.refs[collection].splice(index, 1);
	      }
	    }
	  }, {
	    key: "isActive",
	    value: function isActive() {
	      return this.active;
	    }
	  }, {
	    key: "getActive",
	    value: function getActive() {
	      var _this = this;

	      return this.refs[this.active.collection].find(function (_ref) {
	        var node = _ref.node;
	        return node.sortableInfo.index == _this.active.index;
	      });
	    }
	  }, {
	    key: "getIndex",
	    value: function getIndex(collection, ref) {
	      return this.refs[collection].indexOf(ref);
	    }
	  }, {
	    key: "getOrderedRefs",
	    value: function getOrderedRefs() {
	      var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.active.collection;
	      return this.refs[collection].sort(sortByIndex);
	    }
	  }]);

	  return Manager;
	}();

	function sortByIndex(_ref2, _ref3) {
	  var index1 = _ref2.node.sortableInfo.index;
	  var index2 = _ref3.node.sortableInfo.index;
	  return index1 - index2;
	}

	function arrayMove(array, from, to) {
	  {
	    if (typeof console !== 'undefined') {
	      console.warn("Deprecation warning: arrayMove will no longer be exported by 'react-sortable-hoc' in the next major release. Please install the `array-move` package locally instead. https://www.npmjs.com/package/array-move");
	    }
	  }

	  array = array.slice();
	  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
	  return array;
	}
	function omit(obj) {
	  for (var _len = arguments.length, keysToOmit = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    keysToOmit[_key - 1] = arguments[_key];
	  }

	  return Object.keys(obj).reduce(function (acc, key) {
	    if (keysToOmit.indexOf(key) === -1) {
	      acc[key] = obj[key];
	    }

	    return acc;
	  }, {});
	}
	var events = {
	  end: ['touchend', 'touchcancel', 'mouseup'],
	  move: ['touchmove', 'mousemove'],
	  start: ['touchstart', 'mousedown']
	};
	var vendorPrefix = function () {
	  if (typeof window === 'undefined' || typeof document === 'undefined') {
	    return '';
	  }

	  var styles = window.getComputedStyle(document.documentElement, '') || ['-moz-hidden-iframe'];
	  var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];

	  switch (pre) {
	    case 'ms':
	      return 'ms';

	    default:
	      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
	  }
	}();
	function setInlineStyles(node, styles) {
	  Object.keys(styles).forEach(function (key) {
	    node.style[key] = styles[key];
	  });
	}
	function setTranslate3d(node, translate) {
	  node.style["".concat(vendorPrefix, "Transform")] = translate == null ? '' : "translate3d(".concat(translate.x, "px,").concat(translate.y, "px,0)");
	}
	function setTransitionDuration(node, duration) {
	  node.style["".concat(vendorPrefix, "TransitionDuration")] = duration == null ? '' : "".concat(duration, "ms");
	}
	function closest(el, fn) {
	  while (el) {
	    if (fn(el)) {
	      return el;
	    }

	    el = el.parentNode;
	  }

	  return null;
	}
	function limit(min, max, value) {
	  return Math.max(min, Math.min(value, max));
	}

	function getPixelValue(stringValue) {
	  if (stringValue.substr(-2) === 'px') {
	    return parseFloat(stringValue);
	  }

	  return 0;
	}

	function getElementMargin(element) {
	  var style = window.getComputedStyle(element);
	  return {
	    bottom: getPixelValue(style.marginBottom),
	    left: getPixelValue(style.marginLeft),
	    right: getPixelValue(style.marginRight),
	    top: getPixelValue(style.marginTop)
	  };
	}
	function provideDisplayName(prefix, Component) {
	  var componentName = Component.displayName || Component.name;
	  return componentName ? "".concat(prefix, "(").concat(componentName, ")") : prefix;
	}
	function getPosition(event) {
	  if (event.touches && event.touches.length) {
	    return {
	      x: event.touches[0].pageX,
	      y: event.touches[0].pageY
	    };
	  } else if (event.changedTouches && event.changedTouches.length) {
	    return {
	      x: event.changedTouches[0].pageX,
	      y: event.changedTouches[0].pageY
	    };
	  } else {
	    return {
	      x: event.pageX,
	      y: event.pageY
	    };
	  }
	}
	function isTouchEvent(event) {
	  return event.touches && event.touches.length || event.changedTouches && event.changedTouches.length;
	}
	function getEdgeOffset(node, parent) {
	  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
	    left: 0,
	    top: 0
	  };

	  if (!node) {
	    return undefined;
	  }

	  var nodeOffset = {
	    left: offset.left + node.offsetLeft,
	    top: offset.top + node.offsetTop
	  };

	  if (node.parentNode === parent) {
	    return nodeOffset;
	  }

	  return getEdgeOffset(node.parentNode, parent, nodeOffset);
	}

	function getLockPixelOffset(_ref) {
	  var lockOffset = _ref.lockOffset,
	      width = _ref.width,
	      height = _ref.height;
	  var offsetX = lockOffset;
	  var offsetY = lockOffset;
	  var unit = 'px';

	  if (typeof lockOffset === 'string') {
	    var match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);
	    invariant_1(match !== null, 'lockOffset value should be a number or a string of a ' + 'number followed by "px" or "%". Given %s', lockOffset);
	    offsetX = parseFloat(lockOffset);
	    offsetY = parseFloat(lockOffset);
	    unit = match[1];
	  }

	  invariant_1(isFinite(offsetX) && isFinite(offsetY), 'lockOffset value should be a finite. Given %s', lockOffset);

	  if (unit === '%') {
	    offsetX = offsetX * width / 100;
	    offsetY = offsetY * height / 100;
	  }

	  return {
	    x: offsetX,
	    y: offsetY
	  };
	}

	function getLockPixelOffsets(_ref2) {
	  var height = _ref2.height,
	      width = _ref2.width,
	      lockOffset = _ref2.lockOffset;
	  var offsets = Array.isArray(lockOffset) ? lockOffset : [lockOffset, lockOffset];
	  invariant_1(offsets.length === 2, 'lockOffset prop of SortableContainer should be a single ' + 'value or an array of exactly two values. Given %s', lockOffset);

	  var _offsets = slicedToArray(offsets, 2),
	      minLockOffset = _offsets[0],
	      maxLockOffset = _offsets[1];

	  return [getLockPixelOffset({
	    height: height,
	    lockOffset: minLockOffset,
	    width: width
	  }), getLockPixelOffset({
	    height: height,
	    lockOffset: maxLockOffset,
	    width: width
	  })];
	}

	function isScrollable(el) {
	  var computedStyle = window.getComputedStyle(el);
	  var overflowRegex = /(auto|scroll)/;
	  var properties = ['overflow', 'overflowX', 'overflowY'];
	  return properties.find(function (property) {
	    return overflowRegex.test(computedStyle[property]);
	  });
	}

	function getScrollingParent(el) {
	  if (!(el instanceof HTMLElement)) {
	    return null;
	  } else if (isScrollable(el)) {
	    return el;
	  } else {
	    return getScrollingParent(el.parentNode);
	  }
	}
	var NodeType = {
	  Anchor: 'A',
	  Button: 'BUTTON',
	  Canvas: 'CANVAS',
	  Input: 'INPUT',
	  Option: 'OPTION',
	  Textarea: 'TEXTAREA',
	  Select: 'SELECT'
	};

	function sortableHandle(WrappedComponent) {
	  var _class, _temp;

	  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	    withRef: false
	  };
	  return _temp = _class = function (_React$Component) {
	    inherits(WithSortableHandle, _React$Component);

	    function WithSortableHandle() {
	      classCallCheck(this, WithSortableHandle);

	      return possibleConstructorReturn(this, getPrototypeOf(WithSortableHandle).apply(this, arguments));
	    }

	    createClass(WithSortableHandle, [{
	      key: "componentDidMount",
	      value: function componentDidMount() {
	        var node = reactDom.findDOMNode(this);
	        node.sortableHandle = true;
	      }
	    }, {
	      key: "getWrappedInstance",
	      value: function getWrappedInstance() {
	        invariant_1(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableHandle() call');
	        return this.refs.wrappedInstance;
	      }
	    }, {
	      key: "render",
	      value: function render() {
	        var ref = config.withRef ? 'wrappedInstance' : null;
	        return React.createElement(WrappedComponent, _extends_1({
	          ref: ref
	        }, this.props));
	      }
	    }]);

	    return WithSortableHandle;
	  }(React.Component), defineProperty(_class, "displayName", provideDisplayName('sortableHandle', WrappedComponent)), _temp;
	}
	function isSortableHandle(node) {
	  return node.sortableHandle != null;
	}

	var AutoScroller = function () {
	  function AutoScroller(container, onScrollCallback) {
	    classCallCheck(this, AutoScroller);

	    this.container = container;
	    this.onScrollCallback = onScrollCallback;
	  }

	  createClass(AutoScroller, [{
	    key: "clear",
	    value: function clear() {
	      clearInterval(this.interval);
	      this.interval = null;
	    }
	  }, {
	    key: "update",
	    value: function update(_ref) {
	      var _this = this;

	      var translate = _ref.translate,
	          minTranslate = _ref.minTranslate,
	          maxTranslate = _ref.maxTranslate,
	          width = _ref.width,
	          height = _ref.height;
	      var direction = {
	        x: 0,
	        y: 0
	      };
	      var speed = {
	        x: 1,
	        y: 1
	      };
	      var acceleration = {
	        x: 10,
	        y: 10
	      };
	      var _this$container = this.container,
	          scrollTop = _this$container.scrollTop,
	          scrollLeft = _this$container.scrollLeft,
	          scrollHeight = _this$container.scrollHeight,
	          scrollWidth = _this$container.scrollWidth,
	          clientHeight = _this$container.clientHeight,
	          clientWidth = _this$container.clientWidth;
	      var isTop = scrollTop === 0;
	      var isBottom = scrollHeight - scrollTop - clientHeight === 0;
	      var isLeft = scrollLeft === 0;
	      var isRight = scrollWidth - scrollLeft - clientWidth === 0;

	      if (translate.y >= maxTranslate.y - height / 2 && !isBottom) {
	        direction.y = 1;
	        speed.y = acceleration.y * Math.abs((maxTranslate.y - height / 2 - translate.y) / height);
	      } else if (translate.x >= maxTranslate.x - width / 2 && !isRight) {
	        direction.x = 1;
	        speed.x = acceleration.x * Math.abs((maxTranslate.x - width / 2 - translate.x) / width);
	      } else if (translate.y <= minTranslate.y + height / 2 && !isTop) {
	        direction.y = -1;
	        speed.y = acceleration.y * Math.abs((translate.y - height / 2 - minTranslate.y) / height);
	      } else if (translate.x <= minTranslate.x + width / 2 && !isLeft) {
	        direction.x = -1;
	        speed.x = acceleration.x * Math.abs((translate.x - width / 2 - minTranslate.x) / width);
	      }

	      if (this.interval) {
	        this.clear();
	        this.isAutoScrolling = false;
	      }

	      if (direction.x !== 0 || direction.y !== 0) {
	        this.interval = setInterval(function () {
	          _this.isAutoScrolling = true;
	          var offset = {
	            left: speed.x * direction.x,
	            top: speed.y * direction.y
	          };
	          _this.container.scrollTop += offset.top;
	          _this.container.scrollLeft += offset.left;

	          _this.onScrollCallback(offset);
	        }, 5);
	      }
	    }
	  }]);

	  return AutoScroller;
	}();

	function defaultGetHelperDimensions(_ref) {
	  var node = _ref.node;
	  return {
	    height: node.offsetHeight,
	    width: node.offsetWidth
	  };
	}

	function defaultShouldCancelStart(event) {
	  var disabledElements = [NodeType.Input, NodeType.Textarea, NodeType.Select, NodeType.Option, NodeType.Button];

	  if (disabledElements.indexOf(event.target.tagName) !== -1) {
	    return true;
	  }

	  return false;
	}

	var propTypes = {
	  axis: PropTypes.oneOf(['x', 'y', 'xy']),
	  contentWindow: PropTypes.any,
	  disableAutoscroll: PropTypes.bool,
	  distance: PropTypes.number,
	  getContainer: PropTypes.func,
	  getHelperDimensions: PropTypes.func,
	  helperClass: PropTypes.string,
	  helperContainer: PropTypes.oneOfType([PropTypes.func, typeof HTMLElement === 'undefined' ? PropTypes.any : PropTypes.instanceOf(HTMLElement)]),
	  hideSortableGhost: PropTypes.bool,
	  lockAxis: PropTypes.string,
	  lockOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))]),
	  lockToContainerEdges: PropTypes.bool,
	  onSortEnd: PropTypes.func,
	  onSortMove: PropTypes.func,
	  onSortOver: PropTypes.func,
	  onSortStart: PropTypes.func,
	  pressDelay: PropTypes.number,
	  pressThreshold: PropTypes.number,
	  shouldCancelStart: PropTypes.func,
	  transitionDuration: PropTypes.number,
	  updateBeforeSortStart: PropTypes.func,
	  useDragHandle: PropTypes.bool,
	  useWindowAsScrollContainer: PropTypes.bool
	};
	var defaultProps = {
	  axis: 'y',
	  disableAutoscroll: false,
	  distance: 0,
	  getHelperDimensions: defaultGetHelperDimensions,
	  hideSortableGhost: true,
	  lockOffset: '50%',
	  lockToContainerEdges: false,
	  pressDelay: 0,
	  pressThreshold: 5,
	  shouldCancelStart: defaultShouldCancelStart,
	  transitionDuration: 300,
	  useWindowAsScrollContainer: false
	};
	var omittedProps = Object.keys(propTypes);
	function validateProps(props) {
	  invariant_1(!(props.distance && props.pressDelay), 'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.');
	}

	function _finallyRethrows(body, finalizer) {
	  try {
	    var result = body();
	  } catch (e) {
	    return finalizer(true, e);
	  }

	  if (result && result.then) {
	    return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
	  }

	  return finalizer(false, value);
	}
	function sortableContainer(WrappedComponent) {
	  var _class, _temp;

	  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	    withRef: false
	  };
	  return _temp = _class = function (_React$Component) {
	    inherits(WithSortableContainer, _React$Component);

	    function WithSortableContainer(props) {
	      var _this;

	      classCallCheck(this, WithSortableContainer);

	      _this = possibleConstructorReturn(this, getPrototypeOf(WithSortableContainer).call(this, props));

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "handleStart", function (event) {
	        var _this$props = _this.props,
	            distance = _this$props.distance,
	            shouldCancelStart = _this$props.shouldCancelStart;

	        if (event.button === 2 || shouldCancelStart(event)) {
	          return;
	        }

	        _this.touched = true;
	        _this.position = getPosition(event);
	        var node = closest(event.target, function (el) {
	          return el.sortableInfo != null;
	        });

	        if (node && node.sortableInfo && _this.nodeIsChild(node) && !_this.state.sorting) {
	          var useDragHandle = _this.props.useDragHandle;
	          var _node$sortableInfo = node.sortableInfo,
	              index = _node$sortableInfo.index,
	              collection = _node$sortableInfo.collection,
	              disabled = _node$sortableInfo.disabled;

	          if (disabled) {
	            return;
	          }

	          if (useDragHandle && !closest(event.target, isSortableHandle)) {
	            return;
	          }

	          _this.manager.active = {
	            collection: collection,
	            index: index
	          };

	          if (!isTouchEvent(event) && event.target.tagName === NodeType.Anchor) {
	            event.preventDefault();
	          }

	          if (!distance) {
	            if (_this.props.pressDelay === 0) {
	              _this.handlePress(event);
	            } else {
	              _this.pressTimer = setTimeout(function () {
	                return _this.handlePress(event);
	              }, _this.props.pressDelay);
	            }
	          }
	        }
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "nodeIsChild", function (node) {
	        return node.sortableInfo.manager === _this.manager;
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "handleMove", function (event) {
	        var _this$props2 = _this.props,
	            distance = _this$props2.distance,
	            pressThreshold = _this$props2.pressThreshold;

	        if (!_this.state.sorting && _this.touched && !_this._awaitingUpdateBeforeSortStart) {
	          var position = getPosition(event);
	          var delta = {
	            x: _this.position.x - position.x,
	            y: _this.position.y - position.y
	          };
	          var combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);
	          _this.delta = delta;

	          if (!distance && (!pressThreshold || combinedDelta >= pressThreshold)) {
	            clearTimeout(_this.cancelTimer);
	            _this.cancelTimer = setTimeout(_this.cancel, 0);
	          } else if (distance && combinedDelta >= distance && _this.manager.isActive()) {
	            _this.handlePress(event);
	          }
	        }
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "handleEnd", function () {
	        _this.touched = false;

	        _this.cancel();
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "cancel", function () {
	        var distance = _this.props.distance;
	        var sorting = _this.state.sorting;

	        if (!sorting) {
	          if (!distance) {
	            clearTimeout(_this.pressTimer);
	          }

	          _this.manager.active = null;
	        }
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "handlePress", function (event) {
	        try {
	          var active = _this.manager.getActive();

	          var _temp6 = function () {
	            if (active) {
	              var _temp7 = function _temp7() {
	                var index = _node.sortableInfo.index;
	                var margin = getElementMargin(_node);

	                var containerBoundingRect = _this.scrollContainer.getBoundingClientRect();

	                var dimensions = _getHelperDimensions({
	                  collection: _collection,
	                  index: index,
	                  node: _node
	                });

	                _this.node = _node;
	                _this.margin = margin;
	                _this.width = dimensions.width;
	                _this.height = dimensions.height;
	                _this.marginOffset = {
	                  x: _this.margin.left + _this.margin.right,
	                  y: Math.max(_this.margin.top, _this.margin.bottom)
	                };
	                _this.boundingClientRect = _node.getBoundingClientRect();
	                _this.containerBoundingRect = containerBoundingRect;
	                _this.index = index;
	                _this.newIndex = index;
	                _this.axis = {
	                  x: _axis.indexOf('x') >= 0,
	                  y: _axis.indexOf('y') >= 0
	                };
	                _this.offsetEdge = getEdgeOffset(_node, _this.container);
	                _this.initialOffset = getPosition(event);
	                _this.initialScroll = {
	                  left: _this.scrollContainer.scrollLeft,
	                  top: _this.scrollContainer.scrollTop
	                };
	                _this.initialWindowScroll = {
	                  left: window.pageXOffset,
	                  top: window.pageYOffset
	                };

	                var fields = _node.querySelectorAll('input, textarea, select, canvas');

	                var clonedNode = _node.cloneNode(true);

	                var clonedFields = toConsumableArray(clonedNode.querySelectorAll('input, textarea, select, canvas'));

	                clonedFields.forEach(function (field, i) {
	                  if (field.type !== 'file' && fields[index]) {
	                    field.value = fields[i].value;
	                  }

	                  if (field.tagName === NodeType.Canvas) {
	                    var destCtx = field.getContext('2d');
	                    destCtx.drawImage(fields[i], 0, 0);
	                  }
	                });
	                _this.helper = _this.helperContainer.appendChild(clonedNode);
	                setInlineStyles(_this.helper, {
	                  boxSizing: 'border-box',
	                  height: "".concat(_this.height, "px"),
	                  left: "".concat(_this.boundingClientRect.left - margin.left, "px"),
	                  pointerEvents: 'none',
	                  position: 'fixed',
	                  top: "".concat(_this.boundingClientRect.top - margin.top, "px"),
	                  width: "".concat(_this.width, "px")
	                });

	                if (_hideSortableGhost) {
	                  _this.sortableGhost = _node;
	                  setInlineStyles(_node, {
	                    opacity: 0,
	                    visibility: 'hidden'
	                  });
	                }

	                _this.minTranslate = {};
	                _this.maxTranslate = {};

	                if (_this.axis.x) {
	                  _this.minTranslate.x = (_useWindowAsScrollContainer ? 0 : containerBoundingRect.left) - _this.boundingClientRect.left - _this.width / 2;
	                  _this.maxTranslate.x = (_useWindowAsScrollContainer ? _this.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - _this.boundingClientRect.left - _this.width / 2;
	                }

	                if (_this.axis.y) {
	                  _this.minTranslate.y = (_useWindowAsScrollContainer ? 0 : containerBoundingRect.top) - _this.boundingClientRect.top - _this.height / 2;
	                  _this.maxTranslate.y = (_useWindowAsScrollContainer ? _this.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - _this.boundingClientRect.top - _this.height / 2;
	                }

	                if (_helperClass) {
	                  _helperClass.split(' ').forEach(function (className) {
	                    return _this.helper.classList.add(className);
	                  });
	                }

	                _this.listenerNode = event.touches ? _node : _this.contentWindow;
	                events.move.forEach(function (eventName) {
	                  return _this.listenerNode.addEventListener(eventName, _this.handleSortMove, false);
	                });
	                events.end.forEach(function (eventName) {
	                  return _this.listenerNode.addEventListener(eventName, _this.handleSortEnd, false);
	                });

	                _this.setState({
	                  sorting: true,
	                  sortingIndex: index
	                });

	                if (_onSortStart) {
	                  _onSortStart({
	                    collection: _collection,
	                    index: index,
	                    node: _node
	                  }, event);
	                }
	              };

	              var _this$props3 = _this.props,
	                  _axis = _this$props3.axis,
	                  _getHelperDimensions = _this$props3.getHelperDimensions,
	                  _helperClass = _this$props3.helperClass,
	                  _hideSortableGhost = _this$props3.hideSortableGhost,
	                  updateBeforeSortStart = _this$props3.updateBeforeSortStart,
	                  _onSortStart = _this$props3.onSortStart,
	                  _useWindowAsScrollContainer = _this$props3.useWindowAsScrollContainer;
	              var _node = active.node,
	                  _collection = active.collection;

	              var _temp8 = function () {
	                if (typeof updateBeforeSortStart === 'function') {
	                  _this._awaitingUpdateBeforeSortStart = true;

	                  var _temp9 = _finallyRethrows(function () {
	                    var index = _node.sortableInfo.index;
	                    return Promise.resolve(updateBeforeSortStart({
	                      collection: _collection,
	                      index: index,
	                      node: _node
	                    }, event)).then(function () {});
	                  }, function (_wasThrown, _result) {
	                    _this._awaitingUpdateBeforeSortStart = false;
	                    if (_wasThrown) throw _result;
	                    return _result;
	                  });

	                  if (_temp9 && _temp9.then) return _temp9.then(function () {});
	                }
	              }();

	              return _temp8 && _temp8.then ? _temp8.then(_temp7) : _temp7(_temp8);
	            }
	          }();

	          return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function () {}) : void 0);
	        } catch (e) {
	          return Promise.reject(e);
	        }
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "handleSortMove", function (event) {
	        var onSortMove = _this.props.onSortMove;
	        event.preventDefault();

	        _this.updateHelperPosition(event);

	        _this.animateNodes();

	        _this.autoscroll();

	        if (onSortMove) {
	          onSortMove(event);
	        }
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "handleSortEnd", function (event) {
	        var _this$props4 = _this.props,
	            hideSortableGhost = _this$props4.hideSortableGhost,
	            onSortEnd = _this$props4.onSortEnd;
	        var collection = _this.manager.active.collection;
	        var nodes = _this.manager.refs[collection];

	        if (_this.listenerNode) {
	          events.move.forEach(function (eventName) {
	            return _this.listenerNode.removeEventListener(eventName, _this.handleSortMove);
	          });
	          events.end.forEach(function (eventName) {
	            return _this.listenerNode.removeEventListener(eventName, _this.handleSortEnd);
	          });
	        }

	        _this.helper.parentNode.removeChild(_this.helper);

	        if (hideSortableGhost && _this.sortableGhost) {
	          setInlineStyles(_this.sortableGhost, {
	            opacity: '',
	            visibility: ''
	          });
	        }

	        for (var i = 0, len = nodes.length; i < len; i++) {
	          var _node2 = nodes[i];
	          var el = _node2.node;
	          _node2.edgeOffset = null;
	          setTranslate3d(el, null);
	          setTransitionDuration(el, null);
	        }

	        _this.autoScroller.clear();

	        _this.manager.active = null;

	        _this.setState({
	          sorting: false,
	          sortingIndex: null
	        });

	        if (typeof onSortEnd === 'function') {
	          onSortEnd({
	            collection: collection,
	            newIndex: _this.newIndex,
	            oldIndex: _this.index
	          }, event);
	        }

	        _this.touched = false;
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "autoscroll", function () {
	        var disableAutoscroll = _this.props.disableAutoscroll;

	        if (disableAutoscroll) {
	          return;
	        }

	        _this.autoScroller.update({
	          height: _this.height,
	          maxTranslate: _this.maxTranslate,
	          minTranslate: _this.minTranslate,
	          translate: _this.translate,
	          width: _this.width
	        });
	      });

	      defineProperty(assertThisInitialized(assertThisInitialized(_this)), "onAutoScroll", function (offset) {
	        _this.translate.x += offset.left;
	        _this.translate.y += offset.top;

	        _this.animateNodes();
	      });

	      validateProps(props);
	      _this.state = {};
	      _this.manager = new Manager();
	      _this.events = {
	        end: _this.handleEnd,
	        move: _this.handleMove,
	        start: _this.handleStart
	      };
	      return _this;
	    }

	    createClass(WithSortableContainer, [{
	      key: "getChildContext",
	      value: function getChildContext() {
	        return {
	          manager: this.manager
	        };
	      }
	    }, {
	      key: "componentDidMount",
	      value: function componentDidMount() {
	        var _this2 = this;

	        var useWindowAsScrollContainer = this.props.useWindowAsScrollContainer;
	        var container = this.getContainer();
	        Promise.resolve(container).then(function (containerNode) {
	          _this2.container = containerNode;
	          _this2.document = _this2.container.ownerDocument || document;
	          var contentWindow = _this2.props.contentWindow || _this2.document.defaultView || window;
	          _this2.contentWindow = typeof contentWindow === 'function' ? contentWindow() : contentWindow;
	          _this2.scrollContainer = useWindowAsScrollContainer ? _this2.document.scrollingElement || _this2.document.documentElement : getScrollingParent(_this2.container) || _this2.container;
	          _this2.autoScroller = new AutoScroller(_this2.scrollContainer, _this2.onAutoScroll);
	          Object.keys(_this2.events).forEach(function (key) {
	            return events[key].forEach(function (eventName) {
	              return _this2.container.addEventListener(eventName, _this2.events[key], false);
	            });
	          });
	        });
	      }
	    }, {
	      key: "componentWillUnmount",
	      value: function componentWillUnmount() {
	        var _this3 = this;

	        if (this.container) {
	          Object.keys(this.events).forEach(function (key) {
	            return events[key].forEach(function (eventName) {
	              return _this3.container.removeEventListener(eventName, _this3.events[key]);
	            });
	          });
	        }
	      }
	    }, {
	      key: "updateHelperPosition",
	      value: function updateHelperPosition(event) {
	        var _this$props5 = this.props,
	            lockAxis = _this$props5.lockAxis,
	            lockOffset = _this$props5.lockOffset,
	            lockToContainerEdges = _this$props5.lockToContainerEdges;
	        var offset = getPosition(event);
	        var translate = {
	          x: offset.x - this.initialOffset.x,
	          y: offset.y - this.initialOffset.y
	        };
	        translate.y -= window.pageYOffset - this.initialWindowScroll.top;
	        translate.x -= window.pageXOffset - this.initialWindowScroll.left;
	        this.translate = translate;

	        if (lockToContainerEdges) {
	          var _getLockPixelOffsets = getLockPixelOffsets({
	            height: this.height,
	            lockOffset: lockOffset,
	            width: this.width
	          }),
	              _getLockPixelOffsets2 = slicedToArray(_getLockPixelOffsets, 2),
	              minLockOffset = _getLockPixelOffsets2[0],
	              maxLockOffset = _getLockPixelOffsets2[1];

	          var minOffset = {
	            x: this.width / 2 - minLockOffset.x,
	            y: this.height / 2 - minLockOffset.y
	          };
	          var maxOffset = {
	            x: this.width / 2 - maxLockOffset.x,
	            y: this.height / 2 - maxLockOffset.y
	          };
	          translate.x = limit(this.minTranslate.x + minOffset.x, this.maxTranslate.x - maxOffset.x, translate.x);
	          translate.y = limit(this.minTranslate.y + minOffset.y, this.maxTranslate.y - maxOffset.y, translate.y);
	        }

	        if (lockAxis === 'x') {
	          translate.y = 0;
	        } else if (lockAxis === 'y') {
	          translate.x = 0;
	        }

	        setTranslate3d(this.helper, translate);
	      }
	    }, {
	      key: "animateNodes",
	      value: function animateNodes() {
	        var _this$props6 = this.props,
	            transitionDuration = _this$props6.transitionDuration,
	            hideSortableGhost = _this$props6.hideSortableGhost,
	            onSortOver = _this$props6.onSortOver;
	        var containerScrollDelta = this.containerScrollDelta,
	            windowScrollDelta = this.windowScrollDelta;
	        var nodes = this.manager.getOrderedRefs();
	        var sortingOffset = {
	          left: this.offsetEdge.left + this.translate.x + containerScrollDelta.left,
	          top: this.offsetEdge.top + this.translate.y + containerScrollDelta.top
	        };
	        var prevIndex = this.newIndex;
	        this.newIndex = null;

	        for (var i = 0, len = nodes.length; i < len; i++) {
	          var _node3 = nodes[i].node;
	          var index = _node3.sortableInfo.index;
	          var width = _node3.offsetWidth;
	          var height = _node3.offsetHeight;
	          var offset = {
	            height: this.height > height ? height / 2 : this.height / 2,
	            width: this.width > width ? width / 2 : this.width / 2
	          };
	          var translate = {
	            x: 0,
	            y: 0
	          };
	          var edgeOffset = nodes[i].edgeOffset;

	          if (!edgeOffset) {
	            edgeOffset = getEdgeOffset(_node3, this.container);
	            nodes[i].edgeOffset = edgeOffset;
	          }

	          var nextNode = i < nodes.length - 1 && nodes[i + 1];
	          var prevNode = i > 0 && nodes[i - 1];

	          if (nextNode && !nextNode.edgeOffset) {
	            nextNode.edgeOffset = getEdgeOffset(nextNode.node, this.container);
	          }

	          if (index === this.index) {
	            if (hideSortableGhost) {
	              this.sortableGhost = _node3;
	              setInlineStyles(_node3, {
	                opacity: 0,
	                visibility: 'hidden'
	              });
	            }

	            continue;
	          }

	          if (transitionDuration) {
	            setTransitionDuration(_node3, transitionDuration);
	          }

	          if (this.axis.x) {
	            if (this.axis.y) {
	              if (index < this.index && (sortingOffset.left + windowScrollDelta.left - offset.width <= edgeOffset.left && sortingOffset.top + windowScrollDelta.top <= edgeOffset.top + offset.height || sortingOffset.top + windowScrollDelta.top + offset.height <= edgeOffset.top)) {
	                translate.x = this.width + this.marginOffset.x;

	                if (edgeOffset.left + translate.x > this.containerBoundingRect.width - offset.width) {
	                  if (nextNode) {
	                    translate.x = nextNode.edgeOffset.left - edgeOffset.left;
	                    translate.y = nextNode.edgeOffset.top - edgeOffset.top;
	                  }
	                }

	                if (this.newIndex === null) {
	                  this.newIndex = index;
	                }
	              } else if (index > this.index && (sortingOffset.left + windowScrollDelta.left + offset.width >= edgeOffset.left && sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top || sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top + height)) {
	                translate.x = -(this.width + this.marginOffset.x);

	                if (edgeOffset.left + translate.x < this.containerBoundingRect.left + offset.width) {
	                  if (prevNode) {
	                    translate.x = prevNode.edgeOffset.left - edgeOffset.left;
	                    translate.y = prevNode.edgeOffset.top - edgeOffset.top;
	                  }
	                }

	                this.newIndex = index;
	              }
	            } else {
	              if (index > this.index && sortingOffset.left + windowScrollDelta.left + offset.width >= edgeOffset.left) {
	                translate.x = -(this.width + this.marginOffset.x);
	                this.newIndex = index;
	              } else if (index < this.index && sortingOffset.left + windowScrollDelta.left <= edgeOffset.left + offset.width) {
	                translate.x = this.width + this.marginOffset.x;

	                if (this.newIndex == null) {
	                  this.newIndex = index;
	                }
	              }
	            }
	          } else if (this.axis.y) {
	            if (index > this.index && sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top) {
	              translate.y = -(this.height + this.marginOffset.y);
	              this.newIndex = index;
	            } else if (index < this.index && sortingOffset.top + windowScrollDelta.top <= edgeOffset.top + offset.height) {
	              translate.y = this.height + this.marginOffset.y;

	              if (this.newIndex == null) {
	                this.newIndex = index;
	              }
	            }
	          }

	          setTranslate3d(_node3, translate);
	        }

	        if (this.newIndex == null) {
	          this.newIndex = this.index;
	        }

	        if (onSortOver && this.newIndex !== prevIndex) {
	          onSortOver({
	            collection: this.manager.active.collection,
	            index: this.index,
	            newIndex: this.newIndex,
	            oldIndex: prevIndex
	          });
	        }
	      }
	    }, {
	      key: "getWrappedInstance",
	      value: function getWrappedInstance() {
	        invariant_1(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call');
	        return this.refs.wrappedInstance;
	      }
	    }, {
	      key: "getContainer",
	      value: function getContainer() {
	        var getContainer = this.props.getContainer;

	        if (typeof getContainer !== 'function') {
	          return reactDom.findDOMNode(this);
	        }

	        return getContainer(config.withRef ? this.getWrappedInstance() : undefined);
	      }
	    }, {
	      key: "render",
	      value: function render() {
	        var ref = config.withRef ? 'wrappedInstance' : null;
	        return React.createElement(WrappedComponent, _extends_1({
	          ref: ref
	        }, omit(this.props, omittedProps)));
	      }
	    }, {
	      key: "helperContainer",
	      get: function get() {
	        var helperContainer = this.props.helperContainer;

	        if (typeof helperContainer === 'function') {
	          return helperContainer();
	        }

	        return this.props.helperContainer || this.document.body;
	      }
	    }, {
	      key: "containerScrollDelta",
	      get: function get() {
	        var useWindowAsScrollContainer = this.props.useWindowAsScrollContainer;

	        if (useWindowAsScrollContainer) {
	          return {
	            left: 0,
	            top: 0
	          };
	        }

	        return {
	          left: this.scrollContainer.scrollLeft - this.initialScroll.left,
	          top: this.scrollContainer.scrollTop - this.initialScroll.top
	        };
	      }
	    }, {
	      key: "windowScrollDelta",
	      get: function get() {
	        return {
	          left: this.contentWindow.pageXOffset - this.initialWindowScroll.left,
	          top: this.contentWindow.pageYOffset - this.initialWindowScroll.top
	        };
	      }
	    }]);

	    return WithSortableContainer;
	  }(React.Component), defineProperty(_class, "displayName", provideDisplayName('sortableList', WrappedComponent)), defineProperty(_class, "defaultProps", defaultProps), defineProperty(_class, "propTypes", propTypes), defineProperty(_class, "childContextTypes", {
	    manager: PropTypes.object.isRequired
	  }), _temp;
	}

	var propTypes$1 = {
	  index: PropTypes.number.isRequired,
	  collection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	  disabled: PropTypes.bool
	};
	var omittedProps$1 = Object.keys(propTypes$1);
	function sortableElement(WrappedComponent) {
	  var _class, _temp;

	  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	    withRef: false
	  };
	  return _temp = _class = function (_React$Component) {
	    inherits(WithSortableElement, _React$Component);

	    function WithSortableElement() {
	      classCallCheck(this, WithSortableElement);

	      return possibleConstructorReturn(this, getPrototypeOf(WithSortableElement).apply(this, arguments));
	    }

	    createClass(WithSortableElement, [{
	      key: "componentDidMount",
	      value: function componentDidMount() {
	        this.register();
	      }
	    }, {
	      key: "componentDidUpdate",
	      value: function componentDidUpdate(prevProps) {
	        if (this.node) {
	          if (prevProps.index !== this.props.index) {
	            this.node.sortableInfo.index = this.props.index;
	          }

	          if (prevProps.disabled !== this.props.disabled) {
	            this.node.sortableInfo.disabled = this.props.disabled;
	          }
	        }

	        if (prevProps.collection !== this.props.collection) {
	          this.unregister(prevProps.collection);
	          this.register();
	        }
	      }
	    }, {
	      key: "componentWillUnmount",
	      value: function componentWillUnmount() {
	        this.unregister();
	      }
	    }, {
	      key: "register",
	      value: function register() {
	        var _this$props = this.props,
	            collection = _this$props.collection,
	            disabled = _this$props.disabled,
	            index = _this$props.index;
	        var node = reactDom.findDOMNode(this);
	        node.sortableInfo = {
	          collection: collection,
	          disabled: disabled,
	          index: index,
	          manager: this.context.manager
	        };
	        this.node = node;
	        this.ref = {
	          node: node
	        };
	        this.context.manager.add(collection, this.ref);
	      }
	    }, {
	      key: "unregister",
	      value: function unregister() {
	        var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.collection;
	        this.context.manager.remove(collection, this.ref);
	      }
	    }, {
	      key: "getWrappedInstance",
	      value: function getWrappedInstance() {
	        invariant_1(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call');
	        return this.refs.wrappedInstance;
	      }
	    }, {
	      key: "render",
	      value: function render() {
	        var ref = config.withRef ? 'wrappedInstance' : null;
	        return React.createElement(WrappedComponent, _extends_1({
	          ref: ref
	        }, omit(this.props, omittedProps$1)));
	      }
	    }]);

	    return WithSortableElement;
	  }(React.Component), defineProperty(_class, "displayName", provideDisplayName('sortableElement', WrappedComponent)), defineProperty(_class, "contextTypes", {
	    manager: PropTypes.object.isRequired
	  }), defineProperty(_class, "propTypes", propTypes$1), defineProperty(_class, "defaultProps", {
	    collection: 0
	  }), _temp;
	}

	exports.SortableContainer = sortableContainer;
	exports.sortableContainer = sortableContainer;
	exports.SortableElement = sortableElement;
	exports.sortableElement = sortableElement;
	exports.SortableHandle = sortableHandle;
	exports.sortableHandle = sortableHandle;
	exports.arrayMove = arrayMove;

	Object.defineProperty(exports, '__esModule', { value: true });

}));


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _readFromConsumerApi2.default)('vendor')().ReactDOM;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWithErrorHandling = undefined;

var _readFromConsumerApi = __webpack_require__(0);

var _readFromConsumerApi2 = _interopRequireDefault(_readFromConsumerApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _readFromConsumerApi2.default)('NeosProjectPackages')().NeosUiBackendConnectorDefault;


var fetchWithErrorHandling = (0, _readFromConsumerApi2.default)('NeosProjectPackages')().NeosUiBackendConnector.fetchWithErrorHandling;
exports.fetchWithErrorHandling = fetchWithErrorHandling;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const arrayMoveMutate = (array, from, to) => {
	array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};

const arrayMove = (array, from, to) => {
	array = array.slice();
	arrayMoveMutate(array, from, to);
	return array;
};

module.exports = arrayMove;
// TODO: Remove this for the next major release
module.exports.default = arrayMove;

module.exports.mutate = arrayMoveMutate;


/***/ })
/******/ ]);
//# sourceMappingURL=Plugin.js.map