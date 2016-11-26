var oneMinuteSignup = oneMinuteSignup || {};
oneMinuteSignup.TabService = function () {

    var self = this;
    var tabsContainer = [];

    this.createTabOrNavigate = function (tabProperties, callback) {

        try {
            if (!tabProperties.tabId) {
                self.createTab(tabProperties, callback);
                return;
            }

            oneMinuteSignup.ExtensionProxyService.updateTab(tabProperties.tabId, tabProperties.url, function (tab) {
                if (!tab) {
                    self.createTab(tabProperties, callback);
                } else {
                    callback(tab.id);
                }
            });
        } catch (error) {
            self.createTab(tabProperties, callback);
        }
    };

    this.createTab = function (tabProperties, callback) {
        oneMinuteSignup.ExtensionProxyService.createTab(tabProperties.url, false, function (tab) {
            tabProperties.tab = tab;
            tabProperties.tabId = tab.id;
            callback(tabProperties.tab.id);
        }, function (tabId) {
            var foundTabs = tabsContainer.filter(function (tab) {
                return tab.tabId === tabId;
            });
            if (foundTabs.length > 0) {
                var index = tabsContainer.indexOf(foundTabs[0]);
                if (index !== -1) {
                    tabsContainer.splice(index, 1);
                }
            }
        });
    };

    this.closeTab = function (tabProperties) {
        if (!tabProperties.tabId) {
            return;
        }
        oneMinuteSignup.ExtensionProxyService.closeTab(tabProperties.tabId);
        var index = tabsContainer.indexOf(tabProperties);
        if (index !== -1) {
            tabsContainer.splice(index, 1);
        }
    };

    this.focusTabById = function (tabId) {
        oneMinuteSignup.ExtensionProxyService.focusTabById(tabId);
    };

    this.getTabPropertiesByAppId = function (appId) {
        // Find existing tab
        var existing = tabsContainer.filter(function (tabProperties) {
            return tabProperties.appId === appId;
        });
        if (existing.length > 0) {
            return existing[0];
        }
        // or return new
        var tabProperties = new oneMinuteSignup.TabProperties();
        tabProperties.appId = appId;
        tabsContainer.push(tabProperties);

        return tabProperties;
    };

    this.getTabPropertiesByTabId = function (tabId) {
        // Find existing tab
        var existing = tabsContainer.filter(function (tabProperties) {
            return tabProperties.tabId === tabId;
        });
        if (existing.length > 0) {
            return existing[0];
        }

        return null;
    };
};
