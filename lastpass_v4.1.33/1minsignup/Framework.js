var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
            /**
             *
             */
            (function (Environments) {
                Environments[Environments["chrome"] = 0] = "chrome";
                Environments[Environments["firefox"] = 1] = "firefox";
                Environments[Environments["safari"] = 2] = "safari";
                Environments[Environments["ios"] = 3] = "ios";
                Environments[Environments["android"] = 4] = "android";
                Environments[Environments["mock"] = 5] = "mock";
            })(Automation.Environments || (Automation.Environments = {}));
            var Environments = Automation.Environments;
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="Environments.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="Environments.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            var Android;
            (function (Android) {
                'use strict';
            })(Android = Automation.Android || (Automation.Android = {}));
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="IHostEnvironment.ts"/>
///<reference path="IAndroidHostEnvironment.ts"/>
///<reference path="Environments.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            var Android;
            (function (Android) {
                'use strict';
                /**
                 * Represents the host environment.
                 */
                var AndroidHostEnvironment = (function () {
                    function AndroidHostEnvironment(proxy) {
                        this.proxy = proxy;
                    }
                    AndroidHostEnvironment.prototype.reportDone = function () {
                        this.proxy.reportDone();
                    };
                    AndroidHostEnvironment.prototype.userInformationNeeded = function () {
                        this.proxy.userInformationNeeded();
                    };
                    AndroidHostEnvironment.prototype.reportError = function (error) {
                        var errorMessage;
                        if (typeof error === 'string') {
                            errorMessage = (error);
                        }
                        else {
                            errorMessage = JSON.stringify({ name: error.name, message: error.message });
                        }
                        this.proxy.reportError(errorMessage);
                    };
                    AndroidHostEnvironment.prototype.reportLog = function (data) {
                        this.proxy.reportLog(JSON.stringify(data));
                    };
                    AndroidHostEnvironment.prototype.isMobile = function () {
                        return true;
                    };
                    AndroidHostEnvironment.prototype.getEnvironment = function () {
                        return Automation.Environments.android;
                    };
                    return AndroidHostEnvironment;
                }());
                Android.AndroidHostEnvironment = AndroidHostEnvironment;
            })(Android = Automation.Android || (Automation.Android = {}));
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="IHostEnvironment.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            var Promise;
            (function (Promise_1) {
                'use strict';
                /**
                 * Reperesents the state of promise
                 */
                (function (PromiseState) {
                    PromiseState[PromiseState["Pending"] = 0] = "Pending";
                    PromiseState[PromiseState["Resolved"] = 1] = "Resolved";
                    PromiseState[PromiseState["Failed"] = 2] = "Failed";
                })(Promise_1.PromiseState || (Promise_1.PromiseState = {}));
                var PromiseState = Promise_1.PromiseState;
                /**
                 * Simple Promise implementation with a then method
                 * no chaining, promise.all and other features
                 */
                var Promise = (function () {
                    function Promise(hostEnvironment) {
                        this.hostEnvironment = hostEnvironment;
                        this.state = PromiseState.Pending;
                        this.data = null;
                        this.error = null;
                        this.okCallbacks = [];
                        this.errorCallbacks = [];
                    }
                    Promise.prototype.then = function (okCallback, errorCallback) {
                        if (errorCallback === void 0) { errorCallback = null; }
                        if (this.state === PromiseState.Resolved) {
                            try {
                                okCallback(this.data);
                            }
                            catch (error) {
                                this.hostEnvironment.reportError(error);
                            }
                        }
                        else if (this.state === PromiseState.Failed) {
                            errorCallback(this.error);
                        }
                        else {
                            this.okCallbacks.push(okCallback);
                            if (errorCallback) {
                                this.errorCallbacks.push(errorCallback);
                            }
                        }
                    };
                    return Promise;
                }());
                Promise_1.Promise = Promise;
                /**
                 *  Defer to return a promise
                 */
                var Deferred = (function () {
                    function Deferred(hostEnvironment) {
                        this.hostEnvironment = hostEnvironment;
                        this.promise = new Promise(this.hostEnvironment);
                    }
                    Deferred.prototype.resolve = function (data) {
                        var _this = this;
                        this.promise.state = PromiseState.Resolved;
                        this.promise.data = data;
                        this.promise.okCallbacks.forEach(function (callback) {
                            try {
                                callback(data);
                            }
                            catch (error) {
                                _this.hostEnvironment.reportError(error);
                            }
                        });
                    };
                    Deferred.prototype.reject = function (error) {
                        this.promise.state = PromiseState.Failed;
                        this.promise.error = error;
                        this.hostEnvironment.reportError(error);
                        this.promise.errorCallbacks.forEach(function (callback) {
                            callback(error);
                        });
                    };
                    return Deferred;
                }());
                Promise_1.Deferred = Deferred;
            })(Promise = Automation.Promise || (Automation.Promise = {}));
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
            /**
             * Contains methods for common functions.
             */
            var Document = (function () {
                function Document() {
                }
                /**
                 * Submits a form.
                 * @param selector
                 */
                Document.submitForm = function (form) {
                    form.submit();
                };
                Object.defineProperty(Document.prototype, "location", {
                    /**
                     * Gets the current location of the document.
                     * @param selector
                     */
                    get: function () {
                        return window.location.href;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Finds an element using a selector.
                 * @param selector
                 */
                Document.prototype.findElement = function (selector) {
                    var selectorArray = new Array();
                    if (selector instanceof Array) {
                        selectorArray = selector;
                    }
                    else if (typeof selector === 'string') {
                        selectorArray.push(selector);
                    }
                    for (var i = 0; i < selectorArray.length; i++) {
                        var element = document.querySelector(selectorArray[i]);
                        if (element) {
                            return element;
                        }
                    }
                    return null;
                };
                /**
                 * Finds elements using a selector.
                 * @param selector
                 */
                Document.prototype.findAllElements = function (selector) {
                    var selectorArray = new Array();
                    if (selector instanceof Array) {
                        selectorArray = selector;
                    }
                    else if (typeof selector === 'string') {
                        selectorArray.push(selector);
                    }
                    for (var i = 0; i < selectorArray.length; i++) {
                        var element = document.querySelectorAll(selectorArray[i]);
                        if (element) {
                            return element;
                        }
                    }
                    return null;
                };
                /**
                 * Checks whether an element specified by a selector exists.
                 * @param selector
                 */
                Document.prototype.elementExists = function (selector) {
                    return this.findElement(selector) !== null;
                };
                /**
                 * Clicks a button.
                 * @param selector
                 */
                Document.prototype.clickButton = function (button) {
                    this.triggerEvents(['mousedown', 'mouseup'], button);
                    button.click();
                };
                /**
                 * Clicks a button by trigger a mousedown/up events.
                 * @param selector
                 */
                Document.prototype.mouseClickButton = function (button) {
                    this.triggerEvents(['mousedown', 'mouseup'], button);
                };
                /**
                 * Checks a checkbox.
                 * @param selector
                 */
                Document.prototype.checkCheckBox = function (checkBox) {
                    checkBox.checked = true;
                };
                /**
                 * Checks a radiobutton.
                 * @param selector
                 */
                Document.prototype.checkRadioButton = function (radioButton) {
                    radioButton.checked = true;
                };
                /**
                 * Checks a radiobutton.
                 * @param selector
                 */
                Document.prototype.setValue = function (input, value) {
                    this.triggerEvents(['focus', 'keydown', 'keydown'], input);
                    input.value = value;
                    this.triggerEvents(['keyup', 'keyup', 'input', 'blur', 'change'], input);
                };
                Document.prototype.triggerEvents = function (events, item) {
                    for (var i = 0, len = events.length; i < len; i++) {
                        var focusEvt = document.createEvent('HTMLEvents');
                        focusEvt.initEvent(events[i], true, true);
                        item.dispatchEvent(focusEvt);
                    }
                };
                return Document;
            }());
            Automation.Document = Document;
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="Promise.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
            /**
             * Contains helper methods for web UI automation.
             */
            var Helpers = (function () {
                function Helpers(document, hostEnvironment) {
                    this.document = document;
                    this.hostEnvironment = hostEnvironment;
                }
                Helpers.prototype.clearTimeout = function () {
                    clearInterval(this.intervalHandle);
                };
                ;
                /**
                 * Waits for a navigation to happen for a given timeout.
                 * @param timeout The amount of time (in milliseconds) to wait for a navigation.
                 */
                Helpers.prototype.waitForNavigation = function (timeout) {
                    var _this = this;
                    if (timeout === void 0) { timeout = 10 * 1000; }
                    clearInterval(this.intervalHandle);
                    this.intervalHandle = setInterval(function () {
                        clearInterval(_this.intervalHandle);
                        _this.hostEnvironment.reportError(new Automation.NavigationTimeoutError());
                    }, timeout);
                };
                /**
                 * Waits for at least an element specified by selector to appear in the DOM.
                 * @param selector Selector to find the element.
                 */
                Helpers.prototype.waitForSelector = function (selector, timeout) {
                    var _this = this;
                    if (timeout === void 0) { timeout = 10 * 1000; }
                    var deferred = new Automation.Promise.Deferred(this.hostEnvironment);
                    var interval = 500;
                    var elapsedTime = 0;
                    clearInterval(this.intervalHandle);
                    this.intervalHandle = window.setInterval(function () {
                        if (_this.document.elementExists(selector)) {
                            window.clearInterval(_this.intervalHandle);
                            deferred.resolve(_this.document.findElement(selector));
                        }
                        if (elapsedTime >= timeout) {
                            window.clearInterval(_this.intervalHandle);
                            var error = new Automation.SelectorNotFoundError(selector);
                            deferred.reject(error);
                            throw error;
                        }
                        elapsedTime += interval;
                    }, interval);
                    return deferred.promise;
                };
                /**
                 * Waits for the element specified by a selector to disappear in the DOM.
                 * @param selector Selector to find the element.
                 */
                Helpers.prototype.waitForSelectorToDisappear = function (selector, timeout) {
                    var _this = this;
                    if (timeout === void 0) { timeout = 10 * 1000; }
                    var deferred = new Automation.Promise.Deferred(this.hostEnvironment);
                    var interval = 500;
                    var elapsedTime = 0;
                    clearInterval(this.intervalHandle);
                    this.intervalHandle = window.setInterval(function () {
                        if (!_this.document.elementExists(selector)) {
                            window.clearInterval(_this.intervalHandle);
                            deferred.resolve();
                        }
                        if (elapsedTime >= timeout) {
                            window.clearInterval(_this.intervalHandle);
                            var error = new Automation.SelectorFoundError(selector);
                            deferred.reject(error);
                            throw error;
                        }
                        elapsedTime += interval;
                    }, interval);
                    return deferred.promise;
                };
                /**
                 * Clicks a button specified by selector.
                 * @param selector Selector to find the button.
                 */
                Helpers.prototype.clickButton = function (selector) {
                    var button = this.document.findElement(selector);
                    if (button === null) {
                        throw new Automation.SelectorNotFoundError(selector);
                    }
                    this.document.clickButton(button);
                };
                /**
                 * Clicks a button specified by selector.
                 * @param selector Selector to find the button.
                 */
                Helpers.prototype.mouseClickButton = function (selector) {
                    var button = this.document.findElement(selector);
                    if (button === null) {
                        throw new Automation.SelectorNotFoundError(selector);
                    }
                    this.document.mouseClickButton(button);
                };
                /**
                 * Checks a radio button specified by selector.
                 * @param selector Selector to find the radio button.
                 */
                Helpers.prototype.checkRadioButton = function (selector) {
                    var radioButton = this.document.findElement(selector);
                    if (radioButton === null) {
                        throw new Automation.SelectorNotFoundError(selector);
                    }
                    this.document.clickButton(radioButton);
                };
                /**
                 * Sets the value of an input element.
                 * @param selector Selector to find the input element.
                 * @param value The value to set to.
                 */
                Helpers.prototype.setValue = function (selector, value) {
                    var input = this.document.findElement(selector);
                    if (input === null) {
                        throw new Automation.SelectorNotFoundError(selector);
                    }
                    this.document.setValue(input, value);
                };
                return Helpers;
            }());
            Automation.Helpers = Helpers;
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="Document.ts"/>
///<reference path="Helpers.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
            /**
             *
             */
            var SelectorNotFoundError = (function (_super) {
                __extends(SelectorNotFoundError, _super);
                function SelectorNotFoundError(selector) {
                    _super.call(this, "Selector not found: " + selector);
                    this.name = 'Selector not found Error';
                    this.message = 'Selector not found: ' + selector;
                    this.stack = (new Error()).stack;
                }
                return SelectorNotFoundError;
            }(Error));
            Automation.SelectorNotFoundError = SelectorNotFoundError;
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="Environments.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
            var MockHostEnvironment = (function () {
                function MockHostEnvironment() {
                }
                MockHostEnvironment.prototype.reportDone = function () {
                    console.log('Done!');
                };
                MockHostEnvironment.prototype.userInformationNeeded = function () {
                    console.log('User information needed!');
                };
                MockHostEnvironment.prototype.reportError = function (error) {
                    console.log('Error: ' + error.message);
                };
                MockHostEnvironment.prototype.reportLog = function (data) {
                    console.log('Log: ' + data);
                };
                MockHostEnvironment.prototype.isMobile = function () {
                    return false;
                };
                MockHostEnvironment.prototype.getEnvironment = function () {
                    return Automation.Environments.mock;
                };
                return MockHostEnvironment;
            }());
            Automation.MockHostEnvironment = MockHostEnvironment;
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
            /**
             *
             */
            var SelectorFoundError = (function (_super) {
                __extends(SelectorFoundError, _super);
                function SelectorFoundError(selector) {
                    _super.call(this, "Selector still found: " + selector);
                    this.name = 'Selector found Error';
                    this.message = 'Selector found: ' + selector;
                    this.stack = (new Error()).stack;
                }
                return SelectorFoundError;
            }(Error));
            Automation.SelectorFoundError = SelectorFoundError;
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="Promise.ts"/>
///<reference path="IWebsiteContext.ts"/>
///<reference path="IHostEnvironment.ts"/>
///<reference path="Document.ts"/>
///<reference path="Helpers.ts"/>
///<reference path="SelectorNotFoundError.ts"/>
///<reference path="MockHostEnvironment.ts"/>
///<reference path="SelectorNotFoundError.ts"/>
///<reference path="SelectorFoundError.ts"/>
///<reference path="Environments.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
            var HostWrapper = (function () {
                function HostWrapper(host) {
                    this.host = host;
                }
                HostWrapper.prototype.reportDone = function () {
                    this.clearTimeoutFunction();
                    this.host.reportDone();
                };
                ;
                HostWrapper.prototype.userInformationNeeded = function () {
                    this.clearTimeoutFunction();
                    this.host.userInformationNeeded();
                };
                HostWrapper.prototype.reportError = function (error) {
                    this.clearTimeoutFunction();
                    this.host.reportError(error);
                };
                HostWrapper.prototype.reportLog = function (data) {
                    this.host.reportLog(data);
                };
                HostWrapper.prototype.setClearTimeoutFunction = function (clearTimeoutFunction) {
                    this.clearTimeoutFunction = clearTimeoutFunction;
                };
                HostWrapper.prototype.isMobile = function () {
                    return this.host.isMobile();
                };
                HostWrapper.prototype.getEnvironment = function () {
                    return this.host.getEnvironment();
                };
                return HostWrapper;
            }());
            var Context = (function () {
                function Context(hostEnvironment) {
                    var _this = this;
                    this.document = new Automation.Document();
                    this.helpers = null;
                    this.host = null;
                    var hostWrapper = new HostWrapper(hostEnvironment);
                    this.host = hostWrapper;
                    this.helpers = new Automation.Helpers(this.document, this.host);
                    hostWrapper.setClearTimeoutFunction(function () { return _this.helpers.clearTimeout(); });
                }
                Context.prototype.run = function (script) {
                    try {
                        this.helpers.waitForNavigation();
                        script();
                    }
                    catch (error) {
                        this.host.reportError(error);
                    }
                };
                return Context;
            }());
            Automation.Context = Context;
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
///<reference path="IHostEnvironment.ts"/>
///<reference path="IAndroidHostEnvironment.ts"/>
///<reference path="Environments.ts"/>
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            var IOS;
            (function (IOS) {
                'use strict';
                /**
                 * Represents the host environment.
                 */
                var IOSHostEnvironment = (function () {
                    function IOSHostEnvironment() {
                    }
                    IOSHostEnvironment.prototype.reportDone = function () {
                        window.location.href = IOSHostEnvironment.redirectBase + 'done';
                    };
                    IOSHostEnvironment.prototype.userInformationNeeded = function () {
                        window.location.href = IOSHostEnvironment.redirectBase + 'user';
                    };
                    IOSHostEnvironment.prototype.reportError = function (error) {
                        window.location.href = IOSHostEnvironment.redirectBase + 'error/error?name='
                            + error.name + '&message=' + error.message;
                    };
                    IOSHostEnvironment.prototype.reportLog = function (data) {
                        window.location.href = IOSHostEnvironment.redirectBase + 'log/log?data=' + JSON.stringify(data);
                    };
                    IOSHostEnvironment.prototype.isMobile = function () {
                        return true;
                    };
                    IOSHostEnvironment.prototype.getEnvironment = function () {
                        return Automation.Environments.ios;
                    };
                    IOSHostEnvironment.redirectBase = 'lpomscallback://';
                    return IOSHostEnvironment;
                }());
                IOS.IOSHostEnvironment = IOSHostEnvironment;
            })(IOS = Automation.IOS || (Automation.IOS = {}));
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
var LastPass;
(function (LastPass) {
    var Web;
    (function (Web) {
        var Automation;
        (function (Automation) {
            'use strict';
            /**
             *
             */
            var NavigationTimeoutError = (function (_super) {
                __extends(NavigationTimeoutError, _super);
                function NavigationTimeoutError() {
                    _super.call(this, "Navigation timed out.");
                    this.name = 'Navigation time out Error';
                    this.message = 'Navigation timed out.';
                    this.stack = (new Error()).stack;
                }
                return NavigationTimeoutError;
            }(Error));
            Automation.NavigationTimeoutError = NavigationTimeoutError;
        })(Automation = Web.Automation || (Web.Automation = {}));
    })(Web = LastPass.Web || (LastPass.Web = {}));
})(LastPass || (LastPass = {}));
