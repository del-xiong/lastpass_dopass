var OmsNotificationPopupDialog = function (loader) {
    Dialog.call(this, loader, {
        submitDialog: false,
        confirmOnClose: false,
        hideButtons: true,
        hideHeader: true,
        additionalClasses: 'omsNotificationPopupDialog'
    });
};

// Extend Dialog
OmsNotificationPopupDialog.prototype = Object.create(Dialog.prototype);
OmsNotificationPopupDialog.prototype.constructor = OmsNotificationPopupDialog;

(function () {

    'use strict';

    OmsNotificationPopupDialog.prototype.initialize = function (element, data) {
        Dialog.prototype.initialize.apply(this, arguments);

        (function (dialog) {
            var btDefault = element.find("#btOmsStart");
            var btGoogle = element.find("#btOmsStartGoogle");
            var btYahoo = element.find("#btOmsStartYahoo");
            var btOffice = element.find("#btOmsStartO365");
            var provider = dialog.data.provider;
            switch (provider) {
                case "Gmail":
                    btDefault.hide();
                    btYahoo.hide();
                    btOffice.hide();
                    break;
                case "Yahoo":
                    btDefault.hide();
                    btGoogle.hide();
                    btOffice.hide();
                    break;
                case "Office365":
                    btDefault.hide();
                    btYahoo.hide();
                    btGoogle.hide();
                    break;
                default:
                    btGoogle.hide();
                    btYahoo.hide();
                    btOffice.hide();
                    break;
            }
            element.find("#btOmsStart, #btOmsStartGoogle, #btOmsStartYahoo, #btOmsStartO365").click(function () {
                _hideNotification(function () {
                    bg.OmsNotificationPopup.startOms();
                    dialog.close();
                });
            });
            element.find("#btNotNow").click(function () {
                _hideNotification(function () {
                    bg.OmsNotificationPopup.postponeNotification();
                    dialog.close();
                });
            });
            element.find("#btClose").click(function () {
                _hideNotification(function () {
                    bg.OmsNotificationPopup.cancelNotification();
                    dialog.close();
                });
            });

            _showNotification();

            function _hideNotification(callback) {
                element.find(".lp-popup").addClass("slide-out");
                element.find(".lp-popup").removeClass("slide-in");
                setTimeout(function () {
                    element.find(".lp-popup").hide();
                    if (typeof callback === "function") {
                        callback();
                    }
                }, 200);
            }

            function _showNotification() {
                element.find(".lp-popup").addClass("slide-in");
                element.find(".lp-popup").removeClass("slide-out");
            }

        })(this);
    };
})();

