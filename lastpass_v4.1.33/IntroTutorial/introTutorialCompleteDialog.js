var IntroTutorialCompleteDialog = function(dialog) {
  Dialog.call(this, dialog, {
    closeButtonEnabled: false,
    maximizeButtonEnabled: false,
    dynamicHeight: true,
    hideHeader: true,
    hideButtons: true,
    confirmOnClose: false
  });
};

// Extend Dialog
IntroTutorialCompleteDialog.prototype = Object.create(Dialog.prototype);
IntroTutorialCompleteDialog.prototype.constructor = IntroTutorialCompleteDialog;

(function() {

  IntroTutorialCompleteDialog.prototype.initialize = function(element, data) {
    Dialog.prototype.initialize.apply(this, arguments);

    (function(dialog) {
      var oms = bg.get('g_one_minute_signup_enabled');
      var noThanksElement = element.find('#noThanks, #btnClose');
      var siteName = element.find('#siteName');

      function segmentCongratsPage(action){
        if (oms){
          return bg.sendLpImprove('congratspage', {'source':'congratspage', 'tour':'oms', 'action':action});
        } else {
          return bg.sendLpImprove('congratspage', {'source':'congratspage', 'tour':'singlesite', 'action':action});
        }
      }

      // trigger button according to feature flag
      if (oms) { _bindAddEmailSites(); }
      else { _bindImporter(); }


      if(data && data.tutorialState && data.tutorialState.name) {
        siteName.text(' ' + data.tutorialState.name + ' ');
      }

      // no thanks
      noThanksElement.bind('click', function(event) {
        segmentCongratsPage('nothanks');
        event.preventDefault();
        dialog.close(true);
      });

      // add sites from email
      function _bindAddEmailSites(){
        var addEmailSites = element.find('#welcomeTutoiralSecondAction');
        addEmailSites.text(Strings.translateString('Add sites from email'));
        addEmailSites.show();
        addEmailSites.bind('click', function(event) {
          oneMinuteSignup.show(oneMinuteSignup.modes.normal);
          segmentCongratsPage('addsitefromemail');
          dialog.close(true);
        });
      }

      // import sites
      function _bindImporter(){
        var downloadImporter = element.find('#welcomeTutoiralSecondAction');
        downloadImporter.text(Strings.translateString('Download Importer'));
        downloadImporter.show();
        downloadImporter.bind('click', function(event) {
          event.preventDefault();
          if(LPPlatform.showDownloader()) {
            dialogs.introTutorialHelp.open({
              alignBottom: true,
              addHide: true,
              textChoice: 'downloadImporter',
              arrow: {
                orientation: 'bottom',
                position: 'left'
              },
              postSetup: function() {
                window.location = LPProxy.getBaseURL() + 'installer';
              }
            });
          } else {
            window.location = LPProxy.getBaseURL() + 'installer';
          }
          segmentCongratsPage('importsites');
          dialog.close(true);
        });
      }

      // set intro tut to false
      LPProxy.setPreferences('ShowIntroTutorial', false);
      bg.IntroTutorial.setState({ enabled: false });

    })(this);
  };

})();
