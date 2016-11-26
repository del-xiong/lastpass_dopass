var IntroTutorialUtils = IntroTutorialUtils || (function() {
  function _setIFramePosition(iframeDiv, data){
    try {
      var tutorialData = {};
      if(data) {
        tutorialData = data['tutorialStatus'] || data['tutorialData'];
      } else {
        //this case should happen when we come from the event handler for resize or scroll
        iframeDiv = document.getElementsByClassName('lpiframeoverlay')[0];
        tutorialData.domain = document.domain;
      }

      if(document.URL.toLowerCase().includes(tutorialData.domain)){
        var targetEl;
        if (tutorialData.domain.includes('google.com')){
          targetEl = document.getElementById('Email');
          if (targetEl.className.includes('hidden')){
            targetEl = document.getElementById('Passwd');
          }
        } else if (tutorialData.domain.includes('amazon.com')){
          targetEl = document.getElementById('ap_email');
        } else if (tutorialData.domain.includes('facebook.com')){
          if (document.getElementById('email')){
            targetEl = document.getElementById('email');
          } else {
            targetEl = document.getElementById('pass');
          }

        } else if (tutorialData.domain.includes('netflix.com')){
          targetEl = document.getElementsByName('email')[0];
          if (targetEl.type.includes('hidden')){
            targetEl = document.getElementsByName('password')[0];
          }
        }
        iframeDiv.style.top = targetEl.getBoundingClientRect().top - 45 + 'px';
        iframeDiv.style.left = targetEl.getBoundingClientRect().left - 390 + 'px';
      }
    } catch(ex) {
      console.log("Error in setIFramePosition: " + ex.message);
    }
  }
  function _introTutorialHelpDialogConfig(data, doc) {
    var docURL = doc.URL.toLowerCase();
    if(docURL.includes(data['tutorialStatus'].domain)) {
      if(docURL.includes('amazon.com/gp/yourstore/home')) { //patch to fis 'SaveSite' for amazon
        document.location = 'https://www.amazon.com/ap/cnep?_encoding=UTF8&openid.assoc_handle=usflex';
      }
      if( docURL.includes('netflix.com/login') ||
          docURL.includes('facebook.com/login.php') ||
          docURL.includes('facebook.com/?stype=lo') ||
          docURL.includes('accounts.google.com/servicelogin') ||
          docURL.includes('accounts.google.com/addsession') ||
          docURL.includes('amazon.com/ap/signin')
        ) {
        bg.IntroTutorial.setState({ firstLogin: false });
        data['do_tutorial'] = true;
        data['iframe_size'] = 'dialog';
        lpshownotification('add', data);
      }
      else {
        bg.IntroTutorial.setState({ firstLogin: false });
        if(data['tutorialStatus'].firstLogin &&
          docURL.includes('facebook')) {
          data['do_interstitial'] = true;
          data['iframe_size'] = 'full';
          lpshownotification('add', data);
          //SUPER DUPER FRAGILE
          document.getElementsByClassName('_5lxs')[0].click();
          setTimeout(function(){
            document.getElementsByClassName('_w0d')[0].submit();
          }, 2000);
        }
        if(data['tutorialStatus'].firstLogin &&
          (docURL.includes('https://www.netflix.com/logout') ||
           docURL.includes('https://www.netflix.com/SignOut'))) {
          document.location = 'https://www.netflix.com/Login';
        }
      }
    }
  }
  function _showTryAgain(data, urlextra) {
    if(data['tutorialData'] &&
      document.URL.includes(data['tutorialData'].domain) &&
      data['notificationdata'].includes(data['tutorialData'].domain)) {

      urlextra += '&hideoverlay=1';

      if(data['cmd'] === 'showaddnotification'){
        docURL = document.URL.toLowerCase();

        if(docURL.includes('facebook.com/login')
          || docURL.includes('netflix.com/login')
          || docURL.includes('amazon.com/ap/signin')
          || docURL.includes('accounts.google.com/signin/challenge/sl/password')
          || docURL.includes('accounts.google.com/serviceloginauth')
          || docURL.includes('accounts.google.com/addsession#password')){

          urlextra += '&showtryagain=1';
          data['iframe_size'] = 'dialog';
        }
        else {
          data['iframe_size'] = 'full';
          urlextra += '&showadddialog=1';
        }
      }

    }
    return urlextra;
  }
  return {
    setIFramePosition: _setIFramePosition,
    introTutorialHelpDialogConfig: _introTutorialHelpDialogConfig,
    showTryAgain: _showTryAgain
  };
})();

var IntroTutorialHelpDialog = IntroTutorialHelpDialog || function() {

};

(function() {
  'use strict';
  IntroTutorialHelpDialog.prototype._dialog = null;
  IntroTutorialHelpDialog.prototype._options = {
    makeShade: false,
    alignBottom: false,
    addHide: false,
    transparentBG: false,
    textChoice: ''
  };

  IntroTutorialHelpDialog.prototype.setBackgroundTransparent = function (_document, transparentBG) {
    if(_document && transparentBG) {
      document.body.style.background = 'transparent';
    }
  };
  IntroTutorialHelpDialog.prototype.getTranslateFn = function() {
    if(typeof(bg) != 'undefined' && typeof(bg.gs) == 'function') {
      return bg.gs;
    }
    else if(typeof(gs) == 'function') {
      return gs;
    }
    else {
      return null;
    }
  };
  IntroTutorialHelpDialog.prototype.setArrow = function (_document, arrow) {
    var dialog = IntroTutorialHelpDialog.prototype._dialog;
    if(_document && dialog && arrow){
      dialog.className += ' arrow_box';
      switch(arrow.orientation) {
        case 'top':
          dialog.className += ' a-top';
          break;
        case 'bottom':
          dialog.className += ' a-bottom';
          break;
        case 'left':
          dialog.className += ' a-left';
          break;
        case 'right':
          dialog.className += ' a-right';
          break;
      }
      switch(arrow.position) {
        case 'left':
          dialog.className += ' a-h-left';
          break;
        case 'center':
          dialog.className += ' a-h-center';
          break;
        case 'right':
          dialog.className += ' a-h-right';
          break;
        case 'high':
          dialog.className += ' a-v-high';
          break;
        case 'middle':
          dialog.className += ' a-v-middle';
          break;
        case 'low':
          dialog.className += ' a-v-low';
          break;
      }
    }
  };
  IntroTutorialHelpDialog.prototype.createDialog = function (_document, textChoice) {
    var translateFn = IntroTutorialHelpDialog.prototype.getTranslateFn();

    if (_document && translateFn) {
      var dialog = _document.createElement('div');
      dialog.className = 'tutorialDialog';
      var textDiv = _document.createElement('div');
      textDiv.className = 'dialogTextDiv';
      var text1 = _document.createElement('p');
      text1.className = 'topText';
      var text2 = _document.createElement('p');
      text2.className = 'bottomText';
      switch (textChoice) {
        case 'saveSite':
          text1.innerHTML = translateFn('Easy, right?');
          text2.innerHTML = translateFn('Now just save it to your vault.');
          break;
        case 'siteLanding':
          text1.innerHTML = translateFn('Good choice!');
          text2.innerHTML = translateFn('Next, sign in to your account.');
          break;
        case 'tryAgain':
          text1.innerHTML = translateFn('Login failed');
          text2.innerHTML = translateFn('Please try again.');
          break;
        case 'finishSaveSite':
          text1.innerHTML = translateFn('Customize and Save');
          text2.innerHTML = translateFn('You can set these details for each site');
          break;
        case 'downloadImporter':
          text1.innerHTML = translateFn('The LastPass Importer is downloading');
          text2.innerHTML = translateFn("When it's done, just run it!");
          setTimeout(function() {dialog.remove(_document);}, 15000);
          break;
        case 'interstitial':
          text1.innerHTML = translateFn('Just a second...');
          text2.innerHTML = translateFn('Logging you out');
          dialog.style.margin = '15px auto 0px auto';
          break;
      }
      textDiv.appendChild(text1);
      textDiv.appendChild(text2);
      dialog.appendChild(textDiv);

      return dialog;
    }
    else return null;
  };
  IntroTutorialHelpDialog.prototype.setAlignment = function (alignBottom) {
    var dialog = IntroTutorialHelpDialog.prototype._dialog;
    if (dialog && alignBottom) {
      dialog.className += ' downloadDialog';
    }
  };
  IntroTutorialHelpDialog.prototype.setFooter = function (_document, addHide) {
    var translateFn = IntroTutorialHelpDialog.prototype.getTranslateFn();
    var dialog = IntroTutorialHelpDialog.prototype._dialog;
    if(_document && dialog){
      var footerDiv = _document.createElement('div');
      footerDiv.className = 'footerDiv';
      var lpLogo = _document.createElement('img');
      lpLogo.className = 'dialogLPLogo';
      lpLogo.src = 'images/vault_4.0/LastPass_Color_Small.png';
      footerDiv.appendChild(lpLogo);
      if (addHide) {
        var hideDiv = _document.createElement('div');
        hideDiv.className = 'hideDiv';
        var hideP = _document.createElement('p');
        hideP.className = 'hideP';
        hideP.innerHTML = translateFn('Hide');
        hideDiv.addEventListener('click', function() {
          IntroTutorialHelpDialog.prototype.remove(_document);
        });
        hideDiv.appendChild(hideP);
        footerDiv.appendChild(hideDiv);
      }
      dialog.appendChild(footerDiv);
    }
  };
  IntroTutorialHelpDialog.prototype.setShade = function (_document, makeShade, textChoice) {
    if (_document && makeShade) {
      var shade = _document.createElement('div');
      if (textChoice === 'interstitial'){
        shade.className = 'interstitialShade';
      } else {
        shade.className = 'shade';
      }
      _document.body.appendChild(shade);
    }
  };
  IntroTutorialHelpDialog.prototype.setPosition = function(position) {
    try {
      var dialog = IntroTutorialHelpDialog.prototype._dialog;

      if (dialog && position && position.positionFn && typeof(position.positionFn) == 'function') {
        var pos = position.positionFn();
        if (pos && pos.top && pos.left) {
          pos.top += (position.offset && position.offset.top) ? position.offset.top : 0;
          pos.left += (position.offset && position.offset.left) ? position.offset.left : 0;

          dialog.style.position = 'absolute';
          dialog.style.top = pos.top + 'px';
          dialog.style.left = pos.left + 'px';
        }
      }
    }
    catch (ex) {
      console.log("Error in IntroTutorialHelpDialog.setPosition: " + ex.message);
    }
  };

  //Window resize events
  IntroTutorialHelpDialog.prototype.subscribeToWindowResize = function() {
    if (window) {
      window.addEventListener("resize", IntroTutorialHelpDialog.prototype.windowResizeHandler);
      if(typeof(Topics) != "undefined"){
        Topics.get(Topics.DIALOG_RESIZE).subscribe(function(event) {
          IntroTutorialHelpDialog.prototype.windowResizeHandler();
        });
      }
    }
  };
  IntroTutorialHelpDialog.prototype.unSubscribeToWindowResize = function() {
    if (window && IntroTutorialHelpDialog.prototype.windowResizeHandler) {
      if (window.removeEventListener) {                   // For all major browsers, except IE 8 and earlier
        window.removeEventListener("resize", IntroTutorialHelpDialog.prototype.windowResizeHandler);
      } else if (window.detachEvent) {                    // For IE 8 and earlier versions
        window.detachEvent("resize", IntroTutorialHelpDialog.prototype.windowResizeHandler);
      }
      IntroTutorialHelpDialog.prototype.windowResizeHandler = null;
    }
  };
  IntroTutorialHelpDialog.prototype.windowResizeHandler = function(eventObject) {
    IntroTutorialHelpDialog.prototype.setPosition(IntroTutorialHelpDialog.prototype._options.position);
  };

  IntroTutorialHelpDialog.prototype.initialize = function(_document, _options) {
    try {
      IntroTutorialHelpDialog.prototype._options = _options || IntroTutorialHelpDialog.prototype._options;
      IntroTutorialHelpDialog.prototype.setBackgroundTransparent(_document, _options.transparentBG);
      IntroTutorialHelpDialog.prototype._dialog = IntroTutorialHelpDialog.prototype.createDialog(_document, _options.textChoice);
      IntroTutorialHelpDialog.prototype.setFooter(_document, _options.addHide);
      IntroTutorialHelpDialog.prototype.setArrow(_document, _options.arrow);
      IntroTutorialHelpDialog.prototype.setAlignment(_options.alignBottom);

      if(_options.position) {
        IntroTutorialHelpDialog.prototype.setPosition(_options.position);
        IntroTutorialHelpDialog.prototype.subscribeToWindowResize();
      }
      else {
        IntroTutorialHelpDialog.prototype.unSubscribeToWindowResize();
      }

      var mainElement = _document.getElementById(_options.appendElementId);
      if(mainElement) {
        mainElement.appendChild(IntroTutorialHelpDialog.prototype._dialog);
      }
      else {
        _document.body.appendChild(IntroTutorialHelpDialog.prototype._dialog);
      }
      IntroTutorialHelpDialog.prototype.setShade(_document, _options.makeShade, _options.textChoice);
    }
    catch (ex) {
      console.log("Error in IntroTutorialHelpDialog.initialize: " + ex.message);
    }
  };
  IntroTutorialHelpDialog.prototype.remove = function(_document) {

    IntroTutorialHelpDialog.prototype.unSubscribeToWindowResize();
    _document.getElementsByClassName('tutorialDialog')[0].remove();
    if (_document.getElementsByClassName('shade')[0]){
      _document.getElementsByClassName('shade')[0].remove();
      window.top.postMessage('minimizeIframe', '*');
    }
  };
})();
