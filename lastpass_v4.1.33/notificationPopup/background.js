var omsNotification = (function () {

  var _popup = {
    opened: false,
    tabInterface: null,
    dialogId: -1
  };
  var _intervalId = -1;
  var _notificationSeen = false;
  var _notificationSeenTimeStamp;

  _init();
  return {
    startOms: _startOms,
    cancelNotification: _cancelNotification,
    postponeNotification: _postponeNotification,
    setState: _setState,
    getState: _getState
  };

  function _init() {
    _subscribeTabEvents();
    _intervalId = setInterval(function () {
      LPPlatform.getCurrentTab(function (tabInterface) {
        _showPopup(tabInterface);
      });
    }, 10 * 1000);
  }

  function _startOms() {
    var elapsedTimeInSec = (Date.now() - _getNotificationSeenTimeStamp()) / 1000;
    _hidePopup();
    openvault(false, "omsstart", function (tab) {
      sendLpImprove('oneminute::notificationomsstart', {
        "provider": parseEmailProvider(),
        "elapsedTimeInSec": elapsedTimeInSec.toFixed()});
    });
  }

  function _cancelNotification() {
    var elapsedTimeInSec = (Date.now() - _getNotificationSeenTimeStamp()) / 1000;
    _setState(oneMinuteSignup.FeatureState.cancel);
    _hidePopup();
    sendLpImprove('oneminute::notificationclose', {"elapsedTimeInSec": elapsedTimeInSec.toFixed()});
  }

  function _postponeNotification() {
    var elapsedTimeInSec = (Date.now() - _getNotificationSeenTimeStamp()) / 1000;
    _setState(oneMinuteSignup.FeatureState.postpone);
    _hidePopup();
    localStorage_setItem(db_prepend('oms_postponed_date'), Date.now());
    sendLpImprove('oneminute::notificationnotnowclicked', {"elapsedTimeInSec": elapsedTimeInSec.toFixed()});
  }

  function _subscribeTabEvents() {
    LPPlatform.onTabActivated(function (tabInterface) {
      if (_popup.opened) {
        _hidePopup();
        _popup.tabInterface = tabInterface;
        _showPopup(tabInterface);
      }
    });
    LPPlatform.onTabUpdated(function (tabInterface) {
      if (_popup.opened && tabInterface.tabDetails.tabID === _popup.tabInterface.tabDetails.tabID) {
        _popup.opened = false;
        _popup.tabInterface = tabInterface;
        _showPopup(tabInterface);
      }
    });
  }

  function _showPopup(tabInterface) {
    var state = OmsNotificationPopup.getState();

    if (!g_onemin_advert_enabled || _sitesCount() > g_onemin_advert_app_threshold) {
      return;
    }

    if (_popup.opened || state === oneMinuteSignup.FeatureState.started || state === oneMinuteSignup.FeatureState.cancel) {
      return;
    }

    if (state === oneMinuteSignup.FeatureState.postpone) {
      var postponedDate = parseInt(localStorage_getItem(db_prepend('oms_postponed_date')));
      var postponedThreshold = parseInt(localStorage_getItem(db_prepend('oms_postponed_threshold_days')));
      postponedThreshold = isNaN(postponedThreshold) ? 7 : postponedThreshold;
      var sevenDaysInMs = postponedThreshold * 24 * 60 * 60 * 1000;
      if (Date.now() - postponedDate < sevenDaysInMs) {
        return;
      }
    }

    if (!_notificationSeen) {
      _notificationSeenTimeStamp = Date.now();
      _notificationSeen = true;
      sendLpImprove('oneminute::notificationshown');
    }

    var frame = tabInterface.getTop().LPFrame;
    frame.openDialog("omsNotificationPopup", {provider: parseEmailProvider()}, {
      css: {
        top: 0,
        right: 0
      },
      callback: function (dialogId) {
        _popup.dialogId = dialogId;
      }
    });
    _popup.opened = true;
    _popup.tabInterface = tabInterface;
  }

  function _getNotificationSeenTimeStamp() {
    return _notificationSeenTimeStamp;
  }

  function _setState(newState) {
    switch (newState) {
      case oneMinuteSignup.FeatureState.started:
        localStorage_setItem(db_prepend('oms_state'), oneMinuteSignup.FeatureState.started);
        break;
      case oneMinuteSignup.FeatureState.cancel:
        localStorage_setItem(db_prepend('oms_state'), oneMinuteSignup.FeatureState.cancel);
        break;
      case oneMinuteSignup.FeatureState.postpone:
        localStorage_setItem(db_prepend('oms_state'), oneMinuteSignup.FeatureState.postpone);
        break;
    }
  }

  function _getState() {
    return localStorage_getItem(db_prepend('oms_state'));
  }

  function _sitesCount() {
    var count = 0;
    for (var i in g_sites) {
      if (g_sites.hasOwnProperty(i)) {
        count++;
      }
    }
    return count;
  }

  function parseEmailProvider() {
    if (g_username) {
        if (g_username.indexOf("@gmail") !== -1) {
          return "Gmail";
        }
        if (g_username.indexOf("@yahoo") !== -1) {
          return "Yahoo";
        }
        if (g_username.indexOf("@outlook") !== -1) {
          return "Office365";
        }
    }
    return "Unknown";
  }

  function _hidePopup() {
    _popup.opened = false;
    var dialogId = _popup.dialogId;
    if (dialogId && _popup.tabInterface) {
      LPTabs.get({
        tabID: _popup.tabInterface.tabDetails.tabID,
        callback: function (tabInterface) {
          var frame = tabInterface.getTop().LPFrame;
          frame.close(dialogId);
        }
      });
    }
  }

}());
