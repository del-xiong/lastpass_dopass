var oneMinuteSignup = oneMinuteSignup || {};
oneMinuteSignup.MessageService = {
    tabId: null,
    sendDone: function (appId, scriptType) {
        oneMinuteSignup.ExtensionProxyService.sendMessageToSite({
            type: oneMinuteSignup.MessageType.Done,
            appId: appId,
            scriptType: scriptType
        }, this.tabId);
    },
    sendSavedToVault: function (appId, groupName, password, aid) {
        oneMinuteSignup.ExtensionProxyService.sendMessageToSite({
            type: oneMinuteSignup.MessageType.SavedToVault,
            appId: appId,
            groupName: groupName,
            password: password,
            aid: aid
        }, this.tabId);
    },
    sendUserInfoNeeded: function (appId, scriptType) {
        oneMinuteSignup.ExtensionProxyService.sendMessageToSite({
            type: oneMinuteSignup.MessageType.UserInformationNeeded,
            appId: appId,
            scriptType: scriptType
        }, this.tabId);
    },
    sendLog: function (appId, scriptType, message) {
        oneMinuteSignup.ExtensionProxyService.sendMessageToSite({
            type: oneMinuteSignup.MessageType.Log,
            message: message,
            appId: appId,
            scriptType: scriptType
        }, this.tabId);
    },
    sendError: function (baseData, appId, loginUrl, scriptType) {
        baseData.type = oneMinuteSignup.MessageType.Error;
        baseData.appId = appId;
        baseData.scriptType = scriptType;
        oneMinuteSignup.ExtensionProxyService.sendMessageToSite(baseData, this.tabId);
    },
    sendToken: function () {
        oneMinuteSignup.ExtensionProxyService.sendMessageToSite({
            type: 'extensiontoken',
            token: g_token,
            sessionid: lp_phpsessid
        }, this.tabId);
    },
    sendOauthToken: function (token, state) {
        oneMinuteSignup.ExtensionProxyService.sendMessageToSite({
            type: 'oauthtoken',
            token: token,
            state: state
        }, this.tabId);
    }
};
