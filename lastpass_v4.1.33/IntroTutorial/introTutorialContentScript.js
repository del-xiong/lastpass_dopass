(function() {
  
  "use strict";
  
  var handleIntroTutorial = function(handler) {
    bg.IntroTutorial.getState(function(state) {
      if (state.enabled && document.location.host.toLowerCase().includes(state.domain)) {
        handler(state);
      }
    });
  };
  
  Topics.get(Topics.SITE_NOTIFICATION_STATE).subscribe(function(notification) {
    
    handleIntroTutorial(function(state) {
      
      var getTrackingElement = function() {
        var trackingElement = null;
        switch (state.domain) {
          case 'google.com': {
            trackingElement = document.getElementById('Email');
            if (!trackingElement || trackingElement.className.includes('hidden')) {
              trackingElement = document.getElementById('Passwd');
            }
            break;
          }
          case 'amazon.com': {
            trackingElement = document.getElementById('ap_email');
            break;
          }
          case 'facebook.com': {
            trackingElement = document.getElementById('email');
            if (!trackingElement) {
              trackingElement = document.getElementById('pass');
            }
            break;
          }
          case 'netflix.com': {
            trackingElement = document.getElementsByName('email')[0];
            if (trackingElement.type.includes('hidden')) {
              trackingElement = document.getElementsByName('password')[0];
            }
            break;
          }
        }
        return trackingElement;
      };
      
      var isLoginPage = function() {
        var docURL = document.URL.toLowerCase();
        var isLoginPage = docURL.includes('login') ||
               docURL.includes('facebook.com/?stype=lo') ||
               docURL.includes('accounts.google.com/addsession') ||
               docURL.includes('signin');
        return isLoginPage && getTrackingElement() !== null;
      };
      
      var getLoginPage = function() {
        switch (state.domain) {
          case 'facebook.com': {
            LPFrame.openDialog("introTutorialHelp", {
              addHide: false,
              modal: true,
              textChoice: 'loggingout',
            }).css({
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              margin: "auto"
            });
            //SUPER DUPER FRAGILE
            document.getElementsByClassName('_5lxs')[0].click();
            setTimeout(function(){
              document.getElementsByClassName('_w0d')[0].submit();
            }, 2000);
            break;
          }
          case 'netflix.com': {
            var docURL = document.URL;
            if (docURL.includes('logout') || docURL.includes('SignOut')) {
              document.location = 'https://www.netflix.com/Login';
            }
            break;
          }
        }
      };
      
      if (isLoginPage()) {
        bg.IntroTutorial.setState({ firstLogin: false });
        var dialog;
        if (notification.formSubmitted && !notification.formSucceeded) {
          dialog = LPFrame.openDialog("introTutorialHelp", {
            addHide: true,
            textChoice: 'tryAgain',
            arrow: {
              orientation: 'right',
              position: 'middle'
            }
          });
        }
        else {
          dialog = LPFrame.openDialog("introTutorialHelp", {
            addHide: true,
            textChoice: 'siteLanding',
            arrow: {
              orientation: 'right',
              position: 'middle'
            }
          });
        }
        dialog.trackElement({
          element: getTrackingElement(),
          frameTranslation: {
            x: "-100%",
            y: "-50%"
          },
          targetTranslation: {
            x: -10,
            y: "50%"
          }
        });
      }
      else if (state.firstLogin) {
        getLoginPage();
      }
      
    });
    
    Topics.get(Topics.SITE_NOTIFICATION).subscribe(function(dialogFrame) {
      handleIntroTutorial(function() {
        setTimeout(function() {
          dialogFrame.getInterface().LPDialog.openDialog('introTutorialHelp', {
            addHide: true,
            modal: true,
            siteName: notification.defaultData.name,
            textChoice: 'saveSite',
            parentDialog: 'contentScriptSite',
            css: {
              position: "absolute",
              top: "100%",
              'margin-top': "10px",
              'margin-right': 0,
              right: 0
            },
            arrow: {
              orientation: 'top',
              positionTarget: '#submit'
            }
          });
        }, 1000);
      });
    });
    
  });
  
})();
