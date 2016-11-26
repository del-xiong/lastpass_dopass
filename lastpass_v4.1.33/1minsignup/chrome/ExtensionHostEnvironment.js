var LastPass = LastPass || {};
LastPass.Extension = LastPass.Extension || {};

LastPass.Extension.ExtensionHostEnvironment = (function () {
    function reportDone() {
        chrome.runtime.sendMessage({type: 'Done'});
    }

    function reportCaptchaDetected() {
        chrome.runtime.sendMessage({type: 'CaptchaDetected'});
    }

    function userInformationNeeded() {
        chrome.runtime.sendMessage({type: 'UserInformationNeeded'});
    }

    function reportError(error) {
        chrome.runtime.sendMessage({
            type: 'Error',
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                details: {
                    location: window.location.href,
                    userAgent: navigator.userAgent
                }
            }
        });
    }

    function reportLog(log) {
        console.log(log);
    }

    function isMobile() {
        return false;
    }

    function getEnvironment() {
        return LastPass.Web.Automation.Environments.chrome;
    }

    return {
        reportDone: reportDone,
        reportCaptchaDetected: reportCaptchaDetected,
        userInformationNeeded: userInformationNeeded,
        reportError: reportError,
        reportLog: reportLog,
        isMobile: isMobile,
        getEnvironment: getEnvironment
    }

})();