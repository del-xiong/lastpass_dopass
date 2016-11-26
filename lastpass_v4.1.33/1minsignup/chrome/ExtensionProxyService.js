var oneMinuteSignup = oneMinuteSignup || {};
oneMinuteSignup.ExtensionProxyService = {
    createTab: function (url, active, callback) {
        chrome.tabs.create({url: url, active: active}, function (tab) {
            if (typeof callback === "function") {
                callback(new oneMinuteSignup.Tab(tab.id, tab.url));
            }
        });
    },
    updateTab: function (tabId, url, callback) {
        chrome.tabs.update(tabId, {url: url}, function (tab) {
            if (typeof callback === "function") {
                callback(tab ? new oneMinuteSignup.Tab(tab.id, tab.url) : null);
            }
        });
    },
    onMessage: function (callback) {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (typeof callback === "function") {
                    callback(request, sender.tab.id, function() {
                        sendResponse();
                    });
                }
            });
    },
    onUpdateTab: function (callback) {
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if (/*changeInfo.url || */changeInfo.status === 'complete') {
                if (tab && typeof callback === "function") {
                    callback(tab.id, changeInfo.url);
                }
            }
        });

    },
    removeCookies: function (cookieUrl, callback) {
        chrome.permissions.request({permissions: ['cookies']}, function (granted) {
            if (granted) {
                chrome.cookies.getAll({url: cookieUrl}, function (cookies) {
                    cookies.forEach(function (cookie) {
                        chrome.cookies.remove({url: cookieUrl, name: cookie.name});
                    });
                    if (typeof callback === "function") {
                        callback();
                    }
                });
            }
        });
    },
    executeScript: function (tabId, script, callback) {
        chrome.tabs.executeScript(tabId, {code: script}, callback);
    },
    injectScript: function (tabId, file, callback) {
        chrome.tabs.executeScript(tabId, {file: file}, callback);
    },
    executeScriptWithFrameWork: function (tabProperties) {
        oneMinuteSignup.ExtensionProxyService.injectScript(tabProperties.tabId, '1minsignup/ContentScripts/doNotCloseWarning.js', function () {
            oneMinuteSignup.ExtensionProxyService.injectScript(tabProperties.tabId, '1minsignup/Framework.js', function () {
                oneMinuteSignup.ExtensionProxyService.injectScript(tabProperties.tabId, '1minsignup/chrome/ExtensionHostEnvironment.js', function () {
                    oneMinuteSignup.ExtensionProxyService.executeScript(tabProperties.tabId, tabProperties.activeScript, function () {
                        oneMinuteSignup.ExtensionProxyService.executeScript(tabProperties.tabId, tabProperties.activeTriggerScript);
                    });
                });
            });
        });
    },
    sendMessageToSite: function (message, tabId) {
        chrome.tabs.sendMessage(tabId, message);
    },
    focusTabById: function (tabId) {
        chrome.tabs.update(tabId, {active: true});
    },
    focusTabByUrl: function (urlRegex) {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                if (tab.url.match(urlRegex)) {
                    chrome.tabs.update(tab.id, {active: true});
                }
            });
        });
    },
    closeTab: function (tabId) {
        chrome.tabs.get(tabId, function (tab) {
            if (tab) {
                chrome.tabs.remove(tab.id);
            }
        });
    }
};
