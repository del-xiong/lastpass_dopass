var oneMinuteSignup = oneMinuteSignup || {};
oneMinuteSignup.TabProperties = function () {
    var self = this;
    this.scriptTimeout = null;                     // timeout for the current script running

    this.tab = null;
    this.tabId = null;

    this.appLoginUrl = null;
    this.url = null;
    this.appId = null;
    this.appName = null;
    this.type = null;
    this.username = null;
    this.newPassword = null;
    this.activeScript = null;               // Script to run
    this.activeTriggerScript = null;        // Script that starts the flow

    this.currentState = oneMinuteSignup.ScriptState.done;   // script running state

    this.setState = function setState(newState) {
        console.log('App: ' + self.appId + ' State: ' + newState);
        if (newState === oneMinuteSignup.ScriptState.done) {
            self.clearTimeout();
        }
        self.currentState = newState;
    };

    this.setTimeout = function (callback) {
        self.scriptTimeout = setTimeout(function () {
            callback(self);
        }, 30 * 1000);
    };

    this.clearTimeout = function () {
        clearTimeout(self.scriptTimeout);
    }
};
