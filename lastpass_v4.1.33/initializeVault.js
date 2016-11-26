document.addEventListener("DOMContentLoaded",function(){chrome.runtime.getBackgroundPage(function(a){window.bg=a.LPPlatform.getBackgroundInterface();Topics.get(Topics.INITIALIZED).publish()})});
