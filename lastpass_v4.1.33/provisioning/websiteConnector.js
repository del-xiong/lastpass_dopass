var sendBackground = LPPlatform.requestFrameworkInitializer(function(message) {
  window.postMessage(message, window.location.origin);
});

window.addEventListener('message', function(ev) {
  if (ev.origin === window.location.origin) {
	sendBackground(ev.data);
  }
});
