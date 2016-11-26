chrome.runtime.onMessage.addListener(function (request) {
    request.fromExtension = true;
    window.postMessage(request, 'https://1min-ui-prod.service.lastpass.com');
});

var version = 0;
if (chrome.runtime.getManifest) {
	version = chrome.runtime.getManifest().version;
}

document.body.setAttribute('lastpass-extension-id', chrome.runtime.id || '0');
document.body.setAttribute('lastpass-extension-version', version);
       
window.addEventListener('message', function (message) {
    if (!message.data.fromExtension) {
        chrome.runtime.sendMessage(message.data, function (response) {

        });
    }
});