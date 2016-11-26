(function () {

    var lastPassSiteUrlRegex = new RegExp(base_url || lp_base, "gi");
    var MessageType = oneMinuteSignup.MessageType;
    var ScriptState = oneMinuteSignup.ScriptState;
    var ScriptType = oneMinuteSignup.ScriptType;

    var tabService = new oneMinuteSignup.TabService();

    var senderTabId = null;

    var authTabId = null;
    var fromAuthTabId = null;

    // Message handler
    oneMinuteSignup.ExtensionProxyService.onMessage(function (message, tabId, done) {

        var tabProperties = tabService.getTabPropertiesByTabId(tabId);

        switch (message.type) {
            case MessageType.ResetRequestScript:
            case MessageType.ResetScript:
            case MessageType.LogoutScript:
                senderTabId = tabId;
                oneMinuteSignup.MessageService.tabId = tabId;
                _handleResetScripts(message);
                done();
                break;
            case MessageType.Done:
                console.log("DONE APP", tabProperties, tabId);
                _handleDone(tabProperties);
                done();
                break;
            case MessageType.Error:
                _handleError(message, tabProperties);
                done();
                break;
            case MessageType.NavigateToTab:
                _handleNavigateToTab(message);
                done();
                break;
            case MessageType.UserInformationNeeded:
                _handleUserInfoNeeded(tabProperties);
                done();
                break;
            case MessageType.GetToken:
                senderTabId = tabId;
                oneMinuteSignup.MessageService.tabId = tabId;
                oneMinuteSignup.MessageService.sendToken();
                done();
                break;
            case MessageType.LaunchApplication:
                oneMinuteSignup.ExtensionProxyService.createTab(message.data.url, true, function () {
                });
                done();
                break;
            case MessageType.CloseTab:
                _handleCloseTab(message);
                done();
                break;
            case MessageType.GetOauthToken:
                senderTabId = tabId;
                oneMinuteSignup.MessageService.tabId = tabId;
                _getOauthToken(message, tabId);
                done();
                break;
            case MessageType.ReceivedOauthToken:
                _receivedOauthToken(message);
                done();
                break;
        }
    });

    // Tab created or navigated
    // We need to inject scripts if script running not in done state
    oneMinuteSignup.ExtensionProxyService.onUpdateTab(function (tabId, url) {
        var tabProperties = tabService.getTabPropertiesByTabId(tabId);
        if (tabProperties) {
            console.log('App: ' + tabProperties.appId + ' Change url', url);
            if (tabProperties.currentState !== oneMinuteSignup.ScriptState.done) {
                console.log('App: ' + tabProperties.appId + ' Execute script');
                oneMinuteSignup.ExtensionProxyService.executeScriptWithFrameWork(tabProperties);
            }
        }
    });

    function _handleResetScripts(message) {
        if (message.data) {
            message.data.forEach(function (messageData) {
                var currentAppId = messageData.appId;
                var tabProperties = tabService.getTabPropertiesByAppId(currentAppId);

                // Handle state
                if (tabProperties.currentState !== ScriptState.done) {
                    oneMinuteSignup.MessageService.sendLog(tabProperties.appId, tabProperties.type, 'Script running not in done state');
                }
                tabProperties.setState(ScriptState.running);
                // Set script timeout
                tabProperties.setTimeout(_scriptTimeoutHandler);

                // Set scripts and create tab
                tabProperties.appLoginUrl = messageData.appLoginUrl || messageData.url;
                tabProperties.appName = messageData.appName;
                tabProperties.url = messageData.url;
                tabProperties.username = messageData.username;
                tabProperties.activeScript = messageData.script;
                if (message.type === MessageType.ResetRequestScript) {
                    tabProperties.type = ScriptType.request;
                    tabProperties.activeTriggerScript = oneMinuteSignup.AppService.getTriggerScript(ScriptType.request, messageData.username);

                } else if (message.type === MessageType.ResetScript) {
                    tabProperties.type = ScriptType.change;
                    var newPassword = oneMinuteSignup.AppService.generatePassword(messageData.passwordPolicy);
                    console.log(messageData.url, newPassword);
                    tabProperties.newPassword = newPassword;
                    tabProperties.activeTriggerScript = oneMinuteSignup.AppService.getTriggerScript(ScriptType.change, newPassword);
                } else if (message.type === MessageType.LogoutScript) {
                    tabProperties.type = ScriptType.logout;
                    tabProperties.activeTriggerScript = oneMinuteSignup.AppService.getTriggerScript(ScriptType.logout);
                }
                console.log('App: ' + tabProperties.appId + ' Clear cookies');
                // Script injection is handled by the tab event (to avoid duplicate insertation)
                if (messageData.url) {
                    tabService.createTabOrNavigate(tabProperties, function (tabId) {
                    });
                } else {
                    var error = new Error('No ' + messageData.scriptType + 'url found on ' + messageData.appName);
                    _handleError({error: error}, tabProperties);
                }

            });
        }
    }

    function _handleNavigateToTab(message) {
        var tabProperties = tabService.getTabPropertiesByAppId(message.appId);
        oneMinuteSignup.ExtensionProxyService.focusTabById(tabProperties.tabId);
    }

    function _handleUserInfoNeeded(tabProperties) {
        if (tabProperties) {
            // Handle state
            if (tabProperties.currentState === ScriptState.done) {
                oneMinuteSignup.MessageService.sendLog(tabProperties.appId, tabProperties.type, 'Script done but got UseInfoNeeded');
            } else {
                tabProperties.clearTimeout();
                tabProperties.setState(ScriptState.suspended);
                oneMinuteSignup.MessageService.sendUserInfoNeeded(tabProperties.appId, tabProperties.type);
            }
        }
    }

    function _handleDone(tabProperties) {
        if (tabProperties) {
            tabProperties.clearTimeout();

            // Handle state
            if (tabProperties.currentState === ScriptState.done) {
                oneMinuteSignup.MessageService.sendLog(tabProperties.appId, tabProperties.type, 'Script running already in done state');
            } else {
                if (tabProperties.currentState === ScriptState.suspended) {
                    oneMinuteSignup.ExtensionProxyService.focusTabById(senderTabId);
                }
                tabProperties.setState(ScriptState.done);
                tabService.closeTab(tabProperties);
                oneMinuteSignup.MessageService.sendDone(tabProperties.appId, tabProperties.type);
                if (tabProperties.type === ScriptType.change) {
                    _addSiteToVault(tabProperties.appName, tabProperties.appId, tabProperties.appLoginUrl, tabProperties.username, tabProperties.newPassword);
                }
            }
        }
    }

    function _handleError(message, tabProperties) {
        if (tabProperties) {
            if (tabProperties.currentState === ScriptState.done) {
                oneMinuteSignup.MessageService.sendLog(tabProperties.appId, tabProperties.type, 'Script done but got Error');
            } else {
                tabProperties.setState(ScriptState.done);
                tabService.closeTab(tabProperties);
                if (message && message.error) {
                    message.error.message = JSON.stringify(
                        {
                            exception: message.error.message,
                            loginUrl: tabProperties.appLoginUrl,
                            appName: tabProperties.appName,
                            appId: tabProperties.appId,
                            scriptType: tabProperties.type,
                            url: tabProperties.url
                        }
                    );
                }
                oneMinuteSignup.MessageService.sendError(message || {}, tabProperties.appId, tabProperties.url, tabProperties.type);
            }
        }
    }

    function _handleCloseTab(message) {
        var tabProperties = tabService.getTabPropertiesByAppId(message.appId);
        tabService.closeTab(tabProperties);
    }

    function _getOauthToken(message, tabId) {
        fromAuthTabId = tabId;
        tabService.createTab({url: message.url}, function(newTabId){
            authTabId = newTabId;
            tabService.focusTabById(newTabId);
        });
    }

    function _receivedOauthToken(message) {
        oneMinuteSignup.ExtensionProxyService.focusTabById(fromAuthTabId);
        oneMinuteSignup.MessageService.sendOauthToken(message.token, message.state);
        tabService.closeTab({tabId: authTabId});
    };

    function _addSiteToVault(appName, appId, url, usernamep, password) {
        var data = {
            url: url,
            formdata2: '',
            group: get_default_group(url) || "(none)",
            name: appName,
            username: usernamep,
            password: password,
            notes: '',
            orig_username: usernamep,
            orig_password: password
        };

        if (!lploggedin) {
            //We should handle this better.
            return null;
        }

        var url = punycode.URLToASCII(data.url);
        var formdata2 = data.formdata2;          // long stringbuf
        var name = data.name;                    // string
        var appGroupName = data.group;                  // probably a string
        var username = data.username;            // string
        var password = data.password;            // string
        var notes = '';
        var orig_username = data.orig_username;  // string
        var orig_password = data.orig_password;  // string

        var has_formdata = (formdata2 != null && formdata2.length > 0) ? true : false;

        var shareinfo = issharedfolder(g_shares, appGroupName);
        if (!checkreadonly(shareinfo)) {
            return {error: gs('Sorry, this shared folder is read-only.')};
        }

        var key = shareinfo == false ? g_local_key : shareinfo['sharekey'];
        var acct = createNewAcct();
        var newtld = lp_gettld_url(AES._utf8_encode(url));
        acct['genpw'] = false;
        acct['name'] = name;
        acct['group'] = appGroupName;
        acct['url'] = AES._utf8_encode(url);
        acct['tld'] = newtld;
        acct['unencryptedUsername'] = username;
        acct['username'] = lpmenc(username, true, key);
        acct['password'] = lpmenc(password, true, key);
        acct['extra'] = '';
        acct['fav'] = 0;
        acct['autologin'] = 0;
        acct['never_autofill'] = 0;
        acct['pwprotect'] = 0;
        acct['aid'] = '0';
        if (shareinfo != false) {
            acct['sharefolderid'] = shareinfo['id'];
            if (shareinfo['give'] == 0) {
                acct['sharedfromaid'] = 1;
            }
        }
        var groupserver = appGroupName;
        if (shareinfo) {
            //If this is a share, take off the prepended Share name
            groupserver = appGroupName.substr(shareinfo['decsharename'].length + 1);
        }
        acct['fields'] = new Array();

        acct['save_all'] = data['save_all'] ? 1 : 0;
        var newvalues = [];
        var origdata = {
            save_all: 0,
            username: orig_username,
            password: orig_password,
            new_username: username,
            new_password: password,
            fromiframe: 1
        };

        var formdata = updateAndEncryptData(formdata2, acct['fields'], newvalues, acct, key, origdata);

        var postdata = "name=" + en(lpenc(name, key)) + "&grouping=" + en(lpenc(groupserver, key)) +
            "&data=" + en(bin2hex(formdata)) + "&extra=" + en(lpenc(notes, key));
        postdata += '&extjs=1&localupdate=1';
        postdata += (shareinfo == false ? "" : "&sharedfolderid=" + en(shareinfo['id']));
        acct.newvalues = newvalues;

        if (has_formdata) {
            postdata += "&ref=" + en(AES.url2hex(url));
        } else {

            postdata += "&aid=0";
            postdata += "&url=" + en(AES.url2hex(url));
            postdata += "&openid_url=";
            postdata += "&username=" + en(crypto_btoa(acct['username']));
            postdata += "&password=" + en(crypto_btoa(acct['password']));

            postdata += "&auto=1" + get_identity_param();

            var isApp = is_application(acct);
            var id = isApp ? acct.appaid : acct.aid;
            var data2 = {
                url: base_url + (isApp ? "addapp.php" : "show.php"),
                postdata: postdata,
                successCallback: function (req, response) {
                    var result = req.responseXML.documentElement.getElementsByTagName('result')[0];
                    if (result) {
                        var action = result.getAttribute('action');
                        if (action === "added") {
                            var aid = result.getAttribute('aid');
                            oneMinuteSignup.MessageService.sendSavedToVault(appId, appGroupName, password, aid);
                        }
                    }
                },
                acct: acct
            };

            // web request sometimes returns empty response
            // using successCallback in error is a workaround
            lpMakeRequest(data2.url,
                postdata,
                data2.successCallback, // success 
                data2.successCallback, // error
                data);
        }

    }

    function _scriptTimeoutHandler(tabProperties) {
        tabProperties.setState(ScriptState.done);
        tabService.closeTab(tabProperties);
        var mockError = new Error('Script timeout');
        var message = {
            error: {
                name: mockError.name,
                stack: mockError.stack,
                message: JSON.stringify({
                    exception: 'Script timeout',
                    loginUrl: tabProperties.appLoginUrl,
                    appName: tabProperties.appName,
                    appId: tabProperties.appId,
                    scriptType: tabProperties.type,
                    url: tabProperties.url
                })
            },
            type: oneMinuteSignup.MessageType.Error,
            appId: '',
            scriptType: ''
        };
        oneMinuteSignup.MessageService.sendError(message, tabProperties.appId, tabProperties.url, tabProperties.type);
    }
})();