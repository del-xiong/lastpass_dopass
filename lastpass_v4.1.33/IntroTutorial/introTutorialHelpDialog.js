var IntroTutorialHelpDialog = function(loader) {
  Dialog.call(this, loader, {
    submitDialog: false,
    confirmOnClose: false,
    hideButtons: true,
    hideHeader: true,
    additionalClasses: 'lmiDialog'
  });
};

// Extend Dialog
IntroTutorialHelpDialog.prototype = Object.create(Dialog.prototype);
IntroTutorialHelpDialog.prototype.constructor = IntroTutorialHelpDialog;

(function() {
  
  'use strict';
  
  IntroTutorialHelpDialog.prototype.blurPreviousDialog = function() {};
  IntroTutorialHelpDialog.prototype.focusPreviousDialog = function() {};
  
  IntroTutorialHelpDialog.prototype.setArrowClass = function (element, arrow) {
    if (arrow) {
      var className = 'arrow_box';
      switch(arrow.orientation) {
        case 'top':
          className += ' a-top';
          break;
        case 'bottom':
          className += ' a-bottom';
          break;
        case 'left':
          className += ' a-left';
          break;
        case 'right':
          className += ' a-right';
          break;
      }
      switch(arrow.position) {
        case 'left':
          className += ' a-h-left';
          break;
        case 'center':
          className += ' a-h-center';
          break;
        case 'right':
          className += ' a-h-right';
          break;
        case 'high':
          className += ' a-v-high';
          break;
        case 'middle':
          className += ' a-v-middle';
          break;
        case 'low':
          className += ' a-v-low';
          break;
      }
      if (arrow.positionTarget) {
        var dialogRect = element.get(0).getBoundingClientRect();
        var targetRect = $(arrow.positionTarget).get(0).getBoundingClientRect();
        var styleSheet = document.styleSheets[0];
        switch(arrow.orientation) {
          case 'top':
          case 'bottom': {
            var left = targetRect.left - dialogRect.left + targetRect.width / 2;
            styleSheet.insertRule('.arrow_box.a-top:before, .arrow_box.a-top:after { left: ' + left + 'px }', styleSheet.cssRules.length);
            break;
          }
          case 'left':
          case 'right': {
            var top = targetRect.top - dialogRect.top + targetRect.height / 2;
            styleSheet.insertRule('.arrow_box.a-top:before, .arrow_box.a-top:after { top: ' + top + 'px }', styleSheet.cssRules.length);
            break;
          }
        }
      }
      element.find('.tutorialDialog').addClass(className);
    }
  };

  IntroTutorialHelpDialog.prototype.initialize = function(element, data) {
    Dialog.prototype.initialize.apply(this, arguments);
    
    (function(dialog) {
      
      element.find('.hideButton').bind('click', function() {
        dialog.close();
      });
      
    })(this);
    
  };
  
  IntroTutorialHelpDialog.prototype.setup = function(element, data) {
    Dialog.prototype.setup.apply(this, arguments);
    
    var topText = element.find('.topText');
    var bottomText = element.find('.bottomText');
    switch (data.textChoice) {
      case 'saveSite':
      topText.text(Strings.translateString('Add site to your vault'));
      bottomText.text(Strings.translateString('Simply select "Add" and we will add %1 to your vault', data.siteName));
        break;
      case 'siteLanding':
        topText.text(Strings.translateString('Good choice!'));
        bottomText.text(Strings.translateString('Next, sign in to your account.'));
        break;
      case 'tryAgain':
        topText.text(Strings.translateString('Login failed'));
        bottomText.text(Strings.translateString('Please try again.'));
        break;
      case 'downloadImporter':
        topText.text(Strings.translateString('The LastPass Importer is downloading'));
        bottomText.text(Strings.translateString("When it's done, just run it!"));
        setTimeout(this.createHandler(this.close), 15000);
        break;
      case 'loggingout':
        topText.text(Strings.translateString('Just a second...'));
        bottomText.text(Strings.translateString('Logging you out'));
        break;
    }
    
    this.setArrowClass(element, data.arrow);
    
    if (data.parentDialog) {
      dialogs[data.parentDialog].getDialog().addChildDialog(this);
    }
    
    if (data.css) {
      element.css(data.css);
    }
    
    if (data.addHide) {
      element.addClass('allowHide');
    }
    
    if (data.alignBottom) {
      element.css({
        top: 'auto',
        right: 'auto',
        bottom: 15,
        left: 30
      });
    }
  };

})();
