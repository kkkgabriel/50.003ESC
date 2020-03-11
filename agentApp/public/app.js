(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("components/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _kendoReactConversationalUi = require('@progress/kendo-react-conversational-ui');

var _kendoReactDialogs = require('@progress/kendo-react-dialogs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.rainbowSignIn();
        _this.user = {
            name: "gabriel",
            id: 1
        };
        _this.bot = {
            name: "other contact name",
            id: 0
        };
        _this.state = {
            "version": rainbowSDK.version(),
            visible: false,
            "isAvailable": false,
            messages: [{
                author: _this.bot,
                timestamp: new Date(),
                text: "Hello there."
            }]
        };
        _this.addNewMessage = _this.addNewMessage.bind(_this);
        _this.sendToRainbow = _this.sendToRainbow.bind(_this);
        _this.toggleDialog = _this.toggleDialog.bind(_this);
        _this.toggleisAvailable = _this.toggleisAvailable.bind(_this);
        _this.reroute = _this.reroute.bind(_this);
        _this.updateIncomingMessage = _this.updateIncomingMessage.bind(_this);
        _this.rainbowSignIn = _this.rainbowSignIn.bind(_this);

        var onNewMessageReceived = function onNewMessageReceived(event) {
            console.log("this works");
            this.toggleDialog();
        };
        document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessageReceived);
        return _this;
    }

    _createClass(App, [{
<<<<<<< HEAD
=======
        key: 'rainbowSignIn',
        value: function rainbowSignIn() {
            var rainbowLogin = "HomeLine@gmail.com";
            var rainbowPassword = "Longpassword!1";
            rainbowSDK.connection.signin(rainbowLogin, rainbowPassword).then(function (account) {
                console.log("this works!");
            }).catch(function (err) {
                console.log(err);
            });
        }
    }, {
        key: 'reroute',
        value: function reroute() {
            console.log("this is rerouting");
        }
    }, {
        key: 'toggleDialog',
        value: function toggleDialog() {
            this.setState({
                visible: !this.state.visible
            });
        }
    }, {
        key: 'toggleisAvailable',
        value: function toggleisAvailable() {
            this.setState({
                "isAvailable": !this.state.isAvailable,
                visible: !this.state.visible
            });
        }
    }, {
        key: 'addNewMessage',
        value: function addNewMessage(event) {
            var myResponse = Object.assign({}, event.message);
            this.setState(function (prevState) {
                return {
                    messages: [].concat(_toConsumableArray(prevState.messages), [myResponse])
                };
            });
            this.sendToRainbow(event.message);
        }
    }, {
        key: 'sendToRainbow',
        value: function sendToRainbow(question) {
            console.log("to add in rainbow send message here");
        }
    }, {
        key: 'updateIncomingMessage',
        value: function updateIncomingMessage() {
            var theirResponse = {
                author: this.bot,
                text: "update text here",
                timestamp: new Date()
            };
            this.setState(function (prevState) {
                return {
                    messages: [].concat(_toConsumableArray(prevState.messages), [theirResponse])
                };
            });
        }
    }, {
>>>>>>> omnifarter
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
<<<<<<< HEAD
                { id: 'content' },
                _react2.default.createElement(
                    _reactRouterDom.BrowserRouter,
                    null,
                    _react2.default.createElement(
                        _reactRouterDom.Switch,
                        null,
                        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: "/", component: _Login2.default }),
                        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: "/home" })
                    )
                )
=======
                null,
                _react2.default.createElement(
                    'button',
                    { className: 'k-button', onClick: this.toggleDialog },
                    'Open Dialog'
                ),
                this.state.visible && _react2.default.createElement(
                    _kendoReactDialogs.Dialog,
                    { title: "Please confirm", onClose: this.toggleDialog },
                    _react2.default.createElement(
                        'p',
                        { style: { margin: "25px", textAlign: "center" } },
                        this.user["name"],
                        ' is trying to connect to you. Do you want to accept?'
                    ),
                    _react2.default.createElement(
                        _kendoReactDialogs.DialogActionsBar,
                        null,
                        _react2.default.createElement(
                            'button',
                            { className: 'k-button', onClick: this.toggleDialog },
                            'Decline'
                        ),
                        _react2.default.createElement(
                            'button',
                            { className: 'k-button', onClick: this.toggleisAvailable },
                            'Accept'
                        )
                    )
                ),
                this.state.isAvailable ? _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_kendoReactConversationalUi.Chat, { user: this.user,
                        messages: this.state.messages,
                        onMessageSend: this.addNewMessage,
                        placeholder: "Type a message...",
                        width: 400 }),
                    _react2.default.createElement(
                        'button',
                        { className: 'k-button', onClick: this.reroute },
                        'Reroute '
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'k-button', onClick: this.updateIncomingMessage },
                        ' updateIncomingMessage'
                    )
                ) : null
>>>>>>> omnifarter
            );
        }
    }]);

    return App;
}(_react2.default.Component);

exports.default = App;
});

;require.register("components/Home/Home.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = function Home(props) {
    return _react2.default.createElement(
        'div',
        null,
        'Hi i am in Home'
    );
};

exports.default = Home;
});

require.register("components/Login/Login.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import axios from 'axios'
// import { Form, Field } from '@progress/kendo-react-form';
// import { Input } from '@progress/kendo-react-inputs';
var Login = function (_Component) {
    _inherits(Login, _Component);

    function Login() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Login);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Login.__proto__ || Object.getPrototypeOf(Login)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            username: '',
            password: ''
        }, _this.loginHandler = function () {
            console.log(_this.state);
            // var rainbowLogin = "mario.kosasih@gmail.com"
            // var rainbowPassword = "6OCJc97dWp*2"
            rainbowSDK.connection.signin(_this.state.username, _this.state.password).then(function (account) {
                console.log("Successful Login");
                console.log(account);
                // route to agent page
                console.log(_this.props);
                _this.props.history.push('/home');
            }).catch(function (err) {
                console.log("failed to login");
            });
        }, _this.onInputChange = function (event, stateKey) {
            var login = _extends({}, _this.state);
            login[stateKey] = event.target.value;
            _this.setState(login);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Login, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            console.log(rainbowSDK);
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement('input', { type: 'text', value: this.state.username, onChange: function onChange(event) {
                        return _this2.onInputChange(event, 'username');
                    } }),
                _react2.default.createElement('input', { type: 'text', value: this.state.password, onChange: function onChange(event) {
                        return _this2.onInputChange(event, 'password');
                    } }),
                _react2.default.createElement(
                    'button',
                    { onClick: this.loginHandler },
                    'Login'
                )
            );
        }
    }]);

    return Login;
}(_react.Component);

exports.default = (0, _reactRouterDom.withRouter)(Login);
});

;require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _App = require('components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {

    // do your setup here
    console.log("[DEMO] :: Starter-Kit of the Rainbow SDK for Web with React started!");

<<<<<<< HEAD
    var appId = "dcb692b0564b11eabb3887f44e39165a";
    var appSecret = "BrxZMv6ThPI1ZfdSRvpWhj6BZudBtQzI6dxHMmqV6uDEGmwO6WuvSpkfmA64cEhS";
=======
    var applicationID = "dcb692b0564b11eabb3887f44e39165a",
        applicationSecret = "BrxZMv6ThPI1ZfdSRvpWhj6BZudBtQzI6dxHMmqV6uDEGmwO6WuvSpkfmA64cEhS";
>>>>>>> omnifarter

    /* Bootstrap the SDK */
    angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

    /* Callback for handling the event 'RAINBOW_ONREADY' */
    var onReady = function onReady() {
        console.log("[DEMO] :: On SDK Ready !");
        // do something when the SDK is ready
        _reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.querySelector('#app'));
    };

    /* Callback for handling the event 'RAINBOW_ONCONNECTIONSTATECHANGED' */
    var onLoaded = function onLoaded() {
        console.log("[DEMO] :: On SDK Loaded !");

        rainbowSDK.initialize(appId, appSecret).then(function () {
            console.log("[DEMO] :: Rainbow SDK is initialized!");
        }).catch(function (err) {
            console.log("[DEMO] :: Something went wrong with the SDK...", err);
        });
    };

    /* Listen to the SDK event RAINBOW_ONREADY */
    $(document).on(rainbowSDK.RAINBOW_ONREADY, onReady);

    /* Listen to the SDK event RAINBOW_ONLOADED */
    $(document).on(rainbowSDK.RAINBOW_ONLOADED, onLoaded);

    /* Load the SDK */
    rainbowSDK.load();
});
});

require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window["$"] = require("jquery");
window.jQuery = require("jquery");
window.moment = require("moment");
window.angular = require("angular");


});})();require('___globals___');


//# sourceMappingURL=app.js.map